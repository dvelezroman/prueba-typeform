import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import CircularIndeterminated from "./CircularIndeterminated";
import { clearRegs, uploadFile } from "../actions/uploadFileActions";
import LinearIndeterminated from "./LinearIndeterminated";

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
      orders: [],
      loading: false
    };
  }

  onFormSubmit = async event => {
    event.preventDefault(); // Stop form submit
    //console.log("File", this.state.file);
    if (this.state.file && this.state.file.name.split(".")[1] === "xlsx") {
      this.setState({ loading: true });
      let response = await this.props
        .uploadFile(this.state.file)
        .then(res => res);
      //console.log(`Response: `, response.err_desc);
      if (response.error_code === 1) {
        console.log("Error : ", response.err_desc);
        alert(response.message);
      } else if (response.error_code === 2) {
        this.setState({ loading: false }, () =>
          alert(
            "Las cabeceras del archivo no estan correctas!...\n deben ser: HCU - Paciente - Orden	- Clasificacion	- Categoria	- Convenio - Empresa -Medico -Grupo - Servicio - Fecha	- Sucursal - cont	- email"
          )
        );
      } else if (response.error_code === 3) {
        this.setState({ loading: false }, () =>
          alert(
            "El archivo seleccionado, contiene mas de 1000 registros, para un mejor resultado y procesamiento de la información, seleccione archivos con menos registros, o divida el archivo en varios de menor tamaño"
          )
        );
      } else {
        // let { data } = await axios.get(`/api/files/${response.data}/orders`)
        // .then(res => res.data);
        // this.setState({ orders: data });
        this.setState({ loading: false }, () =>
          alert("El archivo cargó completamente")
        );
        this.props.history.push("/files");
      }
    } else {
      alert("Debe seleccionar un archivo con extensión de Excel .xlsx");
    }
  };

  onChange = e => {
    e.preventDefault(); // stops for summit
    this.setState({ file: e.target.files[0] });
  };

  componentWillUnmount() {
    this.props.clearRegs();
  }

  render() {
    const { classes, loggedUser, loading } = this.props;
    return !loggedUser.logged ? (
      <div className={classes.root}>
        <h1>Necesitas loggearte para ver esta informacion</h1>
      </div>
    ) : this.state.loading ? (
      <Grid container>
        <Grid item xs={2} />
        <Grid item xs={8}>
          <LinearIndeterminated
            msg={"Subiendo los datos al servidor... espere"}
          />
        </Grid>
        <Grid item xs={2} />
      </Grid>
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
                  accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
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
