import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Select from "./Select";
import PrimaryButton from "./PrimaryButton";

import {
  storeQuestion,
  addQuestion,
  clearQuestion
} from "../actions/questionActions";

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
    ref: "Pregunta ",
    title: "Titulo de Pregunta ",
    type: "rating",
    description: "",
    speciality: "Medicina General"
  };

  handleChangeText = event => {
    event.preventDefault();
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
      this.props.addQuestion();
      this.setState({ description: "", speciality: "Medicina General" });
    }
  };

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
  addQuestion: () => {
    dispatch(addQuestion());
    dispatch(clearQuestion());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(InputText));
