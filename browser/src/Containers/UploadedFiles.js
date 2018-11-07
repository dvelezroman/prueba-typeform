import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import PrimaryButton from "../Components/PrimaryButton";
//import Paper from "@material-ui/core/Paper";
// import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ShowOrders from "../Components/ShowOrders";

import _ from "lodash";

const styles = theme => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.paper
  },
  button: {
    margin: theme.spacing.unit
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  },
  paper: {
    padding: 16,
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  list: {
    overflow: "auto"
  }
});

class UploadedFiles extends Component {
  state = {
    selectedFile: {},
    files: [],
    orders: [],
    questions: [],
    polls:[],
    selectedQuestions: []
  };

  handleListItemClick = async (event, file) => {
    let { data } = await axios.get(`/api/files/${file.name}/orders`).then(res => res.data);
    this.setState({ selectedFile: file, orders: data });
  };

  handlePollCheck = value => () => {
    const { selectedQuestions } = this.state;
    const currentIndex = selectedQuestions.indexOf(value);
    const newChecked = [...selectedQuestions];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState(
      {
        selectedQuestions: newChecked
      }
    );
  };

  sendEmails() {
    let file = this.state.selectedFile;
    let polls = this.state.selectedQuestions;
    let orders = this.state.orders;
    if (!file.ref) alert('Debes seleccionar un archivo cargado!');
    else if (!polls.length) alert('Debes Seleccionar una Encuesta al menos!');
    else {
      //let grouped_polls = _.groupBy(polls, poll => poll.groupId);
      let grouped_orders = _.groupBy(orders, order => order.groupId);
      //console.log('File: ', file);
      //console.log('Grouped Questions: ', grouped_polls);
      //console.log('Grouped Orders: ', grouped_orders);
      // por cada formulario seleccionado, enviarle ese formulario a los clientes de la misma categoría del formulario
      let promises_to_send_emails = [];
      polls.forEach(poll => {
        let group = poll.groupId;
        let clients = grouped_orders[group];
        let url = poll.url;
        let subject = poll.subject;
        let greet = poll.greet;
        let fileId = file.id;
        let body = {clients, subject, greet, url, fileId};
        promises_to_send_emails.push(axios.post("/api/polls/send", body));
      });
      Promise.all(promises_to_send_emails).then(res => {
        // enviar a guardar a la base de datos las encuestas enviadas
        if (res.length > 1) alert("Las encuestas se enviaron exitosamente");
        else alert("Las encuesta se envió exitosamente");
      });
    }
  };

  fetchPolls = () => axios.get("/api/polls").then(res => res.data);

  fetchFiles = () => axios.get("/api/files").then(res => res.data);

  fetchQuestions = () => axios.get("/api/questions").then(res => res.data);

  async componentDidMount() {
    //let polls = await this.fetchPolls().then(data => data);
    let questions = await this.fetchQuestions().then(data => data);
    let raw_files = await this.fetchFiles().then(data => data.data);
    let files = raw_files.map(item => (
        {
            id: item.id,
            ref: item.ref,
            name: item.name,
            uploaded: `${item.createdAt.split('T')[0]} - ${item.createdAt.split('T')[1].split('.')[0]} `
        }
    ));
    this.setState({ files: files, questions: questions });
  };

  render() {
    const { classes, loggedUser } = this.props;
    const questions = this.state.questions.filter(question => question.enabled);
    //console.log('State : ', this.state);
    return !loggedUser.logged ? (
      <div className={classes.root}>
        <h1>Necesitas loggearte para ver esta informacion</h1>
      </div>
    ) : (
        <Grid container className={classes.root}>
          <Grid item xs={12}>
            <PrimaryButton button={(this.state.selectedQuestions.length > 1) ? "Enviar Encuestas" : "Enviar Encuesta"} handleClick={() => this.sendEmails()} />
          </Grid>
          <Grid item xs={4}>
            <Grid item xs={12}>
                Lista de archivos que han sido cargados
            </Grid>
            <Grid item xs={12}>
                  {this.state.files.map(item => (
                      <List key={item.id} component="nav">
                          <ListItem
                              button
                              selected={this.state.selectedFile.id === item.id}
                              onClick={event => this.handleListItemClick(event, item)}
                          >
                              <ListItemText primary={`Archivo : ${item.name}`} secondary={`Fecha de carga: ${item.uploaded}`} />
                          </ListItem>
                      </List>))}
            </Grid>
          </Grid>
          <Grid item xs={8}>
          <Grid item xs={12}>
                Lista de Encuestas Disponibles
            </Grid>
            <List>
              {questions.map((value, i) => (
                <ListItem
                  key={i}
                  role={undefined}
                  dense
                  button
                  onClick={this.handlePollCheck(value)}
                  className={classes.listItem}
                >
                  <Checkbox
                    checked={this.state.selectedQuestions.indexOf(value) !== -1}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText
                    primary={`Encuesta: ${value.subject} - Cuerpo: ${value.greet}`}
                    secondary={(value.type === "opinion_scale") ? `Pregunta: ${value.title} - tipo: Escala - escala: 1 al ${value.scale}` : (value.type === "yes_no") ? `Pregunta: ${value.title} - tipo: Si o No` : `Pregunta: ${value.title} - tipo: Selección - Opciones: ${value.choices.map((choice, i) => `${i}. ${choice} - `)}` }
                  />
                  {/* <ListItemSecondaryAction>
                    <IconButton aria-label="Comments">
                      <CommentIcon />
                    </IconButton>
                  </ListItemSecondaryAction> */}
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12}>
            { this.state.selectedFile.name ? `Ordenes contenidas en el archivo : ${this.state.selectedFile.name}` : `Selecciona un archivo para ver las ordenes contenidas`}
          </Grid>
          <Grid item xs={12}>
            { this.state.selectedFile.name ? <ShowOrders orders={this.state.orders}/> : ""}
          </Grid>
        </Grid>
    );
  }
}

UploadedFiles.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  loggedUser: state.userReducer
});

export default connect(mapStateToProps)(withStyles(styles)(UploadedFiles));