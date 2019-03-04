import React, { Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import Alert from "react-s-alert";

import Layout from "./components/Layout";
import Home from "./components/Home";
import Login from "./components/Auth/Login";
import HomeScreen from "./components/User/HomeScreen";
import SignUp from "./components/Auth/SignUp";
import NotFound from "./components/NotFound";

import "react-s-alert/dist/s-alert-default.css";
import "react-s-alert/dist/s-alert-css-effects/slide.css";

export default () => (
  <Router history={createBrowserHistory}>
    <Layout>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/user" component={HomeScreen} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={SignUp} />
        <Route component={NotFound} />
        {/* Limit of Alerts in screen */}
        <Alert stack={{ limit: 3 }} />
      </Switch>
    </Layout>
  </Router>
);
