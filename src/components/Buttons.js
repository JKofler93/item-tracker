import React from 'react'

function Buttons({ filter, setFilter }) {
  return (
    <div>
        {filter === "all" ? <button className="reset-button" style={{"backgroundColor": "blue", "marginRight": "20px"}} onClick={() => setFilter("all")}>All</button> : <button className="reset-button" style={{"marginRight": "20px"}} onClick={() => setFilter("all")}>All</button>}
        {filter === "assigned" ? <button className="reset-button" style={{"backgroundColor": "blue", "marginRight": "20px"}} onClick={() => setFilter("assigned")}>Assigned</button> : <button className="reset-button" style={{"marginRight": "20px"}} onClick={() => setFilter("assigned")}>Assigned</button>}
        {filter === "unassigned" ? <button className="reset-button" style={{"backgroundColor": "blue", "marginRight": "20px"}} onClick={() => setFilter("unassigned")}>Unassigned</button> : <button className="reset-button" style={{"marginRight": "20px"}} onClick={() => setFilter("unassigned")}>Unassigned</button>}
        {filter === "completed" ? <button className="reset-button" style={{"backgroundColor": "blue", "marginRight": "20px"}} onClick={() => setFilter("completed")}>Completed</button> : <button className="reset-button" style={{"marginRight": "20px"}} onClick={() => setFilter("completed")}>Completed</button>}
    </div>
  )
}

export default Buttons
