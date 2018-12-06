import React from "react";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { clearUser } from "../actions/UserActions";

const styles = {
  buttonLogin: {
    backgroundColor: "#6eb4ea",
    marginLeft: "10px",
    color: "white",
    "&:hover": {
      color: "white"
    }
  },
  comboLogin: {
    display: "flex",
    flexDirection: "row",
    height: "40px",
    marginLeft: "10px"
  },
  avatar: {
    color: "#fff",
    backgroundColor: "#6eb4ea",
    width: "35px",
    height: "35px"
  }
};

const mapStateToProps = state => ({
  loggedUser: state.userReducer
});

const mapDispatchToProps = dispatch => ({
  clearUser: () => dispatch(clearUser())
});

class ChPassBtn extends React.Component {
  render() {
    const { classes } = this.props;
    //var isLogged = Object.keys(loggedUser).length;
    return (
      <div>
        <Button
          className={classes.buttonLogin}
          size="small"
          component={Link}
          to={"/login/password/change"}
        >
          Cambiar Contraseña
        </Button>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ChPassBtn));
