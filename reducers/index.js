import { combineReducers } from 'redux'
import {
  RECEIVE_DATA, UPDATE_SETTINGS, UPDATE_COMPUTED, CLEAR_DATA
} from '../actions'


function apiData(state={}, action){
  switch(action.type){
    case RECEIVE_DATA:
      return Object.assign({}, state, {
          [action.treeparent]: action.data
      })
    case CLEAR_DATA:
      return Object.assign({}, state, {
          [action.treeparent]: null
      })
    default:
      return state
  }
}


function apiSettings(state={}, action) {
  switch (action.type) {
    case UPDATE_SETTINGS:
      //console.log("reducing the update settings call")
      return Object.assign({}, state, {
        [action.tag]: action.settings})
    default:
      return state

  }
}


function computedData(state={}, action) {
  switch (action.type) {
    case UPDATE_COMPUTED:
      return Object.assign({}, state, action.settings)
    default:
      return state
  }
}

const rootReducer = combineReducers({
  apiData,
  apiSettings,
  computedData
})

export default rootReducer
