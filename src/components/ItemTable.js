import React from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { useSelector, useDispatch, decideButtons } from "react-redux"

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);


const useStyles = makeStyles({
  table: {
    marginTop: 100,
    minWidth: 900,
  },
});

function ItemTable({ filter, filterItems, decideButtons }) {

  const { items } = useSelector(state => state.data)

  const classes = useStyles();

  return (
    <div>
              <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="customized table">
              <TableHead>
                      <TableRow>
                          <StyledTableCell id="table-head" align="center">ID</StyledTableCell>
                          <StyledTableCell id="table-head" align="center">Provider</StyledTableCell>
                          <StyledTableCell id="table-head" align="center">Model</StyledTableCell>
                          <StyledTableCell id="table-head" align="center">Serial Number</StyledTableCell>
                          <StyledTableCell id="table-head" align="center">Status</StyledTableCell>
                          {filter === "assigned" || filter === "all" ? <StyledTableCell id="table-head" align="center">Assigned At</StyledTableCell> : null}
                          {filter === "completed" || filter === "all" ? <StyledTableCell id="table-head" align="center">Completed At</StyledTableCell> : null}
                          {filter === "unassigned" || filter === "all" ? <StyledTableCell id="table-head" align="center">Created At</StyledTableCell> : null}
                          <StyledTableCell id="table-head" align="center">Actions</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {filterItems(items).map((item) =>  ( 
                        <StyledTableRow key={item.id}>
                          <StyledTableCell id="item-info" align="center">{item.id}</StyledTableCell>
                          <StyledTableCell id="item-info" align="center">{item.provider}</StyledTableCell>
                          <StyledTableCell id="item-info" align="center">{item.model}</StyledTableCell>
                          <StyledTableCell id="item-info" align="center">{item.serial}</StyledTableCell>
                          <StyledTableCell id={item.status === "assigned" || item.status === "unassigned" ? "active" : "completed"} align="center">{item.status}</StyledTableCell>
                          {filter === "assigned" || filter === "all" ?<StyledTableCell id="item-info" align="center">{item.assigned_at}</StyledTableCell> : null}
                          {filter === "completed" || filter === "all"? <StyledTableCell id="item-info" align="center">{item.completed_at}</StyledTableCell> : null}
                          {filter === "unassigned" || filter === "all" ? <StyledTableCell id="item-info" align="center">{item.created_at}</StyledTableCell> : null}
                          <StyledTableCell align="center">{decideButtons(item.id, item.status)}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                    </TableBody>
          </Table>
        </TableContainer>
    </div>
  )
}

export default ItemTable
