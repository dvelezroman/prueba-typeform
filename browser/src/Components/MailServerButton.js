import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import MailIcon from "@material-ui/icons/Mail";

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

class MailServerButton extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Button
          className={classes.buttonLogin}
          size="small"
          component={Link}
          to={"/mailserver"}
        >
          Configurar Servidor Mail
        </Button>
      </div>
    );
  }
}

MailServerButton.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MailServerButton);
