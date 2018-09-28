import * as React from "react";
import "./Doc.css";

import logo from "../../logo.svg";

class Docs extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          {" "}
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">DOC</h1>{" "}
        </header>{" "}
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default Docs;
