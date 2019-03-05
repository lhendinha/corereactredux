import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, Col } from "reactstrap";
import Loader from "react-loader-spinner";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import axios from "axios";
import Alert from "react-s-alert";
import validator from "react-validation";
import "bootstrap/dist/css/bootstrap.min.css";

import { actionCreators } from "../../store/Login";
import { verifyAuthentication } from "../../Utils/Auth";

class SignUp extends Component {
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

  validationForm = () => {
    const {
      email,
      password,
      firstName,
      lastName,
      username,
      confirmPassword
    } = this.props;
    try {
      if (!email) {
        Alert.error("Please, enter with your email !", {
          position: "bottom-left",
          effect: "slide",
          timeout: "none"
        });
        return false;
      } else if (!validator.isEmail(email)) {
        Alert.error("Please, enter with a valid email !", {
          position: "bottom-left",
          effect: "slide",
          timeout: "none"
        });
        return false;
      }

      if (!username) {
        Alert.error("Please, enter with your username !", {
          position: "bottom-left",
          effect: "slide",
          timeout: "none"
        });
        return false;
      } else if (username.length < 3) {
        Alert.error("Please, enter with a bigger username !", {
          position: "bottom-left",
          effect: "slide",
          timeout: "none"
        });
        return false;
      }

      if (!firstName) {
        Alert.error("Please, enter with your first name !", {
          position: "bottom-left",
          effect: "slide",
          timeout: "none"
        });
        return false;
      } else if (firstName.length < 3) {
        Alert.error("Please, enter with your complete first name !", {
          position: "bottom-left",
          effect: "slide",
          timeout: "none"
        });
        return false;
      }

      if (!lastName) {
        Alert.error("Please, enter with your last name !", {
          position: "bottom-left",
          effect: "slide",
          timeout: "none"
        });
        return false;
      } else if (lastName.length < 3) {
        Alert.error("Please, enter with your complete last name !", {
          position: "bottom-left",
          effect: "slide",
          timeout: "none"
        });
        return false;
      }

      if (!password) {
        Alert.error("Please, enter with your password !", {
          position: "bottom-left",
          effect: "slide",
          timeout: "none"
        });
        return false;
      } else if (password.length < 3) {
        Alert.error("Please, enter with a bigger password !", {
          position: "bottom-left",
          effect: "slide",
          timeout: "none"
        });
        return false;
      }

      if (password != confirmPassword) {
        Alert.error("The passwords don't match !", {
          position: "bottom-left",
          effect: "slide",
          timeout: "none"
        });
        return false;
      }
    } catch (error) {
      console.log(error);
      return Alert.error("Something went wrong, please try again !", {
        position: "bottom-left",
        effect: "slide",
        timeout: "none"
      });
    }
  };

  signUp = async () => {
    const {
      email,
      password,
      firstName,
      lastName,
      username,
      history
    } = this.props;

    const formValidated = this.validationForm();
    if (formValidated === false) {
      return;
    }

    try {
      this.setState({ loading: true });

      const response = await axios.post("api/Users/register", {
        firstName,
        lastName,
        email,
        username,
        password
      });

      const { user } = response.data;

      Alert.success("Something went wrong, please try again !", {
        position: "bottom-left",
        effect: "slide",
        timeout: "none"
      });

      return history.push("/login");
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
      return Alert.error("Something went wrong, please try again !", {
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
          <h1 style={{ textAlign: "center" }}>Sign Up</h1>
          <br />
          <br />
          <FormGroup row>
            <Label for="insertEmail" sm={2}>
              Email
            </Label>
            <Col sm={10}>
              <Input
                type="email"
                name="email"
                id="insertEmail"
                placeholder="Example: xx@xx.com"
                value={this.props.email}
                onChange={emailValue =>
                  this.props.setEmail(emailValue.currentTarget.value)
                }
              />
            </Col>
          </FormGroup>
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
            <Label for="inserFirstName" sm={2}>
              First Name
            </Label>
            <Col sm={10}>
              <Input
                type="text"
                name="firstName"
                id="inserFirstName"
                placeholder="Example: Peter"
                value={this.props.firstName}
                onChange={firstNameValue =>
                  this.props.setFirstName(firstNameValue.currentTarget.value)
                }
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="insertLastName" sm={2}>
              Username
            </Label>
            <Col sm={10}>
              <Input
                type="text"
                name="lastName"
                id="insertLastName"
                placeholder="Example: Smith"
                value={this.props.lastName}
                onChange={lastNameValue =>
                  this.props.setLastName(lastNameValue.currentTarget.value)
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
          <FormGroup row>
            <Label for="insertConfirmPassword" sm={2}>
              Confirm Password
            </Label>
            <Col sm={10}>
              <Input
                type="password"
                name="confirmPassword"
                id="insertConfirmPassword"
                placeholder="Confirm your password here"
                value={this.props.confirmPassword}
                onChange={confirmPassword =>
                  this.props.setConfirmPassword(
                    confirmPassword.currentTarget.value
                  )
                }
              />
            </Col>
          </FormGroup>
          <FormGroup check row>
            <Col sm={{ size: 10, offset: 6 }}>
              <Button onClick={() => this.signUp()}>Submit</Button>
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
)(SignUp);
