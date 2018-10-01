import * as React from "react";
import "./Doc.css";
import Content from "./Content";

import logo from "../../assets/images/logo.png";

class Docs extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          {" "}
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">DOCUMENTATION</h1>{" "}
        </header>{" "}
        <Content />
      </div>
    );
  }
}

export default Docs;
