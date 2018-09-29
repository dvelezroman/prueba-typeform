import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: "none"
  }
});

function CreatePollButton(props) {
  const { classes } = props;
  return (
    <div>
      <Button variant="contained" className={classes.button}>
        Crear Encuesta
      </Button>
    </div>
  );
}

CreatePollButton.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CreatePollButton);
