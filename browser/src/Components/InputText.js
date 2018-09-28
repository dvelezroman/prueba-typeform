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
  getQuestionsDB,
  getGroupsDB
} from "../actions/questionActions";

import { storeQuestionDB } from "../actions/firebaseActions";

const specialities = [
  {
    value: "1",
    label: "Medicina General"
  },
  {
    value: "2",
    label: "Ginecología"
  },
  {
    value: "3",
    label: "Traumatología"
  },
  {
    value: "4",
    label: "Cardiología"
  }
];

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
    title: "",
    type: "rating",
    description: "",
    speciality: "Medicina General",
    scale: 7,
    shape: "star",
    group: "Consultas Ambulatorias"
  };

  handleChange = label => event => {
    if (!this.state.ref.length) {
      this.setState({ ref: uuid() });
    }
    this.setState({ [label]: event.target.value }, () =>
      this.props.storeQuestion(this.state)
    );
  };

  handleClick = event => {
    event.preventDefault();
    if (this.props.question.description) {
      let data = {
        question: {
          ref: this.state.ref,
          title: this.state.title,
          type: this.state.type,
          description: this.state.description,
          speciality: this.state.speciality,
          scale: this.state.scale,
          shape: this.state.shape
        },
        group: this.state.group
      };
      this.props.addQuestion(data);
      //this.props.storeQuestionDB(this.state);
      this.setState({
        ref: "",
        title: "",
        description: "",
        speciality: "Medicina General",
        group: "Consultas Ambulatorias"
      });
    }
  };

  componentDidMount() {
    this.props.getQuestionsDB();
    this.props.getGroupsDB();
  }

  render() {
    const { classes, question, groups } = this.props;
    return (
      <div className={classes.root}>
        <TextField
          required
          onChange={this.handleChange("title")}
          id="title-required"
          value={this.state.title}
          label="Titulo"
          placeholder="Escriba un titulo"
          className={classes.textField}
          margin="normal"
          variant="outlined"
        />
        <TextField
          required
          onChange={this.handleChange("description")}
          id="desc-required"
          value={this.state.description}
          label="Descripción"
          placeholder="Describa la pregunta"
          className={classes.textField}
          margin="normal"
          variant="outlined"
        />
        <Select
          label={"speciality"}
          value={this.state.speciality}
          array={specialities}
          handleChange={this.handleChange}
        />
        <Select
          label={"group"}
          value={this.state.group}
          array={groups}
          handleChange={this.handleChange}
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
  groups: state.questionsReducer.groups
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
  },
  getGroupsDB: () => dispatch(getGroupsDB())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(InputText));
