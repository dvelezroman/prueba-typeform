import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router";
import TextField from "@material-ui/core/TextField";
import { Grid, Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import axios from "axios";
import { connect } from "react-redux";
import { loginUser } from "../actions/UserActions";

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

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  loginUser: userInfo => dispatch(loginUser(userInfo))
});

class TextFields extends React.Component {
  constructor() {
    super();
    this.state = {
      mail: "",
      password: "",
      emailCheck: true,
      passCheck: true,
      gralCheck: false,
      errormsg: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  handleChange = name => event => {
    const aux = this.state;
    aux[name] = event.target.value;
    var echeck = aux.emailCheck;
    if (name === "mail") {
      echeck = this.validateEmail(event.target.value);
    }
    var check = aux.mail.length && aux.password.length && echeck ? true : false;
    this.setState({
      [name]: event.target.value,
      gralCheck: check,
      emailCheck: echeck,
      passCheck: true,
      errormsg: ""
    });
  };

  handleSubmit(evt) {
    evt.preventDefault();
    const userInfo = {
      username: this.state.mail.toLowerCase(),
      password: this.state.password
    };
    axios
      .post("/api/login", userInfo) // modificar aqui para pedir login a la ruta del API
      .then(res => res.data)
      .then(data => {
        if (data.success) {
          this.props.logUser(data.user.id);
          this.props.history.goBack();
          return data;
        }
        this.setState(data.info);
      })
      .then(data => this.props.itemsInCart(data.user.id))
      .catch(err => err);
  }

  render() {
    const { classes } = this.props;
    const {
      mail,
      password,
      emailCheck,
      passCheck,
      gralCheck,
      errormsg
    } = this.state;

    return (
      <div>
        {" "}
        <h1 className={classes.title}>Login</h1>
        <Grid container spacing={16} justify="center">
          <Grid item md={5}>
            <div>
              <form className={classes.container} autoComplete="off">
                <TextField
                  error={!emailCheck}
                  required
                  fullWidth={true}
                  id="mail"
                  label="E-Mail"
                  helperText={!emailCheck ? errormsg : ""}
                  value={mail}
                  type="email"
                  onChange={this.handleChange("mail")}
                  margin="normal"
                />
                <TextField
                  error={!passCheck}
                  required
                  fullWidth={true}
                  id="password-input"
                  label="Password"
                  helperText={!passCheck ? errormsg : ""}
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
                  disabled={!gralCheck}
                >
                  Iniciar Sesión
                </Button>
              </form>
            </div>
            <div className={classes.newUser}>
              No estás registrado?{" "}
              <Link to="/accounts/new" action="replace">
                Click aquí!
              </Link>
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
