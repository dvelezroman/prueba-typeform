import React from "react";
import xlsxj from "xls-to-json";
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

function ContainedButton(props) {
  const { classes } = props;
  return (
    <div>
      <form
        id="uploadForm"
        enctype="multipart/form-data"
        action="http://localhost:3001/api/upload"
        method="post"
      >
        <input type="file" name="file" />
        <input type="submit" value="Upload" name="submit" />
      </form>
    </div>
  );
}

ContainedButton.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ContainedButton);
