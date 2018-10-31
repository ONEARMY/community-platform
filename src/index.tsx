import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";

import { Routes } from "./pages";
import { store } from "./redux/store";
import { theme } from "./themes/app.theme";

import "./index.css";

import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <Routes />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById("root") as HTMLElement
);
registerServiceWorker();
