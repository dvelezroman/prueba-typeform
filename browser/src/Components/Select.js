import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import { storeQuestion } from "../actions/questionActions";

import TextField from "@material-ui/core/TextField";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 200
  }
});

class Select extends React.Component {
  render() {
    const { classes, label, value, handleChange, array } = this.props;

    return (
      <TextField
        id={`${label}-select`}
        select
        label={label}
        className={classes.textField}
        value={value ? value : array[0].value}
        onChange={handleChange(label)}
        SelectProps={{
          native: true,
          MenuProps: {
            className: classes.menu
          }
        }}
        helperText="Selecciona"
        margin="normal"
        variant="outlined"
      >
        {array.map(option => (
          <option key={option.value} value={option.label}>
            {option.label}
          </option>
        ))}
      </TextField>
    );
  }
}

Select.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  question: state.questionsReducer.question
});

const mapDispatchToProps = dispatch => ({
  storeQuestion: question => dispatch(storeQuestion(question))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Select));
