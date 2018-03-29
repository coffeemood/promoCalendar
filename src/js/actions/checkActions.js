import axios from "axios"

const config = { 
    crossdomain: true,
    
}

export function fetchChecks() {
  return function(dispatch) {
    dispatch({type: "FETCH_CHECK"});
    axios.get("http://localhost:8888/v1/competition", config)
      .then((response) => {
        dispatch({type: "FETCH_CHECK_FULFILLED", payload: response.data})
      })
      .catch((err) => {
        dispatch({type: "FETCH_CHECK_REJECTED", payload: err})
      })
  }
}

