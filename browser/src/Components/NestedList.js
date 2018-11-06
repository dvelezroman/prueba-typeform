import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import { withStyles } from "@material-ui/core/styles";
import ListSubheader from "@material-ui/core/ListSubheader";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ConfirmationNumber from "@material-ui/icons/ConfirmationNumber";

import ADB from "@material-ui/icons/Adb";
import Home from "@material-ui/icons/Home";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import StarBorder from "@material-ui/icons/StarBorder";

const styles = theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 2
  },
  button: {}
});

class NestedList extends React.Component {
  state = {
    openPolls: false,
    openUpload: false
  };

  handleClick = label => e => {
    this.setState({ [label]: !this.state[label] });
  };

  render() {
    const { classes, loggedUser } = this.props;
    return !loggedUser.logged ? (
      <div className={classes.root}>
        <h6>Debes Iniciar Sesión</h6>
      </div>
    ) : (
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          <List
            component="nav"
            subheader={<ListSubheader component="div">Menu</ListSubheader>}
          >
            <Link to="/polls/resume">
              <ListItem button>
                <ListItemIcon>
                  <Home />
                </ListItemIcon>
                <ListItemText inset primary="Estado" />
              </ListItem>
            </Link>
            {/* <Link to="/questions">
              <ListItem button>
                <ListItemIcon>
                  <ADB />
                </ListItemIcon>
                <ListItemText inset primary="Preguntas" />
              </ListItem>
            </Link> */}
            <ListItem button onClick={this.handleClick("openPolls")}>
              <ListItemIcon>
                <ConfirmationNumber />
              </ListItemIcon>
              <ListItemText inset primary="Encuestas" />
              {this.state.open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={this.state.openPolls} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <Link to="/">
                  <ListItem button className={classes.nested}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText inset primary="Creadas" />
                  </ListItem>
                </Link>
              </List>
            </Collapse>
            <Collapse in={this.state.openPolls} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <Link to="/questions">
                  <ListItem button className={classes.nested}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText inset primary="Crear" />
                  </ListItem>
                </Link>
              </List>
            </Collapse>
            <Collapse in={this.state.openPolls} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <Link to="/polls/send">
                  <ListItem button className={classes.nested}>
                    <ListItemIcon>
                      <StarBorder />
                    </ListItemIcon>
                    <ListItemText inset primary="Enviar" />
                  </ListItem>
                </Link>
              </List>
            </Collapse>
            <Link to="/upload">
              <ListItem button>
                <ListItemIcon>
                  <ADB />
                </ListItemIcon>
                <ListItemText inset primary="Carga" />
              </ListItem>
            </Link>
            <Link to="/files">
              <ListItem button>
                <ListItemIcon>
                  <ADB />
                </ListItemIcon>
                <ListItemText inset primary="Archivos" />
              </ListItem>
            </Link>
          </List>
        </Grid>
      </Grid>
    );
  }
}

NestedList.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  loggedUser: state.userReducer
});

export default connect(mapStateToProps)(withStyles(styles)(NestedList));
