import axios from 'axios';
import * as types from './actionTypes';

const getItems = (items) => ({
  type: types.GET_ITEMS,
  payload: items,
});

const getItem = (item) => ({
  type: types.GET_ITEM,
  payload: item,
});

const assignUpdate = () => ({
  type: types.ASSIGN_ITEM,
});

const unassignUpdate = () => ({
  type: types.UNASSIGN_ITEM,
});

const completeUpdate = () => ({
  type: types.COMPLETE_ITEM,

});

export const loadItems = () => {
  return function (dispatch) {
      axios
          .get(`http://localhost:8000/checklist_items`)
          .then(res => {
              // console.log("res:", res.data)
              dispatch(getItems(res.data));
          })
          .catch(error => console.log(error))
  };
};


export const getSingleItem = (id) => {
  return function (dispatch) {
      axios
          .get(`http://localhost:8000/checklist_items/${id}`)
          .then(res => {
              console.log("Single Item:", res.data)
              dispatch(getItem(res.data));
          })
          .catch(error => console.log(error))
  };
};

// For Unassigned Items
export const assignItem = (id, assignee) => {
  return function (dispatch) {
    axios({
      method: 'patch',
      url: `http://localhost:8000/checklist_items/${id}`,
      headers: {
        "Content-Type": "application/json"
      },
      data: { "status": "assigned", "assigned_to": assignee }
    })
    .then(res => {
        // console.log("AssignItem:", res.data)
        dispatch(assignUpdate());
        dispatch(loadItems());
    })
    .catch(error => console.log(error))
  };
};

// For Assigned items
export const unassignItem = (id) => {
  return function (dispatch) {
    axios({
      method: 'patch',
      url: `http://localhost:8000/checklist_items/${id}`,
      headers: {
        "Content-Type": "application/json"
      },
      data: { "status": "unassigned" }
    })
    .then(res => {
      dispatch(unassignUpdate());
      dispatch(loadItems());
    })
    .catch(error => console.log(error))
  };
};

// For Uncompleted items
export const completeItem = (id, assignee) => {
  return function (dispatch) {
    axios({
      method: 'patch',
      url: `http://localhost:8000/checklist_items/${id}`,
      headers: {
        "Content-Type": "application/json"
      },
      data: { "status": "completed", "completed_by": assignee }
    })
    .then(res => {
      dispatch(completeUpdate());
      dispatch(loadItems());
    })
    .catch(error => console.log(error))
  };
};

