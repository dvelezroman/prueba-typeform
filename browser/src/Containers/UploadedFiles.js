import React, { Component } from 'react';
import axios from 'axios';
import classNames from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ShowOrders from '../Components/ShowOrders';
import LinearIndeterminated from '../Components/LinearIndeterminated';
import _ from 'lodash';

const ranges = [
	{
		value: 1,
		label: 1
	},
	{
		value: 2,
		label: 2
	},
	{
		value: 3,
		label: 3
	},
	{
		value: 4,
		label: 4
	},
	{
		value: 5,
		label: 5
	},
	{
		value: 6,
		label: 6
	},
	{
		value: 7,
		label: 7
	}
];

const styles = theme => ({
	root: {
		flex: 1,
		backgroundColor: theme.palette.background.paper
	},
	button: {
		margin: theme.spacing.unit
	},
	extendedIcon: {
		marginRight: theme.spacing.unit
	},
	textField: {
		width: '100%',
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit
	},
	list: {
		height: 300,
		overflow: 'auto'
	},
	paper: {
		padding: 16,
		textAlign: 'center',
		color: theme.palette.text.secondary
	},
	list: {
		overflow: 'auto',
		maxHeight: 500
	},
	orders: {
		width: '100%',
		backgroundColor: theme.palette.background.paper,
		position: 'relative',
		overflow: 'auto',
		maxHeight: 500
	}
});

