import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

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

function PollsResume(props) {
  const { classes, loggedUser } = props;

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

PollsResume.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  loggedUser: state.userReducer
});
export default connect(mapStateToProps)(withStyles(styles)(PollsResume));
