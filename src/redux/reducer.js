import * as types from "./actionTypes";

const initialState = {
  items: []
}

const itemsReducers = (state = initialState, action) => {

  switch (action.type) {

  case types.GET_ITEMS:
    return {
        ...state,
        items: action.payload
    };

  default:
      return state;

  };
};


export default itemsReducers