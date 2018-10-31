import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflow: "auto",
    maxHeight: 300
  },
  table: {
    minWidth: 700
  }
});

class ShowOrders extends Component {
  render() {
    const { classes, orders } = this.props;
    //console.log('Orders: ', orders);
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Registros: {orders.length}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Orden</TableCell>
              <TableCell>HCU</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>email</TableCell>
              <TableCell>Médico</TableCell>
              <TableCell>Grupo</TableCell>
              <TableCell>Sucursal</TableCell>
              <TableCell>Fecha atención</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map(order => {
              return (
                <TableRow key={order.id}>
                  <TableCell component="th" scope="row">
                    {order.ref}
                  </TableCell>
                  <TableCell>{order.client.hcu}</TableCell>
                  <TableCell>{order.client.name}</TableCell>
                  <TableCell>{order.client.email}</TableCell>
                  <TableCell>{order.doctor.name}</TableCell>
                  <TableCell>{order.group.description}</TableCell>
                  <TableCell>{order.office.description}</TableCell>
                  <TableCell>{order.attended}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

ShowOrders.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  orders: [...state.uploadReducer.orders],
  loading: state.uploadReducer.loading
});

export default connect(mapStateToProps)(withStyles(styles)(ShowOrders));
