import * as React from "react";
import "./Doc.scss";
import Content from "./Content";

import logo from "../../assets/images/logo.png";

class Docs extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          {" "}
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="page-title">DOCUMENTATION</h1>{" "}
        </header>{" "}
        <Content />
      </div>
    );
  }
}

export default Docs;
