import React from "react";
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
  const { classes, disabled, createPoll } = props;
  return (
    <div>
      <Button
        disabled={disabled}
        variant="contained"
        className={classes.button}
        onClick={createPoll}
      >
        Crear Encuesta
      </Button>
    </div>
  );
}

CreatePollButton.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CreatePollButton);
