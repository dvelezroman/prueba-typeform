import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import CssBaseline from "@material-ui/core/CssBaseline";
import NavBar from "./Components/NavBar";
import InputText from "./Components/InputText";
import PrimaryButton from "./Components/PrimaryButton";
import "./styles/App.css";
import InteractiveList from "./Components/InteractiveList";
import { createForm } from "./actions/typeForm";
import { createDataForm } from "./Forms/formParser";
import CircularIndeterminated from "./Components/CircularIndeterminated";
import ContainedButton from "./Components/ContainedButton";

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 16
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: "center",
    color: theme.palette.text.secondary
  }
});

class App extends Component {
  simpleAction = event => {
    this.props.simpleAction();
  };

  handleCreateForm = () => {
    let date = new Date();
    let formParsed = createDataForm(`Encuesta ${date}`, this.props.questions);
    console.log(formParsed);
    this.props.createForm(formParsed);
  };

  render() {
    this.props.message && console.log(this.props.message);
    const { classes, isCreatingForm } = this.props;
    return (
      <div className={classes.root}>
        <CssBaseline />
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <NavBar />
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <InputText />
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              {isCreatingForm ? (
                <Grid item xs={12}>
                  <CircularIndeterminated />
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <PrimaryButton
                    button={"Crear Encuesta"}
                    handleClick={this.handleCreateForm}
                  />
                  <InteractiveList />
                </Grid>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <ContainedButton />
          </Grid>
        </Grid>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  questions: state.questionsReducer.questions,
  isCreatingForm: state.typeFormReducer.isCreatingForm,
  message: state.typeFormReducer.message
});

const mapDispatchToProps = dispatch => ({
  createForm: questions => dispatch(createForm(questions))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(App));
