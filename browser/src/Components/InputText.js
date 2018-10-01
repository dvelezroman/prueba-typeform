import React from "react";
import uuid from "uuid";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Select from "./Select";
import PrimaryButton from "./PrimaryButton";

import {
  storeQuestion,
  clearQuestion,
  storeQuestionInDB,
  getQuestionsDB,
  getGroupsDB
} from "../actions/questionActions";

import { storeQuestionDB } from "../actions/firebaseActions";
import ListOfQuestionsWithoutCheck from "./ListOfQuestionsWithoutCheck";

const types = [
  {
    label: "Rango",
    value: "rating"
  },
  {
    label: "Texto Corto",
    value: "short_text"
  },
  {
    label: "Opción Múltiple",
    value: "multiple_choice"
  },
  {
    label: "E-mail",
    value: "email"
  }
];

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
    question: {
      ref: "",
      title: "",
      type: "rating",
      description: "",
      speciality: "Medicina General",
      scale: 7,
      shape: "star",
      group: "Consultas ambulatorias"
    },
    questions: []
  };

  handleChange = label => event => {
    let uid = this.state.question.ref;
    if (this.state.question.ref === "") {
      uid = uuid();
    }
    this.setState(
      {
        question: {
          ...this.state.question,
          ref: uid,
          [label]: event.target.value
        }
      },
      () => this.props.storeQuestion(this.state.question)
    );
  };

  handleClick = event => {
    event.preventDefault();
    if (this.props.question.description && this.props.question.title) {
      let data = {
        question: {
          ref: this.state.question.ref,
          title: this.state.question.title,
          type: this.state.question.type,
          description: this.state.question.description,
          speciality: this.state.question.speciality,
          scale: this.state.question.scale,
          shape: this.state.question.shape
        },
        group: this.state.question.group
      };
      this.props.addQuestion(data);
      this.setState({
        question: {
          ref: "",
          title: "",
          description: "",
          speciality: "Medicina General",
          group: "Consultas ambulatorias"
        },
        questions: [data.question, ...this.props.questions]
      });
    }
  };

  componentDidMount() {
    this.props.getQuestionsDB();
    this.props.getGroupsDB();
    this.setState({ questions: [...this.props.questions] });
  }

  render() {
    const { classes, groups } = this.props;
    return (
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={12}>
            <TextField
              required
              onChange={this.handleChange("title")}
              id="title-required"
              value={this.state.question.title}
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
              value={this.state.question.description}
              label="Descripción"
              placeholder="Describa la pregunta"
              className={classes.textField}
              margin="normal"
              variant="outlined"
            />
            <Select
              label={"type"}
              value={this.state.type}
              array={types}
              handleChange={this.handleChange}
            />
            <Select
              label={"speciality"}
              value={this.state.question.speciality}
              array={specialities}
              handleChange={this.handleChange}
            />
            <Select
              label={"group"}
              value={this.state.question.group}
              array={groups}
              handleChange={this.handleChange}
            />
            <PrimaryButton button={"Añadir"} handleClick={this.handleClick} />
          </Grid>
          <Grid item xs={12}>
            <ListOfQuestionsWithoutCheck
              questions={
                this.state.questions.length
                  ? this.state.questions
                  : this.props.questions
              }
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

InputText.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  question: state.questionsReducer.question,
  questions: state.questionsReducer.questions,
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