class UploadedFiles extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedFile: {},
			files: [],
			orders: [],
			questions: [],
			polls: [],
			selectedQuestions: [],
			sending: false,
			loading: true,
			days: 2,
			pollDescription: ''
		};
		this.handleListItemClick = this.handleListItemClick.bind(this);
	}

	handleListItemClick = async (event, file) => {
		this.setState({ orders: [] });
		axios
			.get(`/api/files/${file.id}/orders`)
			.then(res => res.data)
			.then(data => {
				//console.log('Orders : ',data);
				if (!data.error) {
					//console.log("Ya los traje: ", data.data);
					this.setState({
						selectedFile: file,
						orders: data.data
					});
				} else {
					this.setState({ selectedFile: file });
					alert('Este archivo no tiene registros o esta corrupto');
				}
			});
		// let { data } = await axios.get(`/api/files/${file.id}/orders`).then(res => {
		//   this.setState({ loading: false });
		//   return res.data;
		// });
	};

	handleChange = prop => event => {
		this.setState({ [prop]: event.target.value });
	};

	handlePollCheck = value => () => {
		const { selectedQuestions } = this.state;
		const currentIndex = selectedQuestions.indexOf(value);
		const newChecked = [...selectedQuestions];

		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}

		this.setState({
			selectedQuestions: newChecked
		});
	};

	sendEmails = async () => {
		let file = this.state.selectedFile;
		const pollDescription = this.state.pollDescription;
		//let polls = this.state.selectedQuestions;
		let polls = this.state.questions; // pongo todo no doy para que seleccionen nada
		let orders = this.state.orders;
		//console.log('Polls selected: ', polls);
		if (!file.ref) alert('Debes seleccionar un archivo cargado!');
		else if (!polls.length) alert('Debes Seleccionar una Encuesta al menos!');
		else {
			let server = await axios.get('/api/mailserver/selected').then(res => res.data.data);
			//console.log("Server: ", server);
			if (!server.id) {
				this.setState({
					selectedFile: {},
					orders: [],
					selectedQuestions: []
				});
				alert('No ha configurado ningún servidor de correos');
			} else {
				this.setState({ sending: true });
				let grouped_orders = _.groupBy(orders, order => order.groupId);
				//console.log("Orders grouped by Group: ", grouped_orders);
				let grouped_polls = _.groupBy(polls, poll => poll.groupId);
				let n_polls_by_group = _.countBy(polls, poll => poll.groupId);
				//console.log("Polls by group : ", n_polls_by_group);
				let polls_paired_with_clients = [];
				_.forEach(n_polls_by_group, function(value, key) {
					if (n_polls_by_group[key] < 2) {
						let data = {
							groupId: key,
							clients: grouped_orders[key],
							poll: grouped_polls[key][0]
						};
						//console.log("Data cuando solo es un cliente : ", data);
						polls_paired_with_clients.push(data);
					} else {
						if (grouped_orders[key]) {
							let chunks = Math.ceil(grouped_orders[key].length / value);
							for (let i = 0; i < value; i++) {
								if (_.chunk(grouped_orders[key], chunks)[i]) {
									polls_paired_with_clients.push({
										groupId: key,
										clients: _.chunk(grouped_orders[key], chunks)[i],
										poll: grouped_polls[key][i]
									});
								}
							}
						}
					}
				});
				//console.log("Grouped orders : ", grouped_orders);
				//console.log("Polls by group: ", n_polls_by_group);
				//console.log("Polls paired : ", polls_paired_with_clients);
				// primero vemos cuantas encuestas hay seleccionadas del mismo grupo
				// por cada formulario seleccionado, enviarle ese formulario a los clientes de la misma categoría del formulario
				let promises_to_send_emails = [];
				polls_paired_with_clients.forEach(item => {
					if (item.clients) {
						let ref = item.poll.ref;
						let group = item.groupId;
						let clients = item.clients;
						let url = item.poll.url;
						let subject = item.poll.subject;
						let greet = item.poll.greet;
						let fileId = file.id;
						let scale = item.poll.scale;
						let shape = item.poll.shape;
						let title = item.poll.title;
						let type = item.poll.type;
						let description = item.poll.description;
						let choices = item.poll.choices;
						let allow_multiple_selection = item.poll.allow_multiple_selection;
						let body = {
							ref,
							group,
							clients,
							subject,
							greet,
							url,
							scale,
							shape,
							title,
							type,
							description,
							choices,
							allow_multiple_selection,
							fileId
						};
						//console.log("envio a /api/polls/send", body);
						let days = this.state.days;
						promises_to_send_emails.push(
							axios.post('/api/polls/send', { array: body, server, days, pollDescription })
						);
					}
				});
				Promise.all(promises_to_send_emails).then(res => {
					//console.log("Se enviaron las encuestas");
					// enviar a guardar a la base de datos las encuestas enviadas
					//console.log('res : ', res);
					let send_forms = res.length;
					for (let i = 0; i < res.length; i++) {
						if (!res[i].data.error) send_forms--;
					}
					if (send_forms) alert('Algunas encuestas no se enviaron');
					else {
						this.setState({
							selectedFile: {},
							orders: [],
							selectedQuestions: []
						});
						if (res.length > 1) {
							this.setState({ sending: false }, () =>
								alert('Las encuestas se enviaron exitosamente')
							);
						} else {
							this.setState({ sending: false }, () => alert('La encuesta se envió exitosamente'));
						}
					}
				});
			}
		}
	};

	fetchPolls = () => axios.get('/api/polls').then(res => res.data);

	fetchFiles = () => axios.get('/api/files').then(res => res.data);

	fetchQuestions = () => axios.get('/api/questions').then(res => res.data);

	async componentDidMount() {
		//let polls = await this.fetchPolls().then(data => data);
		let questions = await this.fetchQuestions().then(data => data);
		let raw_files = await this.fetchFiles().then(data => data.data);
		let files = raw_files.map(item => ({
			id: item.id,
			ref: item.ref,
			name: item.name,
			uploaded: `${item.createdAt.split('T')[0]} - ${item.createdAt.split('T')[1].split('.')[0]} `
		}));
		questions = questions.filter(question => question.enabled);
		this.setState({ files: files, questions: questions, loading: false });
	}

	render() {
		const { classes, loggedUser } = this.props;
		return !loggedUser.logged ? (
			<div className={classes.root}>
				<h1>Necesitas loggearte para ver esta informacion</h1>
			</div>
		) : this.state.sending ? (
			<Grid container>
				<Grid item xs={2} />
				<Grid item xs={8}>
					<LinearIndeterminated
						msg={'Enviando los correos, por favor espere mientras se completa el envío...'}
					/>
				</Grid>
				<Grid item xs={2} />
			</Grid>
		) : this.state.loading ? (
			<Grid container>
				<Grid item xs={2} />
				<Grid item xs={8}>
					<LinearIndeterminated msg={'Cargando los archivos ....'} />
				</Grid>
				<Grid item xs={2} />
			</Grid>
		) : (
			<Grid container className={classes.root}>
				<Grid item xs={6}>
					<Grid item xs={12}>
						Lista de archivos que han sido cargados
					</Grid>
					<Grid item xs={12} className={classes.list}>
						{this.state.files.map(item => (
							<List key={item.id} component='nav'>
								<ListItem
									button
									selected={this.state.selectedFile.id === item.id}
									onClick={event => this.handleListItemClick(event, item)}
								>
									<ListItemText
										primary={`Archivo : ${item.name}`}
										secondary={`Fecha de carga: ${item.uploaded}`}
									/>
								</ListItem>
							</List>
						))}
					</Grid>
				</Grid>
				<Grid item xs={6} style={{ paddingLeft: 10, paddingRight: 10 }}>
					<Grid item xs={12}>
						Seleccione numero de días de validez que tendrá la encuesta
					</Grid>
					<Grid style={{ width: 200 }}>
						<TextField
							select
							label='Seleccione'
							className={classNames(classes.margin, classes.textField)}
							value={this.state.days}
							onChange={this.handleChange('days')}
							InputProps={{
								startAdornment: <InputAdornment position='start'>Días</InputAdornment>
							}}
						>
							{ranges.map(option => (
								<MenuItem key={option.value} value={option.value}>
									{option.label}
								</MenuItem>
							))}
						</TextField>
					</Grid>
					<Grid item xs={12} style={{ marginTop: 20 }}>
						<Paper className={classes.paper}>
							Ingresa un comentario / observación para la encuesta que vas a enviar
						</Paper>
					</Grid>
					<Grid item xs={12}>
						<Paper className={classes.paper}>
							<TextField
								width={10}
								multiline
								rowsMax='5'
								onChange={this.handleChange('pollDescription')}
								id='description'
								value={this.state.pollDescription}
								placeholder='Escribe alguna observación...'
								helperText='Opcional'
								className={classes.textField}
								margin='normal'
								variant='outlined'
							/>
						</Paper>
					</Grid>
				</Grid>
				<Grid item xs={12}>
					{this.state.selectedFile.name ? (
						<Grid item xs={12} className={classes.orders}>
							<ShowOrders
								send={true}
								orders={this.state.orders}
								items={this.state.orders}
								sendEmails={this.sendEmails}
							/>
						</Grid>
					) : (
						`Selecciona un archivo para ver las ordenes contenidas`
					)}
				</Grid>
			</Grid>
		);
	}
}

UploadedFiles.propTypes = {
	classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	loggedUser: state.userReducer
});

export default connect(mapStateToProps)(withStyles(styles)(UploadedFiles));
