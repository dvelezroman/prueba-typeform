import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import NavBar from "./Components/NavBar";
import InputText from "./Components/InputText";
import "./styles/App.css";

const styles = theme => ({
  root: {
    flexGrow: 1
  }
});

class App extends Component {
  simpleAction = event => {
    this.props.simpleAction();
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container spacing={24}>
          <CssBaseline />
          <NavBar />
          <InputText />
          <pre>{JSON.stringify(this.props)}</pre>
        </Grid>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  questions: state.questionsReducer.questions
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(App));
