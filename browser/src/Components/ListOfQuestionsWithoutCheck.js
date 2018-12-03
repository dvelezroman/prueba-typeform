import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import axios from "axios";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { getQuestionsDB } from "../actions/questionActions";

const sortArray = array =>
  array.sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0));

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
  constructor(props) {
    super(props);
    this.state = {};
    this.clickEnable = this.clickEnable.bind(this);
  }

  clickEnable = value => event => {
    event.preventDefault();
    //console.log('Ref : ', value );
    axios
      .put("/api/questions/disable", { question_ref: value })
      .then(res => res.data)
      .then(data => {
        this.props.getQuestionsDB();
      });
  };

  componentDidMount() {
    this.props.getQuestionsDB();
  }

  render() {
    const { classes, questions } = this.props;
    let array = questions;
    array = sortArray(array);
    array = _.uniqBy(array, "question_ref");
    //console.log('Questions: ', array);
    return (
      <List className={classes.root} subheader={<li />}>
        {array.map(question => (
          <ListItem key={question.id}>
            <ListItemText
              primary={
                question.enabled
                  ? `${question.title} -- Categorías: ${question.categories}`
                  : `Deshabilitada (${question.title})`
              }
              secondary={
                question.enabled
                  ? `${question.description}  - Tipo: ${question.type}`
                  : ``
              }
            />
            {/* <IconButton aria-label="Actualizar" onClick={clickUpdate(question.id)}>
              <CommentIcon />
            </IconButton> */}
            <IconButton
              aria-label="Deshabilitar"
              onClick={this.clickEnable(question.question_ref)}
            >
              <DeleteIcon />
            </IconButton>
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
  questions: state.questionsReducer.questions
});

const mapDispatchToProps = dispatch => ({
  getQuestionsDB: () => dispatch(getQuestionsDB())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(ListOfQuestionsWithoutCheck));
