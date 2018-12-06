import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import CreateIcon from "@material-ui/icons/Create";

const styles = {
  buttonLogin: {
    backgroundColor: "#6eb4ea",
    marginLeft: "10px",
    color: "white",
    "&:hover": {
      color: "white"
    }
  }
};

class UserCreateButton extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Button
          className={classes.buttonLogin}
          size="small"
          component={Link}
          to={"/user/create"}
        >
          Crear Usuario
        </Button>
      </div>
    );
  }
}

UserCreateButton.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UserCreateButton);
