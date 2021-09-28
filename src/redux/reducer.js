import * as types from "./actionTypes";

const initialState = {
  items: [],
  item: {}
}

const itemsReducers = (state = initialState, action) => {

  switch (action.type) {

  case types.GET_ITEMS:
    return {
        ...state,
        items: action.payload
    };

  case types.GET_ITEM:
    return {
        ...state,
        item: action.payload,
      };

  default:
      return state;

  };
};


export default itemsReducers