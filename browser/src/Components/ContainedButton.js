import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
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
      file: null
    };
  }

  onFormSubmit = async (e) => {
    e.preventDefault(); // Stop form submit
    if (this.state.file) {
      let response = await this.props.uploadFile(this.state.file).then(res => res);
      //console.log(`Response: ${JSON.stringify(response)}`);
      if (response.error_code) alert(`Hubo un error, quizas estas tratando de subir un archivo que ya fue cargado anteriormente...`)
      else {
        //console.log(`Response: ${JSON.stringify(response.data)}`);
        alert('Todo bien');
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
            {loading ? <CircularIndeterminated /> : <ShowOrders />}
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
  orders: state.uploadReducer.orders,
  loading: state.uploadReducer.loading
});

const mapDispatchToProps = dispatch => ({
  uploadFile: file => dispatch(uploadFile(file)),
  clearRegs: () => dispatch(clearRegs())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ContainedButton));
