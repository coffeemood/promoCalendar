export default function reducer(state={
    fetching: false,
    fetched: false,
    creating: false,
    created: false,
    deleting: false,
    deleted: false,
    updating: false,
    updated: false,
    error: null,
  }, action) {

    switch (action.type) {
      case "FETCH_EVENTS": {
        return {...state, fetching: true}
      }
      case "FETCH_EVENTS_REJECTED": {
        return {...state, fetching: false, error: action.payload}
      }
      case "FETCH_EVENTS_FULFILLED": {
        return {
          ...state,
          fetching: false,
          fetched: true,
          updated: false,
          created: false,
          deleted: false,
          events: action.payload,
        }
      }
      case "CREATE_EVENTS": {
        return {...state, creating: true}
      }
      case "CREATE_EVENTS_REJECTED": {
        return {...state, creating: false, error: action.payload}
      }
      case "CREATE_EVENTS_FULFILLED": {
        return {
          ...state,
          creating: false,
          created: true,
          events: action.payload,
        }
      }
      case "UPDATE_EVENTS": {
        return {...state, updating: true}
      }
      case "UPDATE_EVENTS_REJECTED": {
        return {...state, updating: false, error: action.payload}
      }
      case "UPDATE_EVENTS_FULFILLED": {
        return {
          ...state,
          updating: false,
          updated: true,
          events: action.payload,
        }
      }
      case "DELETE_EVENTS": {
        return {...state, deleting: true}
      }
      case "DELETE_EVENTS_REJECTED": {
        return {...state, deleting: false, error: action.payload}
      }
      case "DELETE_EVENTS_FULFILLED": {
        return {
          ...state,
          deleting: false,
          deleted: true,
          events: action.payload,
        }
      }      
    }

    return state
}
