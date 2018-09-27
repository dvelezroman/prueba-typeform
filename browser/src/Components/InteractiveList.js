import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";

import ListItemText from "@material-ui/core/ListItemText";

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 752
  },
  demo: {
    backgroundColor: theme.palette.background.paper
  },
  title: {
    margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`
  }
});

class InteractiveList extends React.Component {
  state = {
    dense: false,
    secondary: false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.questions != this.props.questions) return true;
    return false;
  }

  render() {
    const { classes, questions } = this.props;
    const { dense, secondary } = this.state;

    return (
      <div className={classes.root}>
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={dense}
                onChange={event =>
                  this.setState({ dense: event.target.checked })
                }
                value="dense"
              />
            }
            label="Enable dense"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={secondary}
                onChange={event =>
                  this.setState({ secondary: event.target.checked })
                }
                value="secondary"
              />
            }
            label="Enable secondary text"
          />
        </FormGroup>
        <Grid container spacing={16}>
          <Grid item xs={12} md={6}>
            <Typography variant="title" className={classes.title}>
              Lista de Preguntas
            </Typography>
            <div className={classes.demo}>
              <List dense={dense}>
                {questions.map((question, i) =>
                  React.cloneElement(
                    <ListItem>
                      <ListItemText
                        primary={`${question.title} ${i + 1}`}
                        secondary={secondary ? question.description : null}
                      />
                    </ListItem>,
                    {
                      key: i
                    }
                  )
                )}
              </List>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

InteractiveList.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  questions: state.questionsReducer.questions
});

export default connect(mapStateToProps)(withStyles(styles)(InteractiveList));
