import React, { Component } from "react";
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import uuid from "uuid";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Select from "../Components/Select";
import PrimaryButton from "../Components/PrimaryButton";
import { createDataForm } from "../Forms/formParser";

import ListOfQuestionsWithoutCheck from "../Components/ListOfQuestionsWithoutCheck";

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
    width: "80%"
  },
  textField2: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "80%"
  },
  dense: {
    marginTop: 16
  }
});

class CreateQuestionsPoll extends Component {
  constructor() {
    super();
    this.state = {
      question: {
        subject: "",
        greet: "",
        ref: "",
        url: "",
        title: "",
        type: "opinion_scale",
        description: "",
        speciality: "Medicina General",
        scale: 5,
        shape: "star",
        choices: "",
        allow_multiple_selection: false,
        group: 0
      },
      questions: [],
      groups: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.clickEnable = this.clickEnable.bind(this);
    this.clickUpdate = this.clickUpdate.bind(this);
  }

  clickEnable = value => event => {
    event.preventDefault();
    //console.log('Ref : ', value );
    axios.put("/api/questions/disable", { ref: value })
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
    this.setState(
      {
        question: {
          ...this.state.question,
          ref: uid,
          [label]: event.target.value
        }
      }
    );
  };

  createPoll() {
    let data = createDataForm(this.state.question.subject, [this.state.question]);
    //console.log("Data para crear Form : ", JSON.stringify(data));
    const token = "Cx7TVARyv64h6iyFJM5syoYJ8r7wAHnrMnvW3UAbkLh3";
    axios.post("https://api.typeform.com/forms", data, {
        headers: { Authorization: "Bearer " + token }
      })
      .then(res => res.data)
      .then(formCreated => {
        let url = formCreated._links.display;
        const question = Object.assign({}, ...this.state.question, { ...this.state.question, url: url });
        const question_p = axios.post("/api/questions/new", {question});
        const poll_p = axios.post("/api/polls/new", {poll: this.state.question, url} );
        Promise.all([question_p, poll_p]).then(() => alert('Se creo encuesta...')).catch(err => alert('No se creó encuesta en la BD'));
      }).catch(err => err);
  };

  handleSubmit = event => {
    event.preventDefault();
    let question = this.state.question;
    if (question.group && question.subject && question.greet && question.title) {
        this.createPoll();
        //console.log('Respuesta de la creacion de la encuesta : ', data);
        // una vez que crea la encuesta, ahora guarda la pregunta en la base
    }else {
      if (question.group) alert('Faltan datos para crear una encuesta');
      else alert('No existen categorías seleccionadas, debebría cargar un archivo primero')
    }
    // this.setState({
    // question: {
    //     subject: "",
    //     greet: "",
    //     ref: "",
    //     title: "",
    //     type: "opinion_scale",
    //     description: "",
    //     speciality: "Medicina General",
    //     scale: 5,
    //     shape: "star",
    //     choices: "",
    //     allow_multiple_selection: false,
    //     group: 0
    // }
    // });
  };

  fetchGroups = () => axios.get("/api/groups").then(res => res.data);

  fetchQuestions = () => axios.get("/api/questions").then(res => res.data);

  async componentDidMount() {
      let groups = await this.fetchGroups().then(data => data);
      //console.log('Groups: ', groups);
      let questions = await this.fetchQuestions().then(data=> data);
      //console.log('Questions: ', questions);
      groups = groups.map(group => ({
          value: group.id,
          label: group.description,
      }));
      let group = 0;
      if (groups.length) group = groups[0].value;
      this.setState({ groups: groups, questions: questions, question: { ...this.state.question, group: group } })
  }

  render() {
    const { classes, loggedUser } = this.props;
    if (loggedUser) {
        //console.log("State: ", this.state);
        //console.log('Question: ', this.state.question);
    }
    return !loggedUser.logged ? (
      <div className={classes.root}>
        <h1>Necesitas loggearte para ver esta información</h1>
      </div>
    ) : (
      <Grid container className={classes.container}>
        <Grid item xs={12}>
          <div className={classes.root}>
            <h3>Crear Pregunta y Encuesta</h3>
          </div>
        </Grid>
        <Grid item xs={12}>
        <form className={classes.container} noValidate autoComplete="off">
            <Grid container className={classes.container}>
                <Grid item xs={6}>
                    <TextField
                    required
                    onChange={this.handleChange("subject")}
                    id="subject-required"
                    value={this.state.question.subject}
                    label="Titulo del Correo"
                    placeholder="Escriba un titulo para el correo en el que se enviará esta encuesta"
                    className={classes.textField2}
                    margin="normal"
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                    required
                    onChange={this.handleChange("greet")}
                    id="greet-required"
                    value={this.state.question.greet}
                    label="Saludo"
                    placeholder="Escriba un saludo para incluir en el cuerpo del correo"
                    className={classes.textField2}
                    margin="normal"
                    />
                </Grid>
                <Grid item xs={6}>
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
                </Grid>
                <Grid item xs={6}>
                    <TextField
                    onChange={this.handleChange("description")}
                    id="desc"
                    value={this.state.question.description}
                    label="Aclaratoria"
                    placeholder="Escriba la aclaratoria para la pregunta"
                    className={classes.textField2}
                    margin="normal"
                    />
                </Grid>
                <Grid item className={classes.container} xs={12}>
                        <Select
                        label={"group"}
                        name={"Categoría"}
                        value={this.state.question.group}
                        array={this.state.groups}
                        handleChange={this.handleChange}
                    />
                    <Select
                        label={"type"}
                        name={"Tipo"}
                        value={this.state.question.type}
                        array={types}
                        handleChange={this.handleChange}
                    />
                    {(this.state.question.type === "rating" || this.state.question.type === "opinion_scale") ? (
                        <div className={classes.container}>
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
                        <div className={classes.container}>
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
                </Grid>
            </Grid>
            <PrimaryButton button={"Crear Encuesta"} handleClick={this.handleSubmit} />
          </form>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.root}>
            <ListOfQuestionsWithoutCheck clickEnable={this.clickEnable} clickUpdate={this.clickUpdate} />
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

CreateQuestionsPoll.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  loggedUser: state.userReducer
});

const mapDispatchToProps = dispatch => ({
  
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(CreateQuestionsPoll)));