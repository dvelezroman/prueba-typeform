import React, { Component } from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import uuid from "uuid";
import { withStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import CreatePollButton from "../Components/CreatePollButton";
import Select from "../Components/Select";
import { getQuestionsDB, getGroupsDB } from "../actions/questionActions";
import ListOfQuestions from "./ListOfQuestions";

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

class CreatePoll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ref: "",
      group: "Consultas Ambulatorias",
      selectedQuestions: []
    };
  }

  handleChange = label => event => {
    if (!this.state.ref.length) {
      this.setState({ ref: uuid() });
    }
    this.setState({ [label]: event.target.value }, () =>
      this.props.storeQuestion(this.state)
    );
  };

  handleCheck = checked => {
    this.setState({ selectedQuestions: [...checked] });
  };

  componentDidMount() {
    this.props.getGroupsDB();
  }

  render() {
    console.log("Selected Questions: ", this.state.selectedQuestions);
    const { classes, groups, questions } = this.props;
    return (
      <div className={classes.root}>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={16}
        >
          <Grid item xs={12}>
            <CreatePollButton />
            <Select
              label={"group"}
              value={this.state.group}
              array={groups}
              handleChange={this.handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <ListOfQuestions handleCheck={this.handleCheck} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  groups: state.questionsReducer.groups,
  isCreatingForm: state.typeFormReducer.isCreatingForm
});

const mapDispatchToProps = dispatch => ({
  getGroupsDB: () => dispatch(getGroupsDB())
});

CreatePoll.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(CreatePoll));
