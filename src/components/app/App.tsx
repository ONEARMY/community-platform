import * as React from "react";
import "./App.css";
import { Routes } from "../../pages";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import { theme } from "../../themes/app.theme";

export class App extends React.Component {
  public render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Routes />
      </MuiThemeProvider>
    );
  }
}

export default App;
