import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
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
    overflow: "auto",
    maxHeight: 300
  }
});

class UploadedFiles extends Component {
  state = {
    selectedFile: {},
    files: [],
    orders: []
  };

  handleListItemClick = async (event, file) => {
    let { data } = await axios.get(`/api/files/${file.name}/orders`).then(res => res.data);
    this.setState({ selectedFile: file, orders: data });
  };

  componentDidMount() {
    axios.get("/api/files")
    .then(res => res.data)
    .then(({ data }) => {
        let files = data.map(item => (
            {
                id: item.id,
                ref: item.ref,
                name: item.name,
                uploaded: item.createdAt.split('T')[0]
            }
        ));
        this.setState({ files: files });
      });
  }

  render() {
    const { classes, loggedUser } = this.props;
    //console.log('Orders : ', this.state.orders);
    return !loggedUser.logged ? (
      <div className={classes.root}>
        <h1>Necesitas loggearte para ver esta informacion</h1>
      </div>
    ) : (
        <Grid container className={classes.root}>
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
          <Grid item xs={12}>
            { this.state.selectedFile.name ? `Ordenes contendas en el archivo : ${this.state.selectedFile.name}` : `Selecciona un archivo para ver las ordenes contenidas`}
          </Grid>
          <Grid>
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