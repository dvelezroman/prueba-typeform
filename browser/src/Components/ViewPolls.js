import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";

import IconButton from "@material-ui/core/IconButton";
import CommentIcon from "@material-ui/icons/Comment";

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
    overflow: "auto",
    maxHeight: 300
  }
});

class SendPolls extends React.Component {
  state = {
    checked: [],
    forms: []
  };

  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked
    });
  };

  handleSendPoll = e => {
    e.preventDefault();
    let polls = this.state.checked.map(item => ({
      fileId: item.fileId,
      groupId: item.groupId
    }));
    let urlForm = this.state.checked[0].url;
    axios
      .get("/api/clients/emails", polls[0]) // hay que arreglar ver como enviar de una a consultar los emails de todos los forms que checkeó
      .then(res => res.data)
      .then(clients => {
        let emails = clients.map(client => ({
          client: {
            email: client.email,
            name: client.name
          },
          url: urlForm
        }));
        this.sendMails(emails, urlForm);
      });
  };

  sendMails = (clients, urlForm) => {
    //aqui va la llamada a la API que debe enviar el correo con la data que le paso por body
    let emails = [
      {
        email: "dvelezroman@gmail.com",
        name: "Dario Velez Roman"
      },
      {
        email: "joffremateo@gmail.com",
        name: "Joffre Mateo"
      }
    ];
    console.log("Listo para enviar a : ", emails, ", a la url : ", urlForm);
    axios
      .post("/api/polls/send", { emails, urlForm })
      .then(res => res.data)
      .then(msg => alert("La encuesta se envió satisfactoriamente"))
      .catch(err => err);
  };

  componentDidMount() {
    axios
      .get("/api/polls")
      .then(res => res.data)
      .then(array => {
        let forms = array.map(item => ({
          id: item.id,
          ref: item.ref,
          name: item.name,
          url: item.url,
          group: item.group ? item.group.description : "",
          file: item.file ? item.file.name : "",
          fileId: item.fileId,
          groupId: item.groupId
        }));
        this.setState({ forms: forms });
      });
  }

  render() {
    const { classes, loggedUser } = this.props;

    return !loggedUser.logged ? (
      <div className={classes.root}>
        <h1>Necesitas loggearte para ver esta informacion</h1>
      </div>
    ) : (
      <div className={classes.root}>
        <Grid container className={classes.root}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              Formularios creados que están listos para ser enviados
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <List className={classes.list}>
                {this.state.forms.map(value => (
                  <ListItem
                    key={value.ref}
                    role={undefined}
                    dense
                    button
                    onClick={this.handleToggle(value)}
                    className={classes.listItem}
                  >
                    <ListItemText
                      primary={`${value.name} -- URL: ${value.url}`}
                      secondary={`GRUPO: ${value.group} -- ARCHIVO: ${
                        value.file
                      }`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton aria-label="Comments">
                        <CommentIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

SendPolls.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  loggedUser: state.userReducer
});

export default connect(mapStateToProps)(withStyles(styles)(SendPolls));
