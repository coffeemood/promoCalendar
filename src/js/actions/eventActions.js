import axios from "axios"

var config = { 
    crossdomain: true,
    params: {
        token: 1
    }
}

export function fetchEvents(type) {
  return function(dispatch) {
    config.params.type = type
    dispatch({type: "FETCH_EVENT"});
    axios.get("http://localhost:6001/v1/promotions-calendar/events", config)
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
    axios.post("http://localhost:6001/v1/promotions-calendar/events", body, config)
      .then((response) => {
        dispatch({type: "CREATE_EVENTS_FULFILLED", payload: response.data})
        axios.get("http://localhost:6001/v1/promotions-calendar/events", config)
          .then((response) => {
            dispatch({type: "FETCH_EVENTS_FULFILLED", payload: response.data})
          })
          .catch((err) => {
            dispatch({type: "FETCH_EVENTS_REJECTED", payload: err})
          })
      })
      .catch((err) => {
        dispatch({type: "CREATE_EVENTS_REJECTED", payload: err})
      })
  }
}

export function updateEvent(body) {
  return function(dispatch) {
    console.log(body)
    dispatch({type: "UPDATE_EVENT"});
    axios.put("http://localhost:6001/v1/promotions-calendar/events", body, config)
      .then((response) => {
        dispatch({type: "UPDATE_EVENTS_FULFILLED", payload: response.data})
        axios.get("http://localhost:6001/v1/promotions-calendar/events", config)
          .then((response) => {
            dispatch({type: "FETCH_EVENTS_FULFILLED", payload: response.data})
          })
          .catch((err) => {
            dispatch({type: "FETCH_EVENTS_REJECTED", payload: err})
          })
      })
      .catch((err) => {
        dispatch({type: "UPDATE_EVENTS_REJECTED", payload: err})
      })
  }
}

export function deleteEvent(body) {
  return function(dispatch) {
    let configNew = config 
    configNew.params.id = body.id
    dispatch({type: "DELETE_EVENT"});
    axios.delete("http://localhost:6001/v1/promotions-calendar/events", configNew)
      .then((response) => {
        dispatch({type: "DELETE_EVENTS_FULFILLED", payload: response.data})
        axios.get("http://localhost:6001/v1/promotions-calendar/events", config)
          .then((response) => {
            dispatch({type: "FETCH_EVENTS_FULFILLED", payload: response.data})
          })
          .catch((err) => {
            dispatch({type: "FETCH_EVENTS_REJECTED", payload: err})
          })
      })
      .catch((err) => {
        dispatch({type: "DELETE_EVENTS_REJECTED", payload: err})
        axios.get("http://localhost:6001/v1/promotions-calendar/events", config)
          .then((response) => {
            dispatch({type: "FETCH_EVENTS_FULFILLED", payload: response.data})
          })
          .catch((err) => {
            dispatch({type: "FETCH_EVENTS_REJECTED", payload: err})
          })
      })
  }
}


