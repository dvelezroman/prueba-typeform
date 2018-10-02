import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core";
import NavBar from "../Components/NavBar";
import InputText from "../Components/InputText";
import CircularIndeterminated from "../Components/CircularIndeterminated";
import NestedList from "../Components/NestedList";
import CreatePoll from "./CreatePoll";
import ContainedButton from "../Components/ContainedButton";
import SendPolls from "./SendPolls";
import ViewPolls from "../Components/ViewPolls";

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 16
  },
  paper: {
    padding: 16,
    textAlign: "center",
    color: theme.palette.text.secondary
  }
});

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes, isCreatingForm } = this.props;
    return (
      <div className={classes.root}>
        <CssBaseline />
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <NavBar />
          </Grid>
          <Grid container spacing={16}>
            <Grid item xs={3}>
              <Paper className={classes.paper}>
                <NestedList />
              </Paper>
            </Grid>
            <Grid item xs={9}>
              <Paper className={classes.paper}>
                <Switch>
                  <Route
                    exact
                    path="/questions"
                    render={() => (
                      <Grid container>
                        <Grid item xs={12}>
                          <InputText />
                        </Grid>
                        <Grid item xs={12}>
                          {isCreatingForm ? (
                            <Grid item xs={12}>
                              <CircularIndeterminated />
                            </Grid>
                          ) : (
                            <Grid item xs={12} />
                          )}
                        </Grid>
                      </Grid>
                    )}
                  />
                  <Route
                    exact
                    path="/polls/send"
                    render={() => (
                      <Grid container>
                        <SendPolls />
                      </Grid>
                    )}
                  />
                  <Route
                    exact
                    path="/polls"
                    render={() => (
                      <Grid container>
                        <CreatePoll />
                      </Grid>
                    )}
                  />
                  <Route
                    exact
                    path="/upload"
                    render={() => (
                      <Grid container>
                        <Grid item xs={12}>
                          <ContainedButton />
                        </Grid>
                      </Grid>
                    )}
                  />
                  <Route
                    exact
                    path="/"
                    render={() => (
                      <Grid container>
                        <ViewPolls />
                      </Grid>
                    )}
                  />
                </Switch>
              </Paper>
            </Grid>
          </Grid>
          <Grid />
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  questions: state.questionsReducer.questions,
  isCreatingForm: state.typeFormReducer.isCreatingForm,
  message: state.typeFormReducer.message,
  groups: state.questionsReducer.groups
});

const mapDispatchToProps = dispatch => ({});

Main.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Main));
