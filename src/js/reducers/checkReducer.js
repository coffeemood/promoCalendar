export default function reducer(state={
    fetching: false,
    fetched: false,
    error: null,
  }, action) {

    switch (action.type) {
      case "FETCH_CHECK": {
        return {...state, fetching: true}
      }
      case "FETCH_CHECK_REJECTED": {
        return {...state, fetching: false, error: action.payload}
      }
      case "FETCH_CHECK_FULFILLED": {
        return {
          ...state,
          fetching: false,
          fetched: true,
          checks: action.payload,
        }
      }
      
    }

    return state
}
