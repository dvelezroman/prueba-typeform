import React, { Component } from "react";
import axios from "axios";
import xlsxj from "xls-to-json";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: "none"
  },
  chip: {
    margin: theme.spacing.unit
  }
});

class ContainedButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null
    };
    this.onChange = this.onChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }

  onFormSubmit = e => {
    e.preventDefault(); // Stop form submit
    console.log("onFormSubmit");
    this.fileUpload(this.state.file).then(response => {
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
        <div>
          <Chip
            label={this.state.file ? this.state.file.name : "No File"}
            className={classes.chip}
          />
        </div>
        <form onSubmit={this.onFormSubmit}>
          <input
            type="file"
            id="contained-button-file"
            onChange={this.onChange}
          />

          <button type="submit">Upload</button>
        </form>

        {/* {<input
        accept="image/*"
        className={classes.input}
        id="contained-button-file"
        multiple
        type="file"
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" component="span" className={classes.button}>
          Upload
        </Button>
      </label> */}
        {/* /* <form
          id="uploadForm"
          enctype="multipart/form-data"
          action="http://localhost:3001/api/upload"
          method="post"
        >
          <input accept="xls/*"
          className={classes.input}
          id="contained-button-file"
          multiple 
          type="file
          name="file" />
          <input type="submit" value="Upload" name="submit" />
        </form> */}
      </div>
    );
  }
}

ContainedButton.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ContainedButton);
