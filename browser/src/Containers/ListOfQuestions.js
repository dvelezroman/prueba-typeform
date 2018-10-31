import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Paper from "@material-ui/core/Paper";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import { getQuestionsDB } from "../actions/questionActions";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: "100%",
    backgroundColor: theme.palette.background.paper
  },
  list: {
    maxHeight: 300,
    overflow: "auto"
  }
});

class ListOfQuestions extends Component {
  state = {
    checked: []
  };

  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState(
      {
        checked: newChecked
      },
      () => this.props.handleCheck(this.state.checked)
    );
  };

  componentDidMount() {
    this.props.getQuestionsDB();
  }

  render() {
    const { classes, questions, filterGroup } = this.props;
    //let filtered_questions = questions;
    let filtered_questions = questions.filter(question => {
      if (question.enabled && question.group && question.groupId === Number(filterGroup)) {
        return true;
      }
      return false;
    });
    return (
      <div className={classes.root}>
        <Paper className={classes.list}>
          <List>
            {filtered_questions.map((value, i) => (
              <ListItem
                key={i}
                role={undefined}
                dense
                button
                onClick={this.handleToggle(value)}
                className={classes.listItem}
              >
                <Checkbox
                  checked={this.state.checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                />
                <ListItemText
                  primary={`${value.title}`}
                  secondary={value.description ? value.description : null}
                />
                {/* <ListItemSecondaryAction>
                  <IconButton aria-label="Comments">
                    <CommentIcon />
                  </IconButton>
                </ListItemSecondaryAction> */}
              </ListItem>
            ))}
          </List>
        </Paper>
      </div>
    );
  }
}

ListOfQuestions.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  questions: state.questionsReducer.questions
});

const mapDispatchToProps = dispatch => ({
  getQuestionsDB: () => dispatch(getQuestionsDB())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ListOfQuestions));
