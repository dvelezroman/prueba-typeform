import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const sortArray = array => array.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));

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
  row: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.background.default
    }
  },
  table: {
    minWidth: 700
  }
});

class ShowOrders extends Component {
  render() {
    const { classes, orders, loggedUser } = this.props;
    let orders_sorted = sortArray(orders);
    //console.log('Orders: ', orders);
    return (
      !loggedUser.logged ? (
        <div className={classes.root}>
          <h1>Necesitas loggearte para ver esta informacion</h1>
      </div> ) : (
      <Grid container>
        <Grid item xs={12}>
          <Paper className={classes.root}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <CustomTableCell>Registros: {orders.length}</CustomTableCell>
                </TableRow>
                <TableRow>
                  <CustomTableCell>Orden</CustomTableCell>
                  <CustomTableCell>HCU</CustomTableCell>
                  <CustomTableCell>Cliente</CustomTableCell>
                  <CustomTableCell>email</CustomTableCell>
                  <CustomTableCell>Médico</CustomTableCell>
                  <CustomTableCell>Grupo</CustomTableCell>
                  <CustomTableCell>Sucursal</CustomTableCell>
                  <CustomTableCell>Fecha atención</CustomTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders_sorted.map(order => {
                  return (
                    <TableRow className={classes.row} key={order.id}>
                      <CustomTableCell numeric component="th" scope="row">
                        {order.ref}
                      </CustomTableCell>
                      <CustomTableCell numeric>{order.hcu}</CustomTableCell>
                      <CustomTableCell>{order.name}</CustomTableCell>
                      <CustomTableCell>{order.email}</CustomTableCell>
                      <CustomTableCell>{order.doctor}</CustomTableCell>
                      <CustomTableCell>{order.group}</CustomTableCell>
                      <CustomTableCell>{order.office}</CustomTableCell>
                      <CustomTableCell>{order.attended}</CustomTableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>)
    );
  }
}

ShowOrders.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  loggedUser: state.userReducer,
  //orders: [...state.uploadReducer.orders],
  loading: state.uploadReducer.loading
});

export default connect(mapStateToProps)(withStyles(styles)(ShowOrders));
