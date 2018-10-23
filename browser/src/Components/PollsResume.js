import React, { Component } from "react";
import { connect } from "react-redux";
import axios from 'axios';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { getPollAnswers } from '../actions/typeForm';

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  },
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    }
  }
});

let id = 0;
function createData(name, calories, fat, carbs, protein) {
  id += 1;
  return { id, name, calories, fat, carbs, protein };
}

const rows = [
  createData(
    "Encuesta de Satifacción Consultas Ambulatorias",
    200,
    145,
    40,
    15
  ),
  createData("Encuesta de Atención en Rayos X", 100, 60, 30, 10),
  createData("Encuesta de Satisfaccion en Procedimientos", 50, 20, 25, 5)
];

class PollsResume extends Component {
  constructor(props) {
    super(props),
    this.state = {
      sendpolls: []
    }
  };

  componentDidMount() {
    // traer las refs de las encuestas que han sido enviadas y armar un array de refs []
    axios.get('/api/polls/sendpolls').then(res => res.data).then(sendpolls => {
      let polls = sendpolls.map(sendpoll => ({
        clients: sendpoll.clients,
        ref: sendpoll.poll.ref,
        answers: sendpoll.answers,
        id: sendpoll.id,
        file: sendpoll.poll.file.name,
        name: sendpoll.poll.name,
        group: sendpoll.poll.group.description
      }));
      console.log('pollsend ; ', polls);
      for (let i = 0; i < polls.length; i++) {
        this.props.getPollAnswers(polls[i].ref).then(answers => {
          let data = {
            ref: polls[0].ref,
            answers: answers.items.length
          };
          axios.post('/api/polls/sendpolls', data).then(() => console.log('Todo bien'));
        })
        
      }
    });
    // .then(polls => {
    //   console.log(`Las encuestas enviadas : ${polls}`);
      // traer las respuestas de cada encuesta enviada
      // for (let i = 0; i < polls.length; i++) {
      //   let this.props.getPollAnswers(polls[i]).then(answers => {
      //     // aqui enviar a actualizar el valor de answer de la encuesta enviada y ponerlo en el store para que actualice automaticamente
      //   }).catch(err => err);
      // };
   // })
  };

  render() {
    console.log('Hola render');
    const { classes, loggedUser, sendpolls } = this.props;
    return !loggedUser.logged ? (
      <div className={classes.root}>
        <h1>Necesitas loggearte para ver esta informacion</h1>
      </div>
    ) : (
      <Grid container>
        <Grid item xs={12}>
          <Paper>CUADRO DE ESTADO DE LOS FORMULARIOS DE ENCUESTAS</Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <CustomTableCell>Formulario</CustomTableCell>
                  <CustomTableCell numeric>Clientes Enviados</CustomTableCell>
                  <CustomTableCell numeric>Contestados</CustomTableCell>
                  <CustomTableCell numeric>Por Contestar</CustomTableCell>
                  <CustomTableCell numeric>No Constestados</CustomTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => {
                  return (
                    <TableRow className={classes.row} key={row.id}>
                      <CustomTableCell component="th" scope="row">
                        {row.name}
                      </CustomTableCell>
                      <CustomTableCell numeric>{row.calories}</CustomTableCell>
                      <CustomTableCell numeric>{row.fat}</CustomTableCell>
                      <CustomTableCell numeric>{row.carbs}</CustomTableCell>
                      <CustomTableCell numeric>{row.protein}</CustomTableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

PollsResume.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  loggedUser: state.userReducer
});

const mapDispatchToProps = dispatch => ({
  getPollAnswers: ref => dispatch(getPollAnswers(ref))
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PollsResume));
