import React, { Component } from "react";
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
import Paper from "@material-ui/core/Paper";
import CreatePollButton from "../Components/CreatePollButton";
import Select from "../Components/Select";
import { getQuestionsDB, getGroupsDB } from "../actions/questionActions";
import { createForm, creatingForm, formCreated } from "../actions/typeForm";
import { createDataForm } from "../Forms/formParser";
import AlerDialogSlide from "../Components/AlertDialogSlide";

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
      group: "Consultas ambulatorias",
      selectedQuestions: [],
      form: "",
      showAlertDialog: false
    };
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
      form: "",
      ref: "",
      title: "",
      group: "Consultas ambulatorias",
      selectedQuestions: []
    });
  };

  createPoll = e => {
    e.preventDefault();
    let data = createDataForm(this.state.title, this.state.selectedQuestions);
    this.setState({
      title: ""
    });
    // prueba
    const token = "Cx7TVARyv64h6iyFJM5syoYJ8r7wAHnrMnvW3UAbkLh3";
    axios
      .post("https://api.typeform.com/forms", data, {
        headers: { Authorization: "Bearer " + token }
      })
      .then(res => res.data)
      .then(created => {
        this.setState({
          showAlertDialog: true,
          urlForm: created._links.display
        });
      })
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
  }

  render() {
    // console.log("URL form created: ", this.props.form);
    // console.log("Message : ", this.props.message);
    const { classes, groups, questions } = this.props;
    return (
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
              {`El formulario de encuesta puede ser accedido en la URL: ${
                this.state.form
              }`}
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
            <CreatePollButton
              disabled={this.state.selectedQuestions.length ? false : true}
              createPoll={this.createPoll}
            />
            <TextField
              required
              onChange={this.handleChange("title")}
              id="poll-title-required"
              value={this.state.title}
              label="Titulo de Formulario"
              placeholder="Escriba un titulo para el formulario"
              className={classes.textField}
              margin="normal"
              variant="outlined"
            />
            <Select
              label={"group"}
              value={this.state.group}
              array={groups}
              handleChange={this.handleChange}
            />
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
)(withStyles(styles)(CreatePoll));
