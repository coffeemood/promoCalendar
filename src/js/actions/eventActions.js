import axios from "axios"

var config = { 
    crossdomain: true,
    params: {
        token: 1
    }
}

var environment = 'dev'
var host = environment == 'dev' ? 'http://localhost:6001/v1/promotions-calendar' : 'https://opsapi.tabdigital.com.au/v1/promotions-calendar'

export function fetchEvents(type) {
  return function(dispatch) {
    dispatch({type: "FETCH_EVENT"});
    axios.get(`${host}/events?type=${type}`, config)
      .then((response) => {
        dispatch({type: "FETCH_EVENTS_FULFILLED", payload: response.data})
      })
      .catch((err) => {
        dispatch({type: "FETCH_EVENTS_REJECTED", payload: err})
      })
  }
}

export function createEvent(body) {
  return function(dispatch) {
    dispatch({type: "CREATE_EVENT"});
    axios.post(`${host}/events`, body, config)
      .then((response) => {
        dispatch({type: "CREATE_EVENTS_FULFILLED", payload: response.data})
      })
      .catch((err) => {
        dispatch({type: "CREATE_EVENTS_REJECTED", payload: err})
      })
  }
}

export function updateEvent(body) {
  return function(dispatch) {
    dispatch({type: "UPDATE_EVENT"});
    axios.put(`${host}/events`, body, config)
      .then((response) => {
        dispatch({type: "UPDATE_EVENTS_FULFILLED", payload: response.data})
      })
      .catch((err) => {
        dispatch({type: "UPDATE_EVENTS_REJECTED", payload: err})
      })
  }
}

export function deleteEvent(body) {
  return function(dispatch) {
    dispatch({type: "DELETE_EVENT"});
    axios.delete(`${host}/events?id=${body.id}`, config)
      .then((response) => {
        dispatch({type: "DELETE_EVENTS_FULFILLED", payload: response.data})
      })
      .catch((err) => {
        dispatch({type: "DELETE_EVENTS_REJECTED", payload: err})
      })
  }
}


