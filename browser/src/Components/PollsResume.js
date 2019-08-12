import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { forEach } from "lodash";
import CsvDownloader from "react-csv-downloader";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TextField from "@material-ui/core/TextField";
import TableHead from "@material-ui/core/TableHead";
import Typography from "@material-ui/core/Typography";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import SaveIcon from "@material-ui/icons/Save";
import { getPollAnswers, getSendPolls } from "../actions/typeForm";

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
		margin: theme.spacing.unit
	},
	leftIcon: {
		marginRight: theme.spacing.unit
	},
	rightIcon: {
		marginLeft: theme.spacing.unit
	},
	iconSmall: {
		fontSize: 20
	}
});

const sendedPollsColumns = [
	{
		id: "pollSendId",
		displayName: "Id Encuesta Enviada"
	},
	{
		id: "pollSendRef",
		displayName: "Codigo Referencia"
	},
	{
		id: "sendtime",
		displayName: "Fecha envio"
	},
	{
		id: "number_of_clients",
		displayName: "Clientes encuestados"
	},
	{
		id: "number_answers",
		displayName: "Respuestas recibidas"
	},
	{
		id: "group",
		displayName: "Grupo"
	},
	{
		id: "pollId",
		displayName: "Id Encuesta"
	},
	{
		id: "description",
		displayName: "Descripcion"
	},
	{
		id: "name",
		displayName: "Nombre de la Encuesta"
	},
	{
		id: "subject",
		displayName: "Titulo del correo enviado"
	},
	{
		id: "question",
		displayName: "Contenido de la pregunta"
	},
	{
		id: "type",
		displayName: "Tipo de Pregunta"
	},
	{
		id: "scale",
		displayName: "Escala"
	}
];

const columns = [
	{
		id: "ref_poll",
		displayName: "Referencia de Encuesta Enviada"
	},
	{
		id: "ref",
		displayName: "Orden"
	},
	{
		id: "office",
		displayName: "Sucursal"
	},
	{
		id: "hcu",
		displayName: "HCU de cliente"
	},
	{
		id: "cliente",
		displayName: "Nombre Cliente"
	},
	{
		id: "email",
		displayName: "Email de Cliente"
	},
	{
		id: "attended",
		displayName: "Fecha de Atención (mm/dd/aaaa)"
	},
	{
		id: "fecha_envio",
		displayName: "Fecha de Envío"
	},
	{
		id: "pregunta",
		displayName: "Titulo de la Pregunta"
	},
	{
		id: "tipo",
		displayName: "Tipo de Pregunta"
	},
	{
		id: "aclaratoria",
		displayName: "Aclaratoria de la Pregunta"
	},
	{
		id: "ref_preg",
		displayName: "Referencia de la Pregunta"
	},
	{
		id: "escala",
		displayName: "Escala"
	},
	{
		id: "fecha_respuesta",
		displayName: "Fecha de la Respuesta"
	},
	{
		id: "valor",
		displayName: "Valor de la Respuesta"
	}
];

const formatDate = date => {
	// let currentDate = new Date()
	let day = date.getDate();
	let month = date.getMonth() + 1;
	let year = date.getFullYear();
	if (day < 10) {
		day = "0" + day;
	}

	if (month < 10) {
		month = "0" + month;
	}
	return year + "-" + month + "-" + day;
};

