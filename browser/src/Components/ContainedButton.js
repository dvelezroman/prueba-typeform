import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
//import axios from "axios";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import ShowOrders from "./ShowOrders";
import CircularIndeterminated from "./CircularIndeterminated";
import { clearRegs, uploadFile } from "../actions/uploadFileActions";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: "none"
  },
  chip: {
    margin: theme.spacing.unit
  }
});

class ContainedButton extends Component {
  constructor() {
    super();
    this.state = {
      file: null,
      orders: []
    };
  }

  onFormSubmit = async (event) => {
    event.preventDefault(); // Stop form submit
    if (this.state.file) {
      let response = await this.props.uploadFile(this.state.file).then(res => res);
      //console.log(`Response: ${response}`);
      if (response.error_code) alert(response.message)
      else {
        
        // let { data } = await axios.get(`/api/files/${response.data}/orders`)
        // .then(res => res.data);
        // this.setState({ orders: data });
        alert('El archivo cargó completamente');
        this.props.history.push("/files");
      }
    } else {
      alert("Debe seleccionar un archivo");
    }
  };

  onChange = e => {
    e.preventDefault(); // stops for summit
    this.setState({ file: e.target.files[0] });
  };

  componentWillUnmount() {
    this.props.clearRegs();
  };

  render() {
    const { classes, loggedUser, loading } = this.props;
    return !loggedUser.logged ? (
      <div className={classes.root}>
        <h1>Necesitas loggearte para ver esta informacion</h1>
      </div>
    ) : (
      <div>
        <Grid container>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Chip
                label={
                  this.state.file
                    ? this.state.file.name
                    : "Click en el botón para cargar la información"
                }
                className={classes.chip}
              />
            </Paper>
            <Paper className={classes.paper}>
              <form onSubmit={this.onFormSubmit}>
                <input
                  type="file"
                  id="contained-button-file"
                  onChange={this.onChange}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="default"
                  className={classes.button}
                >
                  Cargar Archivo
                  <CloudUploadIcon className={classes.rightIcon} />
                </Button>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            {loading ? <CircularIndeterminated /> : ""}
            {/* {loading ? <CircularIndeterminated /> : <ShowOrders orders={this.state.orders}/>} */}
          </Grid>
        </Grid>
      </div>
    );
  }
}

ContainedButton.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  loggedUser: state.userReducer,
  loading: state.uploadReducer.loading
});

const mapDispatchToProps = dispatch => ({
  uploadFile: file => dispatch(uploadFile(file)),
  clearRegs: () => dispatch(clearRegs())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(ContainedButton)));
