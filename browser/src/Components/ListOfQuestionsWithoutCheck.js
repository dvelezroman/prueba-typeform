import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { getQuestionsDB } from "../actions/questionActions";

const styles = theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    position: "relative",
    overflow: "auto",
    maxHeight: 300
  },
  listSection: {
    backgroundColor: "inherit"
  },
  ul: {
    backgroundColor: "inherit",
    padding: 0
  }
});

class ListOfQuestionsWithoutCheck extends Component {
  render() {
    const { classes, questions } = this.props;

    return (
      <List className={classes.root} subheader={<li />}>
        {questions.map(question => (
          <ListItem key={question.ref}>
            <ListItemText
              primary={question.title}
              secondary={`${question.description}`}
            />
          </ListItem>
        ))}
      </List>
    );
  }
}

ListOfQuestionsWithoutCheck.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  //questions: state.questionsReducer.questions
});

const mapDispatchToProps = dispatch => ({
  getQuestionsDB: () => dispatch(getQuestionsDB())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ListOfQuestionsWithoutCheck));
