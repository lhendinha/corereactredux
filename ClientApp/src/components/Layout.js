import React from "react";
import { Container } from "reactstrap";
import NavMenu from "./Menu/NavMenu";

export default props => (
  <div>
    <NavMenu />
    <Container>{props.children}</Container>
  </div>
);
