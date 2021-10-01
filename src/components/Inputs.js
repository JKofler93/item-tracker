import React from 'react'

function Inputs({ setFilter }) {
  return (
    <div>
      <input className="provider-search-bar" style={{"marginTop": "20px"}} placeHolder="Search by Provider" onChange={(e) => setFilter(e.target.value)}></input>
      <input className="provider-search-bar" style={{"marginTop": "20px"}} placeHolder="Search by Serial Number" onChange={(e) => setFilter(e.target.value)}></input>
    </div>
  )
}

export default Inputs
