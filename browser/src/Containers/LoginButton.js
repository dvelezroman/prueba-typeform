import React from "react";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import Avatar from "@material-ui/core/Avatar";

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

const mapStateToProps = ({ users }) => ({
  //loggedUser: users.loggedUser
});

const mapDispatchToProps = dispatch => ({
  //unlogUser: () => dispatch(unlogUser())
});

class LoginBtn extends React.Component {
  render() {
    const { classes, loggedUser, unlogUser } = this.props;
    //var isLogged = Object.keys(loggedUser).length;
    return (
      <div>
        {false ? (
          <div className={classes.comboLogin}>
            <Button
              className={classes.buttonLogin}
              onClick={unlogUser}
              size="medium"
            >
              Logout
            </Button>
          </div>
        ) : (
          <Button
            className={classes.buttonLogin}
            size="medium"
            component={Link}
            to={"/login"}
          >
            Login
          </Button>
        )}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(LoginBtn));
