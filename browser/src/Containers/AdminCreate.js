import React from "react";
import { Redirect } from "react-router-dom";
import { withRouter } from "react-router";
import axios from "axios";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { setAdmin } from "../actions/adminActions";

// import { loginUser, storeUser, clearUser } from "../actions/UserActions";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  newUser: {
    color: "grey",
    fontSize: "80%",
    marginTop: "5%",
    typography: {
      fontFamily: "Roboto"
    }
  },
  menu: {
    width: 200
  },
  button: {
    backgroundColor: "#6eb4ea",
    color: "white",
    "&:hover": {
      color: "white"
    }
  },
  button2: {
    backgroundColor: "red",
    color: "white",
    "&:hover": {
      color: "white"
    }
  },
  title: {
    textAlign: "center",
    typography: {
      fontFamily: "Roboto"
    }
  },
  error: {
    textAlign: "center",
    color: "red",
    typography: {
      fontFamily: "Roboto"
    }
  }
});

const mapStateToProps = state => ({
  existAdmin: state.adminReducer
});

const mapDispatchToProps = dispatch => ({
  setAdmin: () => dispatch(setAdmin())
});

class AdminCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      name: "",
      password: "",
      password2: "",
      role: "ADMIN_ROLE",
      redirect: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleSubmit(evt) {
    evt.preventDefault();
    if (
      this.state.name &&
      this.state.email &&
      this.state.password === this.state.password2
    ) {
      const userInfo = {
        email: this.state.email,
        name: this.state.name,
        password: this.state.password,
        role: this.state.role
      };
      axios
        .post("/api/users/new", userInfo)
        .then(res => res.data)
        .then(data => {
          if (!data.error) {
            this.setState({
              email: "",
              name: "",
              password: "",
              password2: ""
            });
            alert("El usuario se creó con éxito");
            this.props.setAdmin();
            this.props.history.goBack(-1);
            return this.props.history.push("/polls/resume");
            // this.setState({ redirect: true }, () =>
            //   alert("El usuario administrador se creó con éxito")
            // );
          } else {
            alert("El usuario administrador no se creó");
          }
        });
    } else {
      alert("Faltan datos para crear usuario, o las claves no coinciden");
    }
  }

  render() {
    //console.log("User Logged", this.props.loggedUser);
    const { classes } = this.props;
    const { name, email, password, password2, redirect } = this.state;
    return redirect ? (
      <div>
        <Redirect to="/login" />
      </div>
    ) : (
      <div>
        <h2 className={classes.title}>Creación de Usuario Administrador</h2>
        <Grid container spacing={16} justify="center">
          <Grid item md={5}>
            <div>
              <form className={classes.container} autoComplete="off">
                <TextField
                  required
                  fullWidth={true}
                  id="name"
                  label="Nombre"
                  value={name}
                  onChange={this.handleChange("name")}
                  margin="normal"
                />
                <TextField
                  required
                  fullWidth={true}
                  id="email"
                  label="E-Mail"
                  value={email}
                  type="email"
                  onChange={this.handleChange("email")}
                  margin="normal"
                />
                <TextField
                  required
                  fullWidth={true}
                  id="password-input"
                  label="Ingrese una Contraseña"
                  value={password}
                  type="password"
                  onChange={this.handleChange("password")}
                  margin="normal"
                />
                <TextField
                  required
                  fullWidth={true}
                  id="password-input2"
                  label="Vuelva a ingresar la misma Contraseña"
                  value={password2}
                  type="password"
                  onChange={this.handleChange("password2")}
                  margin="normal"
                />
                <Button
                  variant="contained"
                  size="small"
                  className={classes.button}
                  onClick={this.handleSubmit}
                >
                  Crear Usuario
                </Button>
              </form>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

AdminCreate.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(AdminCreate)));
