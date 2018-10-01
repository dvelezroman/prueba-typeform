import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import CommentIcon from "@material-ui/icons/Comment";
import Button from "@material-ui/core/Button";
import NavigationIcon from "@material-ui/icons/Navigation";

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
      .get("http://localhost:3001/api/clients/emails", polls[0]) // hay que arreglar ver como enviar de una a consultar los emails de todos los forms que checkeó
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
      .post("http://localhost:3001/api/polls/send", { emails, urlForm })
      .then(res => res.data)
      .then(msg => alert("La encuesta se envió satisfactoriamente"))
      .catch(err => err);
  };

  componentDidMount() {
    axios
      .get("http://localhost:3001/api/polls")
      .then(res => res.data)
      .then(array => {
        let forms = array.map(item => ({
          id: item.id,
          ref: item.ref,
          name: item.name,
          url: item.url,
          group: item.group.description,
          file: item.file.name,
          fileId: item.fileId,
          groupId: item.groupId
        }));
        this.setState({ forms: forms });
      });
  }

  render() {
    const { classes } = this.props;
    // console.log("State : ", this.state);
    return (
      <div className={classes.root}>
        <Grid container className={classes.root}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Button
                variant="extendedFab"
                aria-label="Delete"
                onClick={this.handleSendPoll}
                className={classes.button}
              >
                <NavigationIcon className={classes.extendedIcon} />
                Enviar Encuestas
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              Selecciona los formularios que deseas enviar
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <List className={classes.list}>
                {this.state.forms.map(value => (
                  <ListItem
                    key={value}
                    role={undefined}
                    dense
                    button
                    onClick={this.handleToggle(value)}
                    className={classes.listItem}
                  >
                    <Checkbox
                      checked={this.state.checked.indexOf(value) !== -1}
                      tabIndex={-1}
                      disableRipple
                    />
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

export default withStyles(styles)(SendPolls);
