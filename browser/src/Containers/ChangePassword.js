import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import axios from 'axios';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router";
import TextField from "@material-ui/core/TextField";
import { Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { loginUser, storeUser, clearUser } from "../actions/UserActions";

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
  loggedUser: state.userReducer
});

const mapDispatchToProps = dispatch => ({
  loginUser: userInfo => dispatch(loginUser(userInfo)),
  storeUser: user => dispatch(storeUser(user)),
  clearUser: () => dispatch(clearUser())
});

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      newpassword: "",
      newpassword2: "",
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
    if (this.state.newpassword === this.state.newpassword2) {
        const passwordInfo = {
            email: this.props.loggedUser.user.email,
            password: this.state.password,
            newpassword: this.state.newpassword
        };
        axios.put('/api/login/password/new', passwordInfo).then(res => res.data).then(data => {
            if (data.success) {
                alert('La contraseña fue modificada con éxito');
                this.setState({ redirect: true });
            }
            else {
                alert('No se pudo cambiar la contraseña');
            }
        })
    }else {
        alert('Las contraseñas no coinciden');
    }
  }

  render() {
    const { classes, loggedUser } = this.props;
    const { password, newpassword, newpassword2, redirect } = this.state;
    if (!loggedUser.logged) {
        return (
        <div className={classes.root}>
          <h1>Necesitas loggearte para ver esta informacion</h1>
        </div>
      )} else {
        return redirect ? (
            <div>
              <Redirect to="/login" />
            </div>
          ) : (
            <div>
              <h1 className={classes.title}>Cambiar Contraseña</h1>
              <Grid container spacing={16} justify="center">
                <Grid item md={5}>
                  <div>
                    <form className={classes.container} autoComplete="off">
                      <TextField
                        required
                        fullWidth={true}
                        id="password"
                        label="contraseña actual"
                        value={password}
                        type="password"
                        onChange={this.handleChange("password")}
                        margin="normal"
                      />
                      <TextField
                        required
                        fullWidth={true}
                        id="newpassword"
                        label="Nueva contraseña"
                        value={newpassword}
                        type="password"
                        onChange={this.handleChange("newpassword")}
                        margin="normal"
                      />
                      <TextField
                        required
                        fullWidth={true}
                        id="newpassword2"
                        label="Repita la nueva contraseña"
                        value={newpassword2}
                        type="password"
                        onChange={this.handleChange("newpassword2")}
                        margin="normal"
                      />
                      <Button
                        variant="contained"
                        size="small"
                        className={classes.button}
                        onClick={this.handleSubmit}
                      >
                        Cambiar Contraseña
                      </Button>
                    </form>
                  </div>
                </Grid>
              </Grid>
            </div>
          );
      }
  }
}

ChangePassword.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(ChangePassword)));