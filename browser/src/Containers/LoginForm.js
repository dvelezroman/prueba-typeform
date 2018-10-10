import React from "react";
import { Link, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router";
import TextField from "@material-ui/core/TextField";
import { Grid, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import axios from "axios";
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

class TextFields extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
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
    const userInfo = {
      email: this.state.email,
      password: this.state.password
    };
    this.props
      .loginUser(userInfo)
      .then(res => res.data)
      .then(user => {
        if (user.success) {
          this.props.storeUser(user.data);
          this.setState({ redirect: true });
        } else {
          alert("Usuario o contraseña erronea");
          this.props.clearUser();
        }
      });
  }

  render() {
    //console.log("User Logged", this.props.loggedUser);
    const { classes } = this.props;
    const { email, password, redirect } = this.state;
    return redirect ? (
      <div>
        <Redirect to="/" />
      </div>
    ) : (
      <div>
        <h1 className={classes.title}>Login</h1>
        <Grid container spacing={16} justify="center">
          <Grid item md={5}>
            <div>
              <form className={classes.container} autoComplete="off">
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
                  label="Password"
                  value={password}
                  type="password"
                  onChange={this.handleChange("password")}
                  autoComplete="current-password"
                  margin="normal"
                />
                <Button
                  variant="contained"
                  size="small"
                  className={classes.button}
                  onClick={this.handleSubmit}
                >
                  Iniciar Sesión
                </Button>
              </form>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

TextFields.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(TextFields)));
