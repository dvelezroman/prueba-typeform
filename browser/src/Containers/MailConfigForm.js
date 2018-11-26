import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from "@material-ui/core/Button";
import classNames from 'classnames';
import axios from "axios";
import { withStyles } from '@material-ui/core/styles';
import { Grid } from "@material-ui/core";
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

const service = [
    {
        value: "Gmail",
        label: "Gmail"
    },
    {
        value: "Hotmail",
        label: "Hotmail"
    },
    {
        value: "Yahoo",
        label: "Yahoo"
    },
    {
        value: "Otro",
        label: "Otro"
    }
];

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 300
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  title: {
    textAlign: "center",
    typography: {
      fontFamily: "Roboto"
    }
  },
  margin: {
    margin: theme.spacing.unit,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "80%"
  },
  dense: {
    marginTop: 8,
  },
  button: {
    backgroundColor: "#6eb4ea",
    color: "white",
    "&:hover": {
      color: "white"
    },
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  menu: {
    width: 200,
  },
});

class MailConfigForm extends Component {
  constructor(){
    super();
    this.state = {
      service: "Gmail",
      description: "",
      host: "",
      port: 0,
      secure: false,
      user: "",
      pass: "",
      selected: true,
      showPassword: false,
      servers: [],
      selectedFile: {}
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSelected = this.handleSelected.bind(this);
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  async handleSubmit(evt) {
    evt.preventDefault();
    const { service, description, host, port, secure, user, pass, selected } = this.state;
    const body = {
      service,
      description,
      host,
      port,
      secure,
      user,
      pass,
      selected
    };
    //console.log('Este es el body a enviar : ', body);
    let server = await axios.post("/api/mailserver", body).then(res => res.data);
    if (server.error) alert(server.msg);
    else {
      let servers = await axios.get("/api/mailserver").then(res => res.data);
      this.setState({ 
        service: "Gmail",
        description: "",
        host: "",
        port: "",
        secure: false,
        user: "",
        pass: "",
        selected: true,
        showPassword: false,
        servers: servers.data
      });
      alert(server.msg); 
    }
  };

  handleSelected = async (event, server) => {
    //console.log('Server: ', server);
    let selected
    if (server.selected) {
      selected = await axios.put(`/api/mailserver/unselect/${server.id}`).then(res => res.data);
    }else {
      selected = await axios.put(`/api/mailserver/select/${server.id}`).then(res => res.data);
    }
    //console.log('Selected: ', selected.data);
    if (!selected.error) {
      let servers = await axios.get("/api/mailserver").then(res => res.data); 
      if (!servers.error) this.setState({ server_selected: server.id, servers: servers.data });
    }
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  async componentDidMount() {
    let { data } = await axios.get("/api/mailserver").then(res => res.data);
    this.setState({ servers: data });
  };

  render() {
    const { classes, loggedUser } = this.props;
    //console.log('State : ', this.state)
    return !loggedUser.logged ? (
      <div className={classes.root}>
        <h1>Necesitas loggearte para ver esta informacion</h1>
      </div>
    ) : (
      <Grid container spacing={16} className={classes.container}>
        <Grid item xs={12}>
          <h1 className={classes.title}>Servidores de Correo</h1>
        </Grid>
        
        <Grid item xs={4}>
          <Grid item xs={12}>
            <h3>Añadir un servidor de correo</h3>
          </Grid>
          <Grid item xs={12}>
            <TextField
                id="select-sevice"
                select
                label="Servicio"
                className={classes.textField}
                value={this.state.service}
                onChange={this.handleChange('service')}
                SelectProps={{
                  MenuProps: {
                    className: classes.menu,
                  },
                }}
                helperText="Seleccione Servicio de Correo"
                margin="normal"
                variant="outlined"
              >
                {service.map((option, i) => (
                  <MenuItem key={i} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                id="description"
                label="Descripción"
                className={classes.textField}
                value={this.state.description}
                onChange={this.handleChange('description')}
                margin="normal"
                variant="outlined"
              />{this.state.service === "Otro" ?
                    <div>
                      <TextField
                      id="host"
                      label="Host"
                      className={classes.textField}
                      value={this.state.host}
                      onChange={this.handleChange('host')}
                      margin="normal"
                      variant="outlined"
                    />
                    <TextField
                      id="port"
                      label="Puerto"
                      value={this.state.port}
                      className={classes.textField}
                      onChange={this.handleChange('port')}
                      margin="normal"
                      variant="outlined"
                    />
                    </div> : <div></div>}
              <TextField
                id="user"
                label="Usuario"
                value={this.state.user}
                className={classes.textField}
                onChange={this.handleChange('user')}
                margin="normal"
                variant="outlined"
              />
              <TextField
                id="password"
                className={classNames(classes.margin, classes.textField)}
                variant="outlined"
                type={this.state.showPassword ? 'text' : 'password'}
                label="Password"
                value={this.state.password}
                onChange={this.handleChange('pass')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Ver contraseña"
                        onClick={this.handleClickShowPassword}
                      >
                        {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                size="medium"
                className={classes.button}
                onClick={this.handleSubmit}
              >
                Añadir
              </Button>
          </Grid>
        </Grid>
            
        <Grid item xs={8}>
          <Grid item xs={12}>
            <h3>Añadir un servidor de correo</h3>
            <div>Debe haber seleccionado uno</div>
          </Grid>
          <Grid item xs={12}>
            <List component="nav">
                {this.state.servers.map(item => (
                    
                  <ListItem
                    key={item.id} 
                    button
                    selected={item.selected}
                    onClick={event => this.handleSelected(event, item)}
                  >
                  <ListItemText 
                    primary={`Descripción : ${item.description} <> Servicio: ${item.service}`} 
                    secondary={`Host: ${item.host} <> Cuenta: ${item.user}`} />
                  </ListItem>
                ))}
            </List>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

MailConfigForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    loggedUser: state.userReducer
  });

export default connect(mapStateToProps)(withStyles(styles)(MailConfigForm));