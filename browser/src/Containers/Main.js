import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import axios from 'axios';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import { withStyles } from "@material-ui/core";
import NavBar from "../Components/NavBar";
//import InputText from "../Components/InputText";
//import CircularIndeterminated from "../Components/CircularIndeterminated";
import NestedList from "../Components/NestedList";
import CreatePoll from "./CreatePoll";
import ContainedButton from "../Components/ContainedButton";
import SendPolls from "./SendPolls";
import ViewPolls from "../Components/ViewPolls";
import PollsResume from "../Components/PollsResume";
import LoginForm from "./LoginForm";
import ChangePassword from "./ChangePassword";
import RecoverPassword from "./RecoverPassword";
import UploadedFiles from "./UploadedFiles";
import AdminCreate from "./AdminCreate";
import UpdateQuestion from "../Components/UpdateQuestion";
import { setAdmin } from "../actions/adminActions";
import CreateQuestionsPoll from "./CreateQuestionsPoll";

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
    this.state = {
    };
  };

  componentDidMount() {
    axios.get('/api/users').then(res => res.data).then(data => {
      if (data.msg.length) {
        this.props.setAdmin();
      };
    })
  };

  render() {
    const { classes, existAdmin } = this.props;
    if (!existAdmin) {
      //console.log('No hay usuario', existAdmin);
      return (
        <div className={classes.root}>
        <CssBaseline />
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <AdminCreate />
            </Grid>
          </Grid>
        </div>
      )
    }else {
      //console.log('hay usuario');
      return (
        <div className={classes.root}>
          <CssBaseline />
          <Grid container>
            <Grid item xs={12}>
              <NavBar />
            </Grid>
            <Grid container spacing={8}>
              <Grid item xs={2}>
                <Paper className={classes.paper}>
                  <NestedList />
                </Paper>
              </Grid>
              <Grid item xs={10}>
                <Paper className={classes.paper}>
                  <Switch>
                  <Route
                      exact
                      path="/login/password/recover"
                      render={() => (
                        <Grid container>
                          <RecoverPassword />
                        </Grid>
                      )}
                    />
                  <Route
                      exact
                      path="/login/password/change"
                      render={() => (
                        <Grid container>
                          <ChangePassword />
                        </Grid>
                      )}
                    />
                    <Route
                      exact
                      path="/login"
                      render={() => (
                        <Grid container>
                          <LoginForm />
                        </Grid>
                      )}
                    />
                    <Route
                      exact
                      path="/questions/update/:id"
                      render={() => (
                        <Grid container>
                          <UpdateQuestion />
                        </Grid>
                      )}
                    />
                    <Route
                      exact
                      path="/questions"
                      render={() => (
                          <CreateQuestionsPoll />
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
                      path="/polls/resume"
                      render={() => (
                        <Grid container>
                          <PollsResume />
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
                      path="/files"
                      render={() => (
                        <Grid container>
                          <UploadedFiles />
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
}

const mapStateToProps = state => ({
  existAdmin: state.adminReducer,
  questions: state.questionsReducer.questions,
  isCreatingForm: state.typeFormReducer.isCreatingForm,
  message: state.typeFormReducer.message,
  groups: state.questionsReducer.groups
});

const mapDispatchToProps = dispatch => ({
  setAdmin: () => dispatch(setAdmin())
});

Main.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Main));
