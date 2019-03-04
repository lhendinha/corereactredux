import React, { Component } from "react";
import {
  Collapse,
  Container,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  Button
} from "reactstrap";
import { Link, withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { isEmpty } from "lodash";

import { actionCreators } from "../../store/Login";
import "./NavMenu.css";

class NavMenu extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  logout = () => {
    const { setUser, history } = this.props;

    localStorage.clear();

    setUser({});

    return history.push("/");
  };

  renderLogin = () => {
    const { user } = this.props;

    if (isEmpty(user)) {
      return (
        <NavLink tag={Link} className="text-dark" to="/login">
          Login
        </NavLink>
      );
    } else {
      return (
        <NavLink tag={Link} className="text-dark" to="/user">
          {user.username ? `Hello ${user.username}` : "Hello Not Found"}
        </NavLink>
      );
    }
  };

  renderSignUp = () => {
    const { user } = this.props;

    if (isEmpty(user)) {
      return (
        <NavLink tag={Link} className="text-dark" to="/register">
          Sign Up
        </NavLink>
      );
    } else {
      return (
        <Button
          color="link"
          className="text-dark"
          onClick={() => this.logout()}
        >
          Logout
        </Button>
      );
    }
  };

  render() {
    return (
      <header>
        <Navbar
          className="navbar-expand-sm navbar-toggleable-sm border-bottom box-shadow mb-3"
          light
        >
          <Container>
            <NavbarBrand tag={Link} to="/">
              CoreReactRedux
            </NavbarBrand>
            <NavbarToggler onClick={this.toggle} className="mr-2" />
            <Collapse
              className="d-sm-inline-flex flex-sm-row-reverse"
              isOpen={this.state.isOpen}
              navbar
            >
              <ul className="navbar-nav flex-grow">
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/">
                    Home
                  </NavLink>
                </NavItem>
                <NavItem>{this.renderLogin()}</NavItem>
                <NavItem>{this.renderSignUp()}</NavItem>
              </ul>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}

export default connect(
  state => state.login,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(withRouter(NavMenu));
