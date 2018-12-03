import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
// import TextField from "@material-ui/core/TextField";
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
  },
  textField: {
    width: "100%",
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  group: {
    margin: `${theme.spacing.unit}px 0`
  },
  formControl: {
    margin: theme.spacing.unit * 3
  }
});

class SendPolls extends React.Component {
  state = {
    checked: [],
    forms: [],
    body: ""
  };

  handleChange = label => event => {
    this.setState({ [label]: event.target.value });
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
    if (this.state.checked.length === 1) {
      this.setState({
        checked: newChecked,
        body: ""
      });
    } else {
      this.setState({
        checked: newChecked
      });
    }
  };

  handleSendPoll = async e => {
    e.preventDefault();
    let server = await axios
      .get("/api/mailserver/selected")
      .then(res => res.data.data);
    //console.log('Server: ', server);
    let polls = this.state.checked.map(item => ({
      fileId: item.fileId,
      groupId: item.groupId
    }));
    let urlForm = this.state.checked; // revisar luego para enviar varios formularios a la vez
    // hacer un arreglo de promesas por cada encuesta seleccionada
    let promises_of_emails = polls.map(poll =>
      axios.post("/api/clients/emails", poll)
    );
    Promise.all([...promises_of_emails]).then(res => {
      let arrays = [];
      res.forEach((item, i) => {
        let hash_trie = {};
        let array = [];
        item.data.forEach(client => {
          let email = client.client.email;
          let name = client.client.name;
          if (!hash_trie[email]) {
            hash_trie[email] = true;
            array.push({ email: email, name: name });
          }
        });
        //console.log('Array: ', urlForm[i]);
        arrays.push({
          clients: array,
          formName: urlForm[i].name,
          urlForm: urlForm[i].url,
          subject: urlForm[i].subject,
          greet: urlForm[i].greet,
          body: this.state.body
        }); // aqui por cada formulario seleccionado debe crearse un elemento
      });
      let promises_for_sending_emails = [];

      arrays.forEach(array => {
        if (array.clients.length > 0) {
          promises_for_sending_emails.push(
            axios.post("/api/polls/send", { array: array, server })
          );
        }
      });
      Promise.all([...promises_for_sending_emails]).then(res => {
        console.log("Recibe de la api : ", res.data);
        if (res.length > 1) alert("Las encuestas se enviaron exitosamente");
        else alert("Las encuesta se envió exitosamente");
      });
    });
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
          subject: item.subject,
          greet: item.greet,
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
    //console.log('State : ', this.state)
    return !loggedUser.logged ? (
      <div className={classes.root}>
        <h1>Necesitas loggearte para ver esta informacion</h1>
      </div>
    ) : (
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
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                Selecciona los formularios que deseas enviar
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <List className={classes.list}>
                  {this.state.forms.map((value, i) => (
                    <ListItem
                      key={i}
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
          {/* <Grid item xs={6}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                Pega aquí el HTML del formulario, para enviarlo como bodo del correo
                Debes ir a buscar esto a tu cuenta en TypeForm.
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <TextField
                  disabled={this.state.checked.length === 1 ? false : true}
                  multiline
                  rowsMax="15"
                  onChange={this.handleChange("body")}
                  id="body"
                  value={this.state.body}
                  label="HTML para enviar la encuesta por correo"
                  placeholder="Pega aqui el HTML que esta en tu cuenta de TypeForm, que permite embeber el código de la encuesta en un correo"
                  helperText="Para habilitar esta opción solo debes de seleccionar una encuesta"
                  className={classes.textField}
                  margin="normal"
                  variant="outlined"
                />
              </Paper>
            </Grid>
          </Grid>         */}
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
