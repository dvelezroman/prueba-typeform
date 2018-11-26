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
import { getPollAnswers, getSendPolls } from '../actions/typeForm';

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 10
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

class PollsResume extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: "",
      polls: [],
      answers: []
    };
    this.showResume = this.showResume.bind(this);
  };

  showResume = pollsend => e => {
    //console.log('Ref: ', pollsendId);
    axios.get(`/api/polls/answers/${pollsend.id}`)
    .then(res => {
      this.setState({ selected: pollsend.ref, answers: res.data })
    });
  };

  componentDidMount() {
    // traer las refs de las encuestas que han sido enviadas y armar un array de refs []
    axios.get('/api/polls/sendpolls').then(res => res.data).then(sendpolls => {
      //console.log('SendPolls: ', sendpolls);
      let polls = sendpolls.map(sendpoll => ({
        clients: sendpoll.clients,
        ref: sendpoll.poll.ref,
        date: sendpoll.createdAt.split('T')[0],
        answers: sendpoll.answers,
        id: sendpoll.id,
        file: sendpoll.file.name,
        name: sendpoll.poll.name,
        group: sendpoll.poll.group.description
      }));
      this.setState({ polls})
      // for (let i = 0; i < polls.length; i++) { // recuperar las respuestas por cada encuesta enviada y preentar un resumen listo para descargar
      //   this.props.getPollAnswers(polls[i].ref).then(answers => {
      //     let data = {
      //       ref: polls[0].ref,
      //       answers: answers.items
      //     };
      //     //console.log('Data: ', data);
      //     axios.post('/api/polls/sendpolls', data).then(() => this.props.getSendPolls());
      //   })
        
      // }
    });
  };

  render() {
    const { classes, loggedUser } = this.props;
    //console.log('Answers : ', this.state.answers);
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
                <CustomTableCell>Ref</CustomTableCell>
                  <CustomTableCell>Formulario</CustomTableCell>
                  <CustomTableCell>Grupo</CustomTableCell>
                  <CustomTableCell>Archivo</CustomTableCell>
                  <CustomTableCell>Enviado</CustomTableCell>
                  <CustomTableCell numeric>Clientes Enviados</CustomTableCell>
                  <CustomTableCell numeric>Contestados</CustomTableCell>
                  <CustomTableCell numeric>Por Contestar</CustomTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.polls.map(row => {
                  return (
                    <TableRow className={classes.row} key={row.id} onClick={this.showResume({ ref: row.ref, id: row.id })}>
                      <CustomTableCell component="th" scope="row">
                        {row.ref}
                      </CustomTableCell>
                      <CustomTableCell>{row.name}</CustomTableCell>
                      <CustomTableCell>{row.group}</CustomTableCell>
                      <CustomTableCell>{row.file}</CustomTableCell>
                      <CustomTableCell>{row.date}</CustomTableCell>
                      <CustomTableCell numeric>{row.clients}</CustomTableCell>
                      <CustomTableCell numeric>{row.answers}</CustomTableCell>
                      <CustomTableCell numeric>{row.clients - row.answers}</CustomTableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Grid item xs={12}>Respuestas Registradas</Grid>
            <Grid item xs={12}>Pregunta : {this.state.answers.length ? this.state.answers[0].pollsend.poll.question.title : "" }</Grid>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                <CustomTableCell>Id</CustomTableCell>
                  <CustomTableCell>Tipo</CustomTableCell>
                  <CustomTableCell>Valor</CustomTableCell>
                  <CustomTableCell>Cliente</CustomTableCell>
                  <CustomTableCell>Fecha</CustomTableCell>
                  {/* <CustomTableCell numeric>Clientes Enviados</CustomTableCell>
                  <CustomTableCell numeric>Contestados</CustomTableCell>
                  <CustomTableCell numeric>Por Contestar</CustomTableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.answers.map(row => {
                  return (
                    <TableRow className={classes.row} key={row.id}>
                      <CustomTableCell component="th" scope="row">
                        {row.id}
                      </CustomTableCell>
                      <CustomTableCell>{row.type}</CustomTableCell>
                      <CustomTableCell>{row.value}</CustomTableCell>
                      <CustomTableCell>{row.client.name}</CustomTableCell>
                      <CustomTableCell>{row.createdAt.split('T')[0]}</CustomTableCell>
                      {/* <CustomTableCell numeric>{row.clients}</CustomTableCell>
                      <CustomTableCell numeric>{row.answers}</CustomTableCell>
                      <CustomTableCell numeric>{row.clients - row.answers}</CustomTableCell> */}
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
  loggedUser: state.userReducer,
  sendPolls: state.typeFormReducer.sendPolls
});

const mapDispatchToProps = dispatch => ({
  getPollAnswers: ref => dispatch(getPollAnswers(ref)),
  getSendPolls: () => dispatch(getSendPolls())
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(PollsResume));
