import fetch from 'isomorphic-fetch'

export const REQUEST_DATA = 'REQUEST_DATA'
export const RECEIVE_DATA = 'RECEIVE_DATA'
export const UPDATE_SETTINGS = 'UPDATE_SETTINGS'
export const UPDATE_COMPUTED = 'UPDATE_COMPUTED'
export const CLEAR_DATA = 'CLEAR_DATA'


export function updateSettings(settings, tag){
  return {
    type: UPDATE_SETTINGS,
    settings,
    tag//might need to use the tag here??
  }
}

export function updateComputedData(settings){
  return{
    type: UPDATE_COMPUTED,
    settings
  }
}

/*
function receivePosts(reddit, json) {
  return {
    type: RECEIVE_POSTS,
    reddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  }
}
*/

export function clearAPIData(treeparent){
  return{
    type: CLEAR_DATA,
    treeparent
  }
}

export function fetchAPIData(url, treeparent, processor){
  return dispatch => {
    //fetch url data
    return fetch(url)
      .then(response => response.json())
      .then(json => dispatch(receiveAPIData(treeparent, json, processor)))
    //then hit the callback
  }
}

function receiveAPIData(treeparent, indata, processor){
  //console.log("ready to process data ~~~~~", indata);
  if(Array.isArray(indata[0])){
    indata = csvtojson(indata)
  }

  return{
    type: RECEIVE_DATA,
    treeparent,
    data: indata.map(processor)
  }
}

function csvtojson(csv){
  var ob = {}
  var finalset  = []
  var cols = []
  //get objet structure from first row
  for (var p in csv[0]){
    cols.push(csv[0][p])
  }

  csv.splice(0,1)

  for(var r in csv){
    for(var c=0; c<cols.length; c++){
      ob[cols[c]] = csv[r][c]
    }
    finalset.push(ob)
    ob = {}
  }

  return finalset
}


/*
function shouldFetchPosts(state, reddit) {
  const posts = state.postsByReddit[reddit]
  if (!posts) {
    return true
  }
  if (posts.isFetching) {
    return false
  }
  return posts.didInvalidate
}
*/
/*
export function fetchPostsIfNeeded(reddit) {
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState(), reddit)) {
      return dispatch(fetchPosts(reddit))
    }
  }
}*/
