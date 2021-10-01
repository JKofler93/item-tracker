import React, { useEffect, useState } from 'react';
import Info from '../components/Info';
import Inputs from '../components/Inputs';
import Buttons from '../components/Buttons';
import ItemTable from '../components/ItemTable'

import { useDispatch } from "react-redux"
import { loadItems, assignItem, unassignItem, completeItem } from '../redux/actions';

function Items() {
  const [filter, setFilter] = useState("");

  let dispatch = useDispatch()

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
        return null
    }
  }

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
          <Buttons filter={filter} setFilter={setFilter}/>
          <Info/>
          <Inputs setFilter={setFilter}/>
      </div>
      <div>
        <ItemTable filter={filter} filterItems={filterItems} decideButtons={decideButtons}/>
      </div>
    </>
  )
}

export default Items