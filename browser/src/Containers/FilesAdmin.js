import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItem from "@material-ui/core/ListItem";
import Grid from "@material-ui/core/Grid";
import FolderIcon from "@material-ui/icons/Folder";
import DeleteIcon from "@material-ui/icons/Delete";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import ListItemText from "@material-ui/core/ListItemText";
import ShowOrders from "../Components/ShowOrders";
import LinearIndeterminated from "../Components/LinearIndeterminated";
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
  },
  orders: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    position: "relative",
    overflow: "auto",
    maxHeight: 500
  }
});

class UploadedFiles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: {},
      files: [],
      orders: []
    };
    this.handleListItemClick = this.handleListItemClick.bind(this);
    this.handleClickDelete = this.handleClickDelete.bind(this);
  }

  handleListItemClick = async (event, file) => {
    this.setState({ orders: [] });
    axios
      .get(`/api/files/${file.id}/orders`)
      .then(res => res.data)
      .then(data => {
        //console.log('Orders : ',data);
        if (!data.error) {
          //console.log("Ya los traje: ", data.data);
          this.setState({
            selectedFile: file,
            orders: data.data
          });
        } else {
          this.setState({ selectedFile: file });
          alert("Este archivo no tiene registros o esta corrupto");
        }
      });
  };

  handleClickDelete = async (event, item) => {
    event.preventDefault();
    //console.log("Item: ", item.id);
    let response = await axios
      .delete(`/api/files/delete/${item.id}`)
      .then(res => res.data);
    if (!response.error) {
      // borrar el archivo de array files con lodash
      let files = this.state.files;
      if (files.length > 1) {
        files = _.remove(files, function(file) {
          return file.id === item.id;
        });
      } else {
        files = [];
      }
      this.setState({ orders: [], files }, () => alert("Archivo borrado"));
    }
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

  fetchFiles = () => axios.get("/api/files").then(res => res.data);

  async componentDidMount() {
    let raw_files = await this.fetchFiles().then(data => data.data);
    let files = raw_files.map(item => ({
      id: item.id,
      ref: item.ref,
      name: item.name,
      uploaded: `${item.createdAt.split("T")[0]} - ${
        item.createdAt.split("T")[1].split(".")[0]
      } `
    }));
    this.setState({ files: files });
  }

  render() {
    const { classes, loggedUser } = this.props;
    //console.log("Files : ", this.state.files);
    return !loggedUser.logged ? (
      <div className={classes.root}>
        <h1>Necesitas loggearte para ver esta informacion</h1>
      </div>
    ) : this.state.sending ? (
      <Grid container>
        <Grid item xs={2} />
        <Grid item xs={8}>
          <LinearIndeterminated msg={"Cargando"} />
        </Grid>
        <Grid item xs={2} />
      </Grid>
    ) : (
      <Grid container className={classes.root}>
        <Grid item xs={12}>
          <Grid item xs={12}>
            Lista de archivos que han sido cargados
          </Grid>
          <Grid item xs={12}>
            {this.state.files.map(item => (
              <List key={item.id} component="nav">
                <ListItem selected={this.state.selectedFile.id === item.id}>
                  <IconButton
                    aria-label="Ver Ordenes"
                    onClick={event => this.handleListItemClick(event, item)}
                  >
                    <FolderIcon />
                  </IconButton>
                  <ListItemText
                    primary={`Archivo : ${item.name}`}
                    secondary={`Fecha de carga: ${item.uploaded}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      aria-label="Delete"
                      onClick={event => this.handleClickDelete(event, item)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {this.state.selectedFile.name ? (
            <Grid item xs={12} className={classes.orders}>
              <ShowOrders
                orders={this.state.orders}
                items={this.state.orders}
                send={false}
              />
            </Grid>
          ) : (
            `Selecciona un archivo para ver las ordenes contenidas`
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
