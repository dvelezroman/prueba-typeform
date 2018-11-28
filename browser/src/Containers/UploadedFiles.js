import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
//import * as typeformEmbed from '@typeform/embed' // Typeform SDK
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
    polls: [],
    selectedQuestions: []
  };

  handleListItemClick = async (event, file) => {
    let { data } = await axios
      .get(`/api/files/${file.id}/orders`)
      .then(res => res.data);
    //console.log('Orders : ',data);
    if (!data.error) this.setState({ selectedFile: file, orders: data });
    else this.setState({ selectedFile: file });
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

    this.setState({
      selectedQuestions: newChecked
    });
  };

  async sendEmails() {
    let file = this.state.selectedFile;
    let polls = this.state.selectedQuestions;
    let orders = this.state.orders;
    //console.log('Polls selected: ', polls);
    if (!file.ref) alert("Debes seleccionar un archivo cargado!");
    else if (!polls.length) alert("Debes Seleccionar una Encuesta al menos!");
    else {
      let server = await axios
        .get("/api/mailserver/selected")
        .then(res => res.data.data);
      console.log("Server: ", server);
      if (!server.id) {
        this.setState({
          selectedFile: {},
          orders: [],
          selectedQuestions: []
        });
        alert("No ha configurado ningún servidor de correos");
      } else {
        let grouped_orders = _.groupBy(orders, order => order.groupId);
        let grouped_polls = _.groupBy(polls, poll => poll.groupId);
        let n_polls_by_group = _.countBy(polls, poll => poll.groupId);
        let polls_paired_with_clients = [];
        _.forEach(n_polls_by_group, function(value, key) {
          for (let i = 0; i < value; i++) {
            if (_.chunk(grouped_orders[key], value)[i]) {
              polls_paired_with_clients.push({
                groupId: key,
                clients: _.chunk(grouped_orders[key], value)[i],
                poll: grouped_polls[key][i]
              });
            }
          }
        });
        // primero vemos cuantas encuestas hay seleccionadas del mismo grupo
        // por cada formulario seleccionado, enviarle ese formulario a los clientes de la misma categoría del formulario
        let promises_to_send_emails = [];
        polls_paired_with_clients.forEach(item => {
          let group = item.groupId;
          let clients = item.clients;
          let url = item.poll.url;
          let subject = item.poll.subject;
          let greet = item.poll.greet;
          let fileId = file.id;
          let scale = item.poll.scale;
          let shape = item.poll.shape;
          let title = item.poll.title;
          let type = item.poll.type;
          let description = item.poll.description;
          let choices = item.poll.choices;
          let allow_multiple_selection = item.poll.allow_multiple_selection;
          let body = {
            group,
            clients,
            subject,
            greet,
            url,
            scale,
            shape,
            title,
            type,
            description,
            choices,
            allow_multiple_selection,
            fileId
          };
          //console.log("envio a /api/polls/send", body);
          promises_to_send_emails.push(
            axios.post("/api/polls/send", { array: body, server })
          );
        });
        Promise.all(promises_to_send_emails).then(res => {
          // enviar a guardar a la base de datos las encuestas enviadas
          //console.log('res : ', res);
          let send_forms = res.length;
          for (let i = 0; i < res.length; i++) {
            if (!res[i].data.error) send_forms--;
          }
          if (send_forms) alert("Algunas encuestas no se enviaron");
          else {
            this.setState({
              selectedFile: {},
              orders: [],
              selectedQuestions: []
            });
            if (res.length > 1) alert("Las encuestas se enviaron exitosamente");
            else alert("Las encuesta se envió exitosamente");
          }
        });
      }
    }
  }

  fetchPolls = () => axios.get("/api/polls").then(res => res.data);

  fetchFiles = () => axios.get("/api/files").then(res => res.data);

  fetchQuestions = () => axios.get("/api/questions").then(res => res.data);

  async componentDidMount() {
    //let polls = await this.fetchPolls().then(data => data);
    let questions = await this.fetchQuestions().then(data => data);
    let raw_files = await this.fetchFiles().then(data => data.data);
    let files = raw_files.map(item => ({
      id: item.id,
      ref: item.ref,
      name: item.name,
      uploaded: `${item.createdAt.split("T")[0]} - ${
        item.createdAt.split("T")[1].split(".")[0]
      } `
    }));
    this.setState({ files: files, questions: questions });
  }

  render() {
    const { classes, loggedUser } = this.props;
    const questions = this.state.questions.filter(question => question.enabled);
    //console.log('State : ', this.state);
    //console.log('Questions: ', questions);
    return !loggedUser.logged ? (
      <div className={classes.root}>
        <h1>Necesitas loggearte para ver esta informacion</h1>
      </div>
    ) : (
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          <PrimaryButton
            button={
              this.state.selectedQuestions.length > 1
                ? "Enviar Encuestas"
                : "Enviar Encuesta"
            }
            handleClick={() => this.sendEmails()}
          />
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
                  <ListItemText
                    primary={`Archivo : ${item.name}`}
                    secondary={`Fecha de carga: ${item.uploaded}`}
                  />
                </ListItem>
              </List>
            ))}
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
                  primary={`Encuesta: ${value.subject} - Cuerpo: ${
                    value.greet
                  } - Categoría: ${value.group.description}`}
                  secondary={
                    value.type === "opinion_scale"
                      ? `Pregunta: ${
                          value.title
                        } - tipo: Escala - escala: 1 al ${value.scale}`
                      : value.type === "yes_no"
                      ? `Pregunta: ${value.title} - tipo: Si o No`
                      : `Pregunta: ${
                          value.title
                        } - tipo: Selección - Opciones: ${value.choices
                          .split(",")
                          .map((choice, i) => `${i}. ${choice} - `)}`
                  }
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
          {this.state.selectedFile.name
            ? `Ordenes contenidas en el archivo : ${
                this.state.selectedFile.name
              }`
            : `Selecciona un archivo para ver las ordenes contenidas`}
        </Grid>
        <Grid item xs={12}>
          {this.state.selectedFile.name ? (
            <ShowOrders orders={this.state.orders} />
          ) : (
            ""
          )}
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
