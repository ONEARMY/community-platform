import * as React from "react";
import logo from "../../assets/images/logo.png";

export class NotFoundPage extends React.Component {
  public render() {
    return (
      <div className="App">
        <header className="App-header">
          {" "}
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">404 Page Not Found</h1>{" "}
        </header>{" "}
      </div>
    );
  }
}
