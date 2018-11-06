import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
// import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ShowOrders from "../Components/ShowOrders";

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
    selectedGroups: []
  };

  handleListItemClick = async (event, file) => {
    let { data } = await axios.get(`/api/files/${file.name}/orders`).then(res => res.data);
    this.setState({ selectedFile: file, orders: data });
  };

  handlePollCheck = value => () => {
    const { selectedGroups } = this.state;
    const currentIndex = selectedGroups.indexOf(value);
    const newChecked = [...selectedGroups];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState(
      {
        selectedGroups: newChecked
      }
    );
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
    console.log('State : ', this.state);
    return !loggedUser.logged ? (
      <div className={classes.root}>
        <h1>Necesitas loggearte para ver esta informacion</h1>
      </div>
    ) : (
        <Grid container className={classes.root}>
          <Grid item xs={6}>
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
          <Grid item xs={6}>
          <Grid item xs={12}>
                Lista de Encuestas Disponibles
            </Grid>
            <List>
              {this.state.questions.map((value, i) => (
                <ListItem
                  key={i}
                  role={undefined}
                  dense
                  button
                  onClick={this.handlePollCheck(value)}
                  className={classes.listItem}
                >
                  <Checkbox
                    checked={this.state.selectedGroups.indexOf(value) !== -1}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText
                    primary={`Encuesta: ${value.subject} - Cuerpo: ${value.greet}`}
                    secondary={(value.type === "opinion_scale") ? `Pregunta: ${value.title} - tipo: Escala - escala: 1 al ${value.scale}` : (value.type === "yes_no") ? `Pregunta: ${value.title} - tipo: Si o No` : `Pregunta: ${value.title} - tipo: Selección - Opciones: ${value.choices.map((choice, i) => `${i}. ${choice} - `)}` }
                    secondary={"verga"}
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
            { this.state.selectedFile.name ? `Ordenes contendas en el archivo : ${this.state.selectedFile.name}` : `Selecciona un archivo para ver las ordenes contenidas`}
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