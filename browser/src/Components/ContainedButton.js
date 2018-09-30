import React, { Component } from "react";
import axios from "axios";
import xlsxj from "xls-to-json";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";

import CircularIndeterminated from "./CircularIndeterminated";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: "none"
  },
  button: {
    margin: theme.spacing.unit
  },
  chip: {
    margin: theme.spacing.unit
  }
});

class ContainedButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      loading: false
    };
    this.onChange = this.onChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit = e => {
    e.preventDefault(); // Stop form submit
    this.setState({ loading: true });
    console.log("onFormSubmit");
    this.fileUpload(this.state.file).then(response => {
      this.setState({ loading: false });
      console.log("Se subio el archivo : ", response.data);
    });
  };

  onChange = e => {
    console.log("onChange");
    e.preventDefault(); // stops for summit
    this.setState({ file: e.target.files[0] });
  };

  fileUpload = file => {
    const url = "http://localhost:3001/api/upload";
    const formData = new FormData();
    formData.append("file", file);
    const config = {
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      }
    };
    return axios.post(url, formData, config);
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Paper className={classes.paper}>
          <Chip
            label={
              this.state.file
                ? this.state.file.name
                : "Click en el botón para cargar la información"
            }
            className={classes.chip}
          />
        </Paper>
        <Paper className={classes.paper}>
          <form onSubmit={this.onFormSubmit}>
            <input
              type="file"
              id="contained-button-file"
              onChange={this.onChange}
            />
            <Button
              type="submit"
              variant="contained"
              color="default"
              className={classes.button}
            >
              Cargar Archivo
              <CloudUploadIcon className={classes.rightIcon} />
            </Button>
          </form>
        </Paper>
      </div>
    );
  }
}

ContainedButton.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ContainedButton);
