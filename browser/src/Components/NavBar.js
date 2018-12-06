import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import deepOrange from "@material-ui/core/colors/deepOrange";
import LoginButton from "../Containers/LoginButton";
import ChPassBtn from "../Containers/ChPassBtn";
import MailServerButton from "../Components/MailServerButton";
import UserCreateButton from "./UserCreateButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

const styles = theme => ({
  root: {
    flex: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4
  },
  grow: {
    flexGrow: 1
  },
  orangeAvatar: {
    margin: 10,
    color: "#fff",
    backgroundColor: deepOrange[500]
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  button: {
    margin: theme.spacing.unit
  }
});

class NavBar extends React.Component {
  state = {
    open: false
  };

  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
  };

  render() {
    const { classes, loggedUser } = this.props;
    //console.log("User : ", loggedUser);
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              ENCUESTAS MEDILINK
            </Typography>
            {loggedUser.logged ? (
              <Avatar className={classes.orangeAvatar}>
                {loggedUser.user.name.split(" ").length > 1
                  ? loggedUser.user.name.split(" ")[0][0] +
                    loggedUser.user.name.split(" ")[1][0]
                  : loggedUser.user.name[0]}
              </Avatar>
            ) : (
              <div />
            )}
            <LoginButton />
            {loggedUser.logged ? (
              <List>
                <ListItem button onClick={this.handleClick}>
                  <ListItemText inset primary="Menu" />
                  {this.state.open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem button className={classes.nested}>
                      <MailServerButton />
                    </ListItem>
                    <ListItem button className={classes.nested}>
                      <UserCreateButton />
                    </ListItem>
                    <ListItem button className={classes.nested}>
                      <ChPassBtn />
                    </ListItem>
                  </List>
                </Collapse>
              </List>
            ) : (
              <div />
            )}
            {/* <LoginButton />
            {loggedUser.logged ? <ChPassBtn /> : <div />}
            {loggedUser.logged ? <MailServerButton /> : <div />}
            {loggedUser.logged ? <UserCreateButton /> : <div />} */}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  loggedUser: state.userReducer
});

export default connect(mapStateToProps)(withStyles(styles)(NavBar));
