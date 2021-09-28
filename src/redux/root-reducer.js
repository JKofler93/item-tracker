import { combineReducers } from "redux"
import itemsReducers from './reducer'

const rootReducer = combineReducers({
    data: itemsReducers
})

export default rootReducer;