import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import { PropTypes } from "prop-types";
import uuid from "uuid";
import { withStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import CreatePollButton from "../Components/CreatePollButton";
import Select from "../Components/Select";
import { getGroupsDB } from "../actions/questionActions";
import { createForm, creatingForm, formCreated } from "../actions/typeForm";
import { createDataForm } from "../Forms/formParser";

import ListOfQuestions from "./ListOfQuestions";

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 16
  },
  paper: {
    padding: 16,
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  textField: {
    autoFocus: "true",
    width: 500,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  }
});

class CreatePoll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ref: "",
      title: "",
      subject: "",
      greet: "",
      group: 0,
      selectedQuestions: [],
      urlform: "",
      showAlertDialog: false,
      files: [],
      fileSelected: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange = label => event => {
    if (!this.state.ref.length) {
      this.setState({ ref: uuid() });
    }
    this.setState({ [label]: event.target.value });
  };

  handleCheck = checked => {
    this.setState({ selectedQuestions: [...checked] });
  };

  handleClose = () => {
    this.setState({
      showAlertDialog: false,
      ref: "",
      title: "",
      subject: "",
      greet: "",
      urlform: "",
      group: "0",
      selectedQuestions: [],
      fileSelected: ""
    });
    this.props.history.push("/polls/send");
  };

  createPoll = e => {
    e.preventDefault();
    let data = createDataForm(this.state.title, this.state.selectedQuestions);
    // prueba
    //console.log("Data para crear Form : ", JSON.stringify(data));
    const token = "Cx7TVARyv64h6iyFJM5syoYJ8r7wAHnrMnvW3UAbkLh3";
    axios
      .post("https://api.typeform.com/forms", data, {
        headers: { Authorization: "Bearer " + token }
      })
      .then(res => res.data)
      .then(created =>
        axios
          .post("/api/polls/new", {
            ref: created.id,
            name: this.state.title,
            subject: this.state.subject,
            greet: this.state.greet,
            url: created._links.display,
            group: this.state.group,
            file: this.state.fileSelected
          })
          .then(res => {
            this.setState({
              title: "",
              urlForm: res.data.url,
              showAlertDialog: true
            });
          })
      )
      .catch(error => {
        this.setState({
          showAlertDialog: true,
          urlForm: "Ocurrió un error, y no se creó el Formulario"
        });
      });
    // prueba
    //createForm(data);
  };

  componentDidMount() {
    
    this.props.getGroupsDB();
    axios
      .get(`/api/files`)
      .then(res => res.data)
      .then(files => {
        let arrayFiles = files.data.map(file => ({
          value: file.id,
          label: file.name
        }));
        let fileSelected = arrayFiles.length ? arrayFiles[0].label : "";
        this.setState({
          files: arrayFiles,
          fileSelected: fileSelected
        });
      });
  }

  render() {
    //console.log("State", this.state);
    const { classes, loggedUser, groups } = this.props;
    return !loggedUser.logged ? (
      <div className={classes.root}>
        <h1>Necesitas loggearte para ver esta informacion</h1>
      </div>
    ) : (
      <div className={classes.root}>
        <Dialog
          open={this.state.showAlertDialog}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            {"Formulario Creado:"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {`El formulario de encuesta se creó satisfactoriamente y puede ser enviado`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Entendido
            </Button>
          </DialogActions>
        </Dialog>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={16}
        >
          <Grid item xs={12}>
          <form className={classes.container} noValidate autoComplete="off">
            <CreatePollButton
              disabled={this.state.selectedQuestions.length ? false : true}
              createPoll={this.createPoll}
            />
            <TextField
              onChange={this.handleChange("subject")}
              id="subject-required"
              value={this.state.subject}
              label="Titulo del Correo"
              placeholder="Escriba un titulo para el correo en el que se enviará esta encuesta"
              className={classes.textField}
              margin="normal"
              
            />
            <TextField
              onChange={this.handleChange("greet")}
              id="greet-required"
              value={this.state.greet}
              label="Saludo"
              placeholder="Escriba un saludo para incluir en el cuerpo del correo"
              className={classes.textField}
              margin="normal"
              
            />
            <TextField
              required
              onChange={this.handleChange("title")}
              id="poll-title-required"
              value={this.state.title}
              label="Titulo de la Encuesta"
              placeholder="Escriba un titulo para identificar"
              className={classes.textField}
              margin="normal"
              variant="outlined"
            />
            <Select
              label={"group"}
              name={"Categoría"}
              value={this.state.group}
              array={[{ value: "0", label: "Todas" }, ...groups]}
              handleChange={this.handleChange}
            />
            <Select
              label={"fileSelected"}
              name={"Archivo"}
              value={this.state.fileSelected}
              array={this.state.files}
              handleChange={this.handleChange}
              helperText={"Elija un archivo"}
            />
          </form>
          </Grid>
          <Grid item xs={12}>
            <ListOfQuestions
              filterGroup={this.state.group}
              handleCheck={this.handleCheck}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loggedUser: state.userReducer,
  groups: state.questionsReducer.groups,
  form: state.typeFormReducer.form,
  isCreatingForm: state.typeFormReducer.isCreatingForm,
  message: state.typeFormReducer.message
});

const mapDispatchToProps = dispatch => ({
  getGroupsDB: () => dispatch(getGroupsDB()),
  createForm: data => dispatch(createForm(data)),
  creatingForm: () => dispatch(creatingForm()),
  formCreated: url => dispatch(formCreated(url))
});

CreatePoll.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(CreatePoll)));
