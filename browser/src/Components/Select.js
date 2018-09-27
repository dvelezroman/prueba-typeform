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

const especialidades = [
  {
    value: "Medicina General",
    label: "Medicina General"
  },
  {
    value: "Ginecología",
    label: "Ginecología"
  },
  {
    value: "Traumatología",
    label: "Traumatología"
  },
  {
    value: "Cardiología",
    label: "Cardiología"
  }
];

class Select extends React.Component {
  render() {
    const { classes, question, handleChangeSpeciality } = this.props;

    return (
      <TextField
        id="outlined-select-native"
        select
        label="Especialidad"
        className={classes.textField}
        value={
          question.speciality ? question.speciality : especialidades[0].value
        }
        onChange={handleChangeSpeciality}
        SelectProps={{
          native: true,
          MenuProps: {
            className: classes.menu
          }
        }}
        helperText="Selecciona especialidad médica"
        margin="normal"
        variant="outlined"
      >
        {especialidades.map(option => (
          <option key={option.value} value={option.value}>
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
