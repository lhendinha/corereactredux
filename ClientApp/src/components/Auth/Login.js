import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, Col } from "reactstrap";
import Loader from "react-loader-spinner";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import axios from "axios";
import Alert from "react-s-alert";
import "bootstrap/dist/css/bootstrap.min.css";

import { actionCreators } from "../../store/Login";
import { verifyAuthentication } from "../../Utils/Auth";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };
  }

  componentWillMount = () => {
    verifyAuthentication(
      this.props.user,
      this.props.history,
      this.props.location.pathname
    );
  };

  setUserCache = async (user, token) => {
    try {
      localStorage.setItem("myApp:user", JSON.stringify(user));
      localStorage.setItem("myApp:token", token);
    } catch (error) {
      Alert.error("Something went wrong, please try again !", {
        position: "bottom-left",
        effect: "slide",
        timeout: "none"
      });
    }
  };

  signIn = async () => {
    const { email, password, location, history, setUser } = this.props;

    try {
      this.setState({ loading: true });

      const response = await axios.post("api/Users/authenticate", {
        username: email,
        password: password
      });

      const { user, token } = response.data;

      this.setUserCache(user, token);
      setUser(user);

      this.setState({ loading: false });

      if (location.state.previusPage) {
        return history.push(location.state.previusPage);
      } else {
        return history.push("/user");
      }
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
      Alert.error("Something went wrong, please try again !", {
        position: "bottom-left",
        effect: "slide",
        timeout: "none"
      });
    }
  };

  render() {
    const { loading } = this.state;

    if (loading) {
      return (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)"
          }}
        >
          <Loader type="Grid" color="#00BFFF" height="100" width="100" />
        </div>
      );
    } else {
      return (
        <Form>
          <h1 style={{ textAlign: "center" }}>Sign In</h1>
          <br />
          <br />
          <FormGroup row>
            <Label for="insertUsername" sm={2}>
              Username
            </Label>
            <Col sm={10}>
              <Input
                type="text"
                name="username"
                id="insertUsername"
                placeholder="Example: xxxx"
                value={this.props.username}
                onChange={usernameValue =>
                  this.props.setUsername(usernameValue.currentTarget.value)
                }
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="insertPassword" sm={2}>
              Password
            </Label>
            <Col sm={10}>
              <Input
                type="password"
                name="password"
                id="insertPassword"
                placeholder="Insert your password here"
                value={this.props.password}
                onChange={passwordValue =>
                  this.props.setPassword(passwordValue.currentTarget.value)
                }
              />
            </Col>
          </FormGroup>
          <FormGroup check row>
            <Col sm={{ size: 10, offset: 6 }}>
              <Button onClick={() => this.signIn()}>Submit</Button>
            </Col>
          </FormGroup>
        </Form>
      );
    }
  }
}

export default connect(
  state => state.login,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(Login);
