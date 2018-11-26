import React, { Component } from "react";
import { connect } from "react-redux";
import axios from 'axios';
import CsvDownloader from 'react-csv-downloader';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import Typography from '@material-ui/core/Typography';
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import SaveIcon from '@material-ui/icons/Save';
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
  },
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
});

const columns = [{
  id: 'ref_poll',
  displayName: 'Referencia de Encuesta Enviada'
}, {
  id: 'hcu',
  displayName: 'HCU de cliente',
},
{
  id: 'cliente',
  displayName: 'Nombre Cliente',
},
{
  id: 'email',
  displayName: 'Email de Cliente',
},
{
  id: 'fecha_envio',
  displayName: 'Fecha de Envío',
},
{
  id: 'pregunta',
  displayName: 'Titulo de la Pregunta',
},
{
  id: 'tipo',
  displayName: 'Tipo de Pregunta',
},
{
  id: 'aclaratoria',
  displayName: 'Aclaratoria de la Pregunta',
},
{
  id: 'ref_preg',
  displayName: 'Referencia de la Pregunta',
},
{
  id: 'escala',
  displayName: 'Escala',
},
{
  id: 'fecha_respuesta',
  displayName: 'Fecha de la Respuesta',
},
{
  id: 'valor',
  displayName: 'Valor de la Respuesta',
}];

class PollsResume extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: "",
      polls: [],
      answers: [],
      csv: [],
    };
    this.showResume = this.showResume.bind(this);
  };

  exportAnswers2Csv() {
    let answers = this.state.answers;
    let data = answers.map(answer => (
      {
        ref_poll: this.state.selected,
        hcu: answer.client.hcu,
        cliente: answer.client.name,
        email: answer.client.email,
        fecha_envio: answer.pollsend.createdAt.split('T')[0],
        pregunta: answer.pollsend.poll.question.title,
        tipo: answer.pollsend.poll.question.type === 'opinion_scale' ? 'escala' : answer.pollsend.poll.question.type === 'yes_no' ? 'si-no' : 'seleccion',
        aclaratoria: answer.pollsend.poll.question.description,
        ref_preg: answer.pollsend.poll.question.ref,
        escala: answer.pollsend.poll.question.type === 'opinion_scale' ? answer.pollsend.poll.question.scale : "no_aplica",
        fecha_respuesta: answer.createdAt.split('T')[0],
        valor: answer.value
      }
    ))
    this.setState({ csv: data });
  };

  showResume = pollsend => e => {
    //console.log('Ref: ', pollsendId);
    axios.get(`/api/polls/answers/${pollsend.id}`)
    .then(res => {
      this.setState({ selected: pollsend.ref, answers: res.data }, () => this.exportAnswers2Csv())
    });
  };

  componentDidMount() {
    // traer las refs de las encuestas que han sido enviadas y armar un array de refs []
    axios.get('/api/polls/sendpolls').then(res => res.data).then(sendpolls => {
      //console.log('SendPolls: ', sendpolls);
      let polls = sendpolls.map(sendpoll => ({
        clients: sendpoll.clients,
        ref: sendpoll.ref,
        date: sendpoll.createdAt.split('T')[0],
        answers: sendpoll.answers,
        id: sendpoll.id,
        file: sendpoll.file.name,
        name: sendpoll.poll.name,
        group: sendpoll.poll.group.description
      }));
      this.setState({ polls })
      //console.log('Polls: ', polls);
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
    //console.log('CSV : ', this.state.csv);
    return !loggedUser.logged ? (
      <div className={classes.root}>
        <Typography variant="h6" gutterBottom>
              Necesitas loggearte para ver esta información
        </Typography>
      </div>
    ) : (
      <Grid container>
        <Grid item xs={12}>
          <Paper>
            <Typography variant="h6" gutterBottom>
              Cuadro de Estado de las Encuestas que han sido enviadas
            </Typography>
          </Paper>
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
                  {/* <CustomTableCell numeric>Contestados</CustomTableCell>
                  <CustomTableCell numeric>Por Contestar</CustomTableCell> */}
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
                      {/* <CustomTableCell numeric>{row.answers}</CustomTableCell>
                      <CustomTableCell numeric>{row.clients - row.answers}</CustomTableCell> */}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Grid container>
              <Grid item xs={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Respuestas Registradas
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <CsvDownloader
                  filename={`reporte-${this.state.selected}`}
                  columns={columns}
                  datas={this.state.csv}
                >
                  <Button disabled={this.state.answers.length ? false : true} variant="contained" size="small" className={classes.button}>
                    <SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                    Descargar Respuestas
                  </Button>
                </CsvDownloader>
              
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Pregunta : {this.state.answers.length ? this.state.answers[0].pollsend.poll.question.title : "" }
              </Typography>
            </Grid>
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
