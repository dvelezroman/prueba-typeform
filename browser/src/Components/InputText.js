import React from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import uuid from "uuid";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Select from "./Select";
import PrimaryButton from "./PrimaryButton";
// import { createDataForm } from "../Forms/formParser";

import {
  storeQuestion,
  clearQuestion,
  storeQuestionInDB,
  getQuestionsDB,
  getGroupsDB
} from "../actions/questionActions";

import { storeQuestionDB } from "../actions/firebaseActions";
import ListOfQuestionsWithoutCheck from "./ListOfQuestionsWithoutCheck";

const shapes = [
  { label: "Circulo", value: "circle" },
  { label: "Nube", value: "cloud" },
  { label: "Corona", value: "crown" },
  { label: "Corazón", value: "heart" },
  { label: "Estrella", value: "star" }
];

const scale = [
  { label: 5, value: 5 },
  //{ label: 6, value: 6 },
  { label: 7, value: 7 },
  //{ label: 8, value: 8 },
  { label: 9, value: 9 },
  //{ label: 10, value: 10 },
  { label: 11, value: 11 }
];

const types = [
  {
    label: "Escala",
    value: "opinion_scale",
    steps: 5
  },
  // {
  //   label: "Rango",
  //   value: "rating",
  //   steps: 5,
  //   shape: "star"
  // },
  {
    label: "Si o No",
    value: "yes_no"
  },
  {
    label: "Selección",
    value: "multiple_choice"
  }
];

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  paper: {
    padding: 16,
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  textField1: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300
  },
  textField2: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 600
  },
  dense: {
    marginTop: 16
  }
});

class InputText extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      question: {
        ref: "",
        title: "",
        type: "opinion_scale",
        description: "",
        speciality: "Medicina General",
        scale: "5",
        shape: "star",
        choices: "",
        allow_multiple_selection: false,
        group: 1
      },
      questions: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clickEnable = this.clickEnable.bind(this);
    this.clickUpdate = this.clickUpdate.bind(this);
  }

  clickEnable = value => event => {
    event.preventDefault();
    //console.log('Ref : ', value );
    axios
      .put("/api/questions/disable", { ref: value })
      .then(res => res.data)
      .then(data => {
        this.props.getQuestionsDB();
      });
  };

  clickUpdate = value => event => {
    event.preventDefault();
    //console.log('Id : ', value );
    this.props.history.push(`/questions/update/${value}`);
  };

  handleChange = label => event => {
    let uid = this.state.question.ref;
    if (this.state.question.ref === "") {
      uid = uuid();
    }
    //console.log("Lo que viene : ", event.target.value);
    if (label === "choices") {
      if (this.state.choices.split(",").length <= 5) {
        this.setState(
          {
            question: {
              choices: event.target.value
            }
          },
          () => this.props.storeQuestion(this.state.question)
        );
      }
    } else {
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
    }
  };

  handleSubmit = event => {
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
          shape: this.state.question.shape,
          choices: this.state.question.choices,
          allow_multiple_selection: this.state.question.allow_multiple_selection
        },
        group: this.state.question.group
      };
      this.props.addQuestion(data);
      this.props.getQuestionsDB();
      // enviar a crear un formulario con la pregunta que llega aqui
      //this.createPoll()
      this.setState({
        question: {
          ref: "",
          title: "",
          description: "",
          speciality: "Medicina General",
          group: 1
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
    //console.log("Choices: ", this.state.question.choices);
    //console.log('Questions: ', this.props.questions);
    const { classes, loggedUser, groups } = this.props;
    return !loggedUser.logged ? (
      <div className={classes.root}>
        <h1>Necesitas loggearte para ver esta información</h1>
      </div>
    ) : (
      <Grid container className={classes.container}>
        <Grid item xs={12}>
          <div className={classes.root}>
            <h3>Agregar Preguntas</h3>
          </div>
        </Grid>
        <Grid item xs={12}>
          <form className={classes.container} noValidate autoComplete="off">
            <TextField
              required
              onChange={this.handleChange("title")}
              id="title-required"
              value={this.state.question.title}
              label="Pregunta"
              placeholder="Escriba aquí la pregunta"
              className={classes.textField1}
              margin="normal"
            />
            <TextField
              onChange={this.handleChange("description")}
              id="desc"
              value={this.state.question.description}
              label="Aclaratoria"
              placeholder="Escriba la aclaratoria para la pregunta"
              className={classes.textField2}
              margin="normal"
            />
            <Select
              label={"group"}
              name={"Categoría"}
              value={this.state.question.group}
              array={groups}
              handleChange={this.handleChange}
            />
            <Select
              label={"type"}
              name={"Tipo"}
              value={this.state.question.type}
              array={types}
              handleChange={this.handleChange}
            />
            {this.state.question.type === "rating" ||
            this.state.question.type === "opinion_scale" ? (
              <div>
                <Select
                  label={"shape"}
                  value={this.state.question.shape}
                  name={"Forma"}
                  array={shapes}
                  handleChange={this.handleChange}
                />
                <Select
                  label={"scale"}
                  value={this.state.question.scale}
                  name={"Escala"}
                  array={scale}
                  handleChange={this.handleChange}
                />
              </div>
            ) : this.state.question.type === "multiple_choice" ? (
              <div>
                <TextField
                  label={"Opciones"}
                  value={this.state.question.choices}
                  onChange={this.handleChange("choices")}
                  className={classes.textField1}
                  placeholder="Ingrese las opciones separadas por comas"
                  helperText="Opción 1, Opción 2, Opción 3,..."
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
                <Select
                  label={"allow_multiple_selection"}
                  value={this.state.question.allow_multiple_selection}
                  name={"Seleccione"}
                  array={[
                    { label: "Selección Multiple", value: true },
                    { label: "Solo una opción", value: false }
                  ]}
                  handleChange={this.handleChange}
                />
              </div>
            ) : (
              <div />
            )}

            <PrimaryButton button={"Añadir"} handleClick={this.handleSubmit} />
          </form>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.root}>
            <ListOfQuestionsWithoutCheck
              clickEnable={this.clickEnable}
              clickUpdate={this.clickUpdate}
              // questions={
              //   this.state.questions.length
              //     ? this.state.questions
              //     : this.props.questions
              // }
            />
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

InputText.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  loggedUser: state.userReducer,
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
)(withStyles(styles)(withRouter(InputText)));
