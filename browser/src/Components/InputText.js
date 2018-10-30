import React from "react";
import axios from 'axios';
import uuid from "uuid";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Select from "./Select";
import PrimaryButton from "./PrimaryButton";
import { createDataForm } from "../Forms/formParser";

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
  { label: 6, value: 6 },
  { label: 7, value: 7 },
  { label: 8, value: 8 },
  { label: 9, value: 9 },
  { label: 10, value: 10 },
  { label: 11, value: 11 }
];

const types = [
  {
    label: "Escala",
    value: "opinion_scale",
    steps: 5
  },
  {
    label: "Rango",
    value: "rating",
    steps: 5,
    shape: "star"
  },
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
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
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
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = label => event => {
    let uid = this.state.question.ref;
    if (this.state.question.ref === "") {
      uid = uuid();
    }
    //console.log("Lo que viene : ", event.target.value);
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

  createPoll() {
    let data = createDataForm(this.state.question.title, [this.state.question]);
    console.log('Data para crear el form : ', data);
    const token = "Cx7TVARyv64h6iyFJM5syoYJ8r7wAHnrMnvW3UAbkLh3";
    axios
      .post("https://api.typeform.com/forms", data, {
        headers: { Authorization: "Bearer " + token }
      })
      .then(res => res.data)
      .then(created => {
        console.log("Created form : ", created);
        axios
          .post("/api/polls/new", {
            ref: created.id,
            name: this.state.question.title,
            url: created._links.display,
            group: this.state.question.group,
            file: null
          })
          .then(res => {
            alert('El formulario se creó con éxito');
          })
        }
      )
      .catch(error => {
        alert('El formulario no se pudo crear');
      });
    // prueba
    //createForm(data);
  };

  componentDidMount() {
    this.props.getQuestionsDB();
    this.props.getGroupsDB();
    this.setState({ questions: [...this.props.questions] });
  }

  render() {
    //console.log("State: ", this.state.question);
    const { classes, loggedUser, groups } = this.props;
    return !loggedUser.logged ? (
      <div className={classes.root}>
        <h1>Necesitas loggearte para ver esta informacion</h1>
      </div>
    ) : (
      <Grid container className={classes.container}>
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
            value={this.state.question.type}
            array={types}
            handleChange={this.handleChange}
          />
          {/* <Select
            label={"group"}
            value={this.state.question.group}
            array={groups}
            handleChange={this.handleChange}
          /> */}
          {(this.state.question.type === "rating" || this.state.question.type === "opinion_scale") ? (
            <div>
              <Select
                label={"shape"}
                value={this.state.question.shape}
                array={shapes}
                handleChange={this.handleChange}
              />
              <Select
                label={"scale"}
                value={this.state.question.scale}
                array={scale}
                handleChange={this.handleChange}
              />
            </div>
          ) : this.state.question.type === "multiple_choice" ? (
            <div>
              <TextField
                label={"choices"}
                style={{ margin: 8 }}
                value={this.state.question.choices}
                onChange={this.handleChange}
                placeholder="Ingrese las opciones separadas por comas"
                helperText="Separe las opciones por comas asi: Opcion 1, Opcion 2,..."
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <Select
                label={"allow_multiple_selection"}
                value={this.state.question.allow_multiple_selection}
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
)(withStyles(styles)(InputText));
