import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import ConfirmationNumber from "@material-ui/icons/ConfirmationNumber";
import Drafts from "@material-ui/icons/Drafts";
import ADB from "@material-ui/icons/Adb";
import Home from "@material-ui/icons/Home";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import StarBorder from "@material-ui/icons/StarBorder";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4
  }
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
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <List
          component="nav"
          subheader={<ListSubheader component="div">Menu</ListSubheader>}
        >
          <Link to="/">
            <ListItem button>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText inset primary="Inicio" />
            </ListItem>
          </Link>
          <Link to="/questions">
            <ListItem button>
              <ListItemIcon>
                <ADB />
              </ListItemIcon>
              <ListItemText inset primary="Preguntas" />
            </ListItem>
          </Link>
          <ListItem button onClick={this.handleClick("openPolls")}>
            <ListItemIcon>
              <ConfirmationNumber />
            </ListItemIcon>
            <ListItemText inset primary="Formularios" />
            {this.state.open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={this.state.openPolls} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <Link to="/polls/dashboard">
                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon>
                  <ListItemText inset primary="Dashboard" />
                </ListItem>
              </Link>
            </List>
          </Collapse>
          <Collapse in={this.state.openPolls} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <Link to="/polls">
                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon>
                  <ListItemText inset primary="Crear Formulario" />
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
                  <ListItemText inset primary="Enviar Encuesta" />
                </ListItem>
              </Link>
            </List>
          </Collapse>
          <ListItem button onClick={this.handleClick("openUpload")}>
            <ListItemIcon>
              <ConfirmationNumber />
            </ListItemIcon>
            <ListItemText inset primary="Carga" />
            {this.state.openUpload ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={this.state.openUpload} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <Link to="/upload">
                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon>
                  <ListItemText inset primary="Cargar Archivo" />
                </ListItem>
              </Link>
            </List>
          </Collapse>
        </List>
      </div>
    );
  }
}

NestedList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NestedList);
