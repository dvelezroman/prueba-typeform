import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import LoginButton from "../Containers/LoginButton";
import ChPassBtn from "../Containers/ChPassBtn";
import MailServerButton from "../Components/MailServerButton";
import UserCreateButton from "./UserCreateButton";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  button: {
    margin: theme.spacing.unit
  }
});

function NavBar(props) {
  const { classes, loggedUser } = props;
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            ENCUESTAS MEDILINK
          </Typography>
          <LoginButton />
          {loggedUser.logged ? <ChPassBtn /> : <div />}
          {loggedUser.logged ? <MailServerButton /> : <div />}
          {loggedUser.logged ? <UserCreateButton /> : <div />}
        </Toolbar>
      </AppBar>
    </div>
  );
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  loggedUser: state.userReducer
});

export default connect(mapStateToProps)(withStyles(styles)(NavBar));
