import React, { Component } from "react";
import { ButtonGroup, Button } from "reactstrap";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import gif from "../assets/boat.gif";

class NotFound extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { history } = this.props;

    return (
      <div className="NotFound" style={{ textAlign: "center" }}>
        <h1>404 Page Not Found</h1>
        <br />
        <h3>Why don't you try one of the below links?</h3>
        <br />
        <ButtonGroup
          style={{
            height: window.innerHeight * 0.1,
            width: window.innerWidth * 0.2
          }}
        >
          <Button color="primary" onClick={() => history.push("/")}>
            Home
          </Button>
          <Button color="primary" onClick={() => history.push("/login")}>
            Login
          </Button>
        </ButtonGroup>
        <br />
        <br />
        <img src={gif} alt="notFoundGif" />
      </div>
    );
  }
}

export default connect()(withRouter(NotFound));
