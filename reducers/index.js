import { combineReducers } from 'redux'
import {
  RECEIVE_DATA, UPDATE_SETTINGS, UPDATE_COMPUTED, CLEAR_DATA
} from '../actions'

/*
function selectedReddit(state = 'reactjs', action) {
  switch (action.type) {
    case SELECT_REDDIT:
      return action.reddit
    default:
      return state
  }
}

function selectedNetwork(state='', action){
  switch (action.type){
    case SELECT_NETWORK:
      return action.selectedNetwork
    default:
      return state
  }
}

function selectedWeek(state='', action){
  switch(action.type){
    case SELECT_WEEK:
      return action.selectedWeek
    default:
      return state
  }
}*/

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
/*
function posts(state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) {
  switch (action.type) {
    case INVALIDATE_REDDIT:
      return Object.assign({}, state, {
        didInvalidate: true
      })
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        isFetching: true,
        didInvalidate: false
      })
    case RECEIVE_POSTS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        items: action.posts,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}*/
/*
function postsByReddit(state = { }, action) {
  switch (action.type) {
    case INVALIDATE_REDDIT:
    case RECEIVE_POSTS:
    case REQUEST_POSTS:
      return Object.assign({}, state, {
        [action.reddit]: posts(state[action.reddit], action)
      })
    default:
      return state
  }
}

function nets(state={nets:[], selectedNetwork:'init2'}, action){
  switch(action.type){
    case RECEIVE_NETS:
      console.log("reducer - ", action)
      return Object.assign({}, state, {
        nets: action.nets,
        selectedNetwork: selectedNetwork(state[action.selectedNetwork], action)
      })
    default:
      return state;
  }
}

function weeks(state={weeks:[], selectedWeek: 'def2'}, action){
  switch(action.type){
    case RECEIVE_WEEKS:
      return Object.assign({}, state, {
        weeks: action.weeks,
        selectedWeek: selectedWeek(state[action.selectedWeek], action)
      })
    default:
    return state;
  }
}

*/
const rootReducer = combineReducers({
  //selectedNetwork,
  //nets,
  //weeks,
  //selectedWeek,
  apiData,
  apiSettings,
  computedData
})

export default rootReducer
