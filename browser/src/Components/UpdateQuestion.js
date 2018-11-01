import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from 'axios';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Select from "./Select";
import PrimaryButton from "./PrimaryButton";
import { getGroupsDB } from "../actions/questionActions";

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

class UpdateQuestion extends Component {
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
      }
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = label => event => {
    this.setState(
      {
        question: {
          ...this.state.question,
          [label]: event.target.value
        }
      }
    );
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    let ref = this.state.question.ref;
    let question = {
        title: this.state.question.title,
        description: this.state.question.description,
        scale: this.state.question.scale,
        shape: this.state.question.shape,
        type: this.state.question.type,
        choices: this.state.question.choices,
        allow_multiple_selection: this.state.question.allow_multiple_selection,
        group: this.state.question.group
    };
    let response = await axios.put(`/api/questions/update/${ref}`, question).then(res => res.data);
    //console.log('Response: ', response.data);
    if (response.error) alert ('No se pudo editar la pregunta');
    else alert('Los cambios se realizaron');
    this.props.history.push("/questions");
  };

  async componentDidMount() {
    const { id } = this.props.match.params;
    let { data } = await axios.get(`/api/questions/${id}`).then(res => res.data);
    //console.log('Question: ', data);
    this.setState({ question: { 
        id: data.id,
        ref: data.ref,
        title: data.title,
        type: data.type,
        description: data.description,
        speciality: data.speciality,
        scale: data.scale,
        shape: data.shape,
        choices: data.choices,
        allow_multiple_selection: data.allow_multiple_selection,
        group: data.groupId
    }});
    //this.props.getGroups();
  }

  render() {
    const { classes, loggedUser, groups } = this.props;
    //console.log(`Question: `, this.state.question);
    return !loggedUser.logged ? (
      <div className={classes.root}>
        <h1>Necesitas loggearte para ver esta información</h1>
      </div>
    ) : (
      <Grid container className={classes.container}>
        <Grid item xs={12}>
          <div className={classes.root}>
            <h3>Editar una Pregunta</h3>
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
            value={this.state.question.groupId}
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
          {(this.state.question.type === "rating" || this.state.question.type === "opinion_scale") ? (
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

          <PrimaryButton button={"Aceptar"} handleClick={this.handleSubmit} />
          </form>
        </Grid>
      </Grid>
    );
  }
}

UpdateQuestion.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  loggedUser: state.userReducer,
  groups: state.questionsReducer.groups
});

const mapDispatchToProps = dispatch => ({  
  getGroups: () => dispatch(getGroupsDB())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(UpdateQuestion)));
