import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

const styles = {
  root: {
    flexGrow: 1
  }
};

function LinearIndeterminate(props) {
  const { classes, msg } = props;
  return (
    <div className={classes.root}>
      <div>{msg}</div>
      <div>
        <LinearProgress />
      </div>
    </div>
  );
}

LinearIndeterminate.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LinearIndeterminate);
