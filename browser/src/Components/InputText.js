import React from "react";
import uuid from "uuid";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Select from "./Select";
import PrimaryButton from "./PrimaryButton";

import {
  storeQuestion,
  addQuestion,
  clearQuestion,
  storeQuestionInDB,
  getQuestionsDB
} from "../actions/questionActions";

import { storeQuestionDB } from "../actions/firebaseActions";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  dense: {
    marginTop: 16
  }
});

class InputText extends React.Component {
  state = {
    ref: "",
    title: "Titulo de la Pregunta ",
    type: "rating",
    description: "",
    speciality: "Medicina General",
    scale: 7,
    shape: "star"
  };

  handleChangeText = event => {
    event.preventDefault();
    if (!this.state.ref.length) this.setState({ ref: uuid() });
    this.setState({ description: event.target.value }, () =>
      this.props.storeQuestion(this.state)
    );
  };

  handleChangeSpeciality = event => {
    event.preventDefault();
    this.setState({ speciality: event.target.value }, () =>
      this.props.storeQuestion(this.state)
    );
  };

  handleClick = event => {
    event.preventDefault();
    if (this.props.question.description) {
      this.props.addQuestion(this.state);
      //this.props.storeQuestionDB(this.state);
      this.setState({
        ref: "",
        description: "",
        speciality: "Medicina General"
      });
    }
  };

  componentDidMount() {
    this.props.getQuestionsDB();
  }

  render() {
    const { classes, question } = this.props;

    return (
      <div className={classes.root}>
        <TextField
          required
          onChange={this.handleChangeText}
          id="outlined-required"
          value={question.description}
          label="Pregunta"
          placeholder="Escriba una pregunta"
          className={classes.textField}
          margin="normal"
          variant="outlined"
        />
        <Select
          speciality={this.state.speciality}
          handleChangeSpeciality={this.handleChangeSpeciality}
        />
        <PrimaryButton button={"Añadir"} handleClick={this.handleClick} />
      </div>
    );
  }
}

InputText.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  question: state.questionsReducer.question,
  ...state
});

const mapDispatchToProps = dispatch => ({
  storeQuestion: question => dispatch(storeQuestion(question)),
  addQuestion: question => {
    dispatch(storeQuestionInDB(question));
    dispatch(clearQuestion());
  },
  getQuestionsDB: () => dispatch(getQuestionsDB()),
  storeQuestionDB: question => {
    dispatch(storeQuestionDB(question));
    dispatch(clearQuestion());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(InputText));
