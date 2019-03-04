import React, { Component } from "react";
import { Button } from "reactstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { actionCreators } from "../../store/Login";
import { verifyAuthentication } from "../../Utils/Auth";

class HomeScreen extends Component {
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

  render() {
    return (
      <div style={{ textAlign: "center" }}>
        <h1> Hello </h1>
        <Button onClick={() => console.log(this.props)}>Oi</Button>
      </div>
    );
  }
}

export default connect(
  state => state.login,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(HomeScreen);
