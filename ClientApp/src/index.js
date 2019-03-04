import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "react-router-redux";
import { createBrowserHistory } from "history";
import configureStore from "./store/configureStore";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

// Create browser history to use in the Redux store
const baseUrl = document.getElementsByTagName("base")[0].getAttribute("href");
const history = createBrowserHistory({ basename: baseUrl });

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = window.initialReduxState;
const store = configureStore(history, initialState);

//If localStorage has data in 'user', dispatch to reducer(login) to fill the data.
const getLocalStorage = () => {
  const user = JSON.parse(localStorage.getItem("myApp:user"));

  store.dispatch({ type: "SET_USER", payload: user });
};

const rootElement = document.getElementById("root");

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App>{getLocalStorage()}</App>
    </ConnectedRouter>
  </Provider>,
  rootElement
);

registerServiceWorker();