class PollsResume extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selected: "",
			polls: [],
			answers: [],
			csv: [],
			sendedPollsResume: [],
			from: "",
			to: ""
		};
		this.showResume = this.showResume.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange = label => e => {
		if (label === "to" && this.state.from) {
			const from = this.state.from;
			const to = e.target.value;
			axios
				.get(`/api/polls/sendpolls/from/${from}/to/${to}`)
				.then(res => res.data)
				.then(sendpolls => {
					let polls = sendpolls.map(sendpoll => ({
						clients: sendpoll.clients,
						ref: sendpoll.ref,
						categories: sendpoll.poll.question.categories,
						question_ref: sendpoll.poll.question.question_ref,
						date: sendpoll.createdAt.split("T")[0],
						answers: sendpoll.answers,
						id: sendpoll.id,
						file: sendpoll.file.name, // cuando aqui falla algo revisar la tabla los fileId
						name: sendpoll.poll.name,
						group: sendpoll.poll.group.description
					}));
					//let grouped_polls1 = _.groupBy(polls, poll => poll.question_ref);
					let grouped_polls2 = {};
					for (let i = 0; i < polls.length; i++) {
						let poll = polls[i].question_ref;
						if (grouped_polls2[poll]) {
							grouped_polls2[poll].clients += polls[i].clients;
						} else {
							grouped_polls2[poll] = {
								...polls[i],
								clients: polls[i].clients
							};
						}
					}
					let grouped_polls3 = [];
					forEach(grouped_polls2, (value, key) => {
						grouped_polls3.push(value);
					});
					//console.log("Grouped Polls : ", grouped_polls3);
					this.setState({ polls: grouped_polls3, to });
				});
		} else {
			this.setState({ [label]: e.target.value });
		}
	};

	async addAttendedDateToAnswers(answers) {
		const answersWithAttendedDate = await Promise.all(
			answers.map(async answer => {
				const { data } = await axios.get(
					`/api/polls/answers/sended/${answer.pollsend.id}`
				);
				data.result.orders.map(order => {
					if (order.clientId === answer.client.id) {
						answer.attended = order.attended;
					}
				});
				const parsedAnswer = {
					ref_poll: this.state.selected,
					ref: answer.ref,
					office: answer.office,
					hcu: answer.client.hcu,
					cliente: answer.client.name,
					email: answer.client.email,
					attended: answer.attended,
					fecha_envio: answer.pollsend.createdAt.split("T")[0],
					pregunta: answer.pollsend.poll.question.title,
					tipo:
						answer.pollsend.poll.question.type === "opinion_scale"
							? "escala"
							: answer.pollsend.poll.question.type === "yes_no"
							? "si-no"
							: "seleccion",
					aclaratoria: answer.pollsend.poll.question.description,
					ref_preg: answer.pollsend.poll.question.ref,
					escala:
						answer.pollsend.poll.question.type === "opinion_scale"
							? answer.pollsend.poll.question.scale
							: "no_aplica",
					fecha_respuesta: answer.createdAt.split("T")[0],
					valor: answer.value
				};
				return parsedAnswer;
			})
		);
		return answersWithAttendedDate;
	}

	async exportAnswers2Csv() {
		const { answers } = this.state;
		const csv = await this.addAttendedDateToAnswers(answers);
		console.log({ csv });
		this.setState({ csv });
	}

	showResume = pollsend => e => {
		//console.log('Ref: ', pollsendId);
		axios.get(`/api/polls/answers/${pollsend.ref}`).then(res => {
			//console.log("Polls answers: ", res.data);
			this.setState({ selected: pollsend.ref, answers: res.data }, () =>
				this.exportAnswers2Csv()
			);
		});
	};

	async componentDidMount() {
		const {
			data: {
				result: { results }
			}
		} = await axios.get("/api/polls/answers/sended");
		const from = formatDate(new Date());
		const to = formatDate(new Date());
		this.setState({ from, to, sendedPollsResume: results });
	}

	render() {
		const { classes, loggedUser } = this.props;
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
					<TextField
						id="from"
						label="Desde"
						type="date"
						value={this.state.from}
						onChange={this.handleChange("from")}
						className={classes.textField}
						InputLabelProps={{
							shrink: true
						}}
					/>
					<TextField
						id="to"
						label="Hasta"
						type="date"
						value={this.state.to}
						onChange={this.handleChange("to")}
						className={classes.textField}
						InputLabelProps={{
							shrink: true
						}}
					/>
				</Grid>
				<Grid item xs={12}>
					<Paper className={classes.root}>
						<Table className={classes.table}>
							<TableHead>
								<TableRow>
									<CustomTableCell>Ref. Pregunta</CustomTableCell>
									<CustomTableCell>Formulario</CustomTableCell>
									<CustomTableCell>Grupo</CustomTableCell>
									<CustomTableCell>Archivo</CustomTableCell>
									<CustomTableCell>Enviado</CustomTableCell>
									<CustomTableCell numeric>Clientes Enviados</CustomTableCell>
									<CustomTableCell>Categorías</CustomTableCell>
									{/* <CustomTableCell numeric>Por Contestar</CustomTableCell> */}
								</TableRow>
							</TableHead>
							<TableBody>
								{this.state.polls.map(row => {
									return (
										<TableRow
											className={classes.row}
											key={row.id}
											onClick={this.showResume({
												ref: row.question_ref,
												id: row.id
											})}
										>
											<CustomTableCell component="th" scope="row">
												{row.question_ref}
											</CustomTableCell>
											<CustomTableCell>{row.name}</CustomTableCell>
											<CustomTableCell>{row.group}</CustomTableCell>
											<CustomTableCell>{row.file}</CustomTableCell>
											<CustomTableCell>{row.date}</CustomTableCell>
											<CustomTableCell numeric>{row.clients}</CustomTableCell>
											<CustomTableCell>{row.categories}</CustomTableCell>
											{/* <CustomTableCell numeric>{row.clients - row.answers}</CustomTableCell> */}
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
							<Grid item xs={4}>
								<CsvDownloader
									filename={`reporte-encuestas-respuestas`}
									columns={sendedPollsColumns}
									datas={this.state.sendedPollsResume}
								>
									<Button
										//disabled={this.state.answers.length ? false : true}
										variant="contained"
										size="small"
										className={classes.button}
									>
										<SaveIcon
											className={classNames(
												classes.leftIcon,
												classes.iconSmall
											)}
										/>
										Descargar Resumen Encuestas Enviadas
									</Button>
								</CsvDownloader>
							</Grid>
							<Grid item xs={4}>
								<Typography variant="subtitle1" gutterBottom>
									Respuestas Registradas
								</Typography>
							</Grid>
							<Grid item xs={4}>
								<CsvDownloader
									filename={`reporte-${this.state.selected}`}
									columns={columns}
									datas={this.state.csv}
								>
									<Button
										disabled={this.state.answers.length ? false : true}
										variant="contained"
										size="small"
										className={classes.button}
									>
										<SaveIcon
											className={classNames(
												classes.leftIcon,
												classes.iconSmall
											)}
										/>
										Descargar Respuestas
									</Button>
								</CsvDownloader>
							</Grid>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="subtitle2" gutterBottom>
								Pregunta :{" "}
								{this.state.answers.length
									? this.state.answers[0].pollsend.poll.question.title
									: ""}
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
									<CustomTableCell>Orden</CustomTableCell>
									<CustomTableCell>Sucursal</CustomTableCell>
									<CustomTableCell>Respuesta</CustomTableCell>
									<CustomTableCell>Cliente</CustomTableCell>
									<CustomTableCell>Fecha Respuesta</CustomTableCell>
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
											<CustomTableCell>{row.ref || ""}</CustomTableCell>
											<CustomTableCell>{row.office || ""}</CustomTableCell>
											<CustomTableCell>{row.value}</CustomTableCell>
											<CustomTableCell>{row.client.name}</CustomTableCell>
											<CustomTableCell>
												{row.createdAt.split("T")[0]}
											</CustomTableCell>
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

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withStyles(styles)(PollsResume));
