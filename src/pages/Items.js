import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Info from '../components/Info';

import { useSelector, useDispatch } from "react-redux"
import { loadItems, assignItem, unassignItem, completeItem } from '../redux/actions';

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

// { items, assignItem, unassignItem,  completeItem, fetchItems }
function Items() {
  const [filter, setFilter] = useState("");
  const [clicked, setClicked] = useState(false)


  // let history = useHistory()

  let dispatch = useDispatch()
  const { items } = useSelector(state => state.data)

  const classes = useStyles();

  useEffect(() => {
    dispatch(loadItems())
    setFilter("all")
  }, [])

  const handleItemAssign = (id, assignee) => {
    if(window.confirm(`Are you sure you want to set the status of ID: ${id} to assigned?`)) { 
      dispatch(assignItem(id, assignee))
    }
  }

  const handleItemUnassign = (id) => {
    if(window.confirm(`Are you sure you want to set the status of ID: ${id} to unassigned?`)) { 
      dispatch(unassignItem(id))
    }
  }

  const handleItemComplete = (id, assignee) => {
    if(window.confirm(`Are you sure you want to set the status of ID: ${id} to completed?`)) {
      dispatch(completeItem(id, assignee))
    }
  }

  const filterItems = (items) => {
    switch (filter) {

      case "all":
        return items

      case "assigned":
        return items.filter(item => item.status === "assigned")

      case "unassigned":
        return items.filter(item => item.status === "unassigned")

      case "completed":
        return items.filter(item => item.status === "completed")

      case filter:
        return items.filter(item => item.provider.toLowerCase().includes(filter.toLowerCase()) || item.serial.includes(filter))

      default:
        return items
    }
  }

  // console.log(search)

  const decideButtons = (id, status) => {
    switch (status) {
      case "assigned":
        return (<> <button className="unassign-button" style={{marginRight: "10px"}} onClick={() => handleItemUnassign(id)}>Unassign</button> <button className="complete-button" onClick={() => handleItemComplete(id, "Sarah T")}>Complete</button> </> )

      case "unassigned":
        return (<> <button className="assign-button" onClick={() => handleItemAssign(id, "Sarah T")}>Assign To me</button> </>)

      case "completed":
        return (<> <button className="unassign-button" onClick={() => handleItemUnassign(id)}>Unassign</button> </>)

        default:
    }
  }

  return (
    <>
      <div className="reset">
        {filter === "all" ? <button className="reset-button" style={{"backgroundColor": "blue", "marginRight": "20px"}} onClick={() => setFilter("all")}>All</button> : <button className="reset-button" style={{"marginRight": "20px"}} onClick={() => setFilter("all")}>All</button>}
        {filter === "assigned" ? <button className="reset-button" style={{"backgroundColor": "blue", "marginRight": "20px"}} onClick={() => setFilter("assigned")}>Assigned</button> : <button className="reset-button" style={{"marginRight": "20px"}} onClick={() => setFilter("assigned")}>Assigned</button>}
        {filter === "unassigned" ? <button className="reset-button" style={{"backgroundColor": "blue", "marginRight": "20px"}} onClick={() => setFilter("unassigned")}>Unassigned</button> : <button className="reset-button" style={{"marginRight": "20px"}} onClick={() => setFilter("unassigned")}>Unassigned</button>}
        {filter === "completed" ? <button className="reset-button" style={{"backgroundColor": "blue", "marginRight": "20px"}} onClick={() => setFilter("completed")}>Completed</button> : <button className="reset-button" style={{"marginRight": "20px"}} onClick={() => setFilter("completed")}>Completed</button>}
          <Info/>
          <input className="provider-search-bar" style={{"marginTop": "20px"}} placeHolder="Search by Provider" onChange={(e) => setFilter(e.target.value)}></input>
          <input className="provider-search-bar" style={{"marginTop": "20px"}} placeHolder="Search by Serial Number" onChange={(e) => setFilter(e.target.value)}></input>
      </div>

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
    </>
  )
}

export default Items