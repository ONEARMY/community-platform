import * as React from "react";
import "./Doc.css";
import TutorialList from "./TutorialList/index";

import logo from "../../assets/images/logo.png";

class Docs extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          {" "}
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">DOC</h1>{" "}
        </header>{" "}
        <TutorialList />
      </div>
    );
  }
}

export default Docs;
