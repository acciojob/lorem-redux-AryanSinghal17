
import React, { useEffect } from "react";
import { createStore } from "redux";
import {
  Provider,
  useSelector,
  useDispatch
} from "react-redux";

const initialState = {
  loading: false,
  data: null,
  error: null
};

function loremReducer(state = initialState, action) {
  switch (action.type) {
    case "FETCH_START":
      return {
        ...state,
        loading: true,
        error: null
      };

    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        data: action.payload
      };

    case "FETCH_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
}

const store = createStore(loremReducer);

function fetchLorem(dispatch) {
  dispatch({ type: "FETCH_START" });

  fetch("https://api.lorem.com/ipsum")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      return response.json();
    })
    .then((data) => {
      dispatch({
        type: "FETCH_SUCCESS",
        payload: data
      });
    })
    .catch((error) => {
      dispatch({
        type: "FETCH_ERROR",
        payload: error.message
      });
    });
}

function Lorem() {
  const dispatch = useDispatch();

  const { loading, data, error } = useSelector(
    (state) => state
  );

  useEffect(() => {
    fetchLorem(dispatch);
  }, [dispatch]);

  return (
    <div>
      <h1>Lorem Redux</h1>

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {data && (
        <div>
          <h2>{data.title}</h2>
          <p>{data.body}</p>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Lorem />
    </Provider>
  );
}

export default App;
