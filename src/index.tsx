import * as React from "react";
import * as ReactDOM from "react-dom";
import { Routes } from "./pages/index";
import { BrowserRouter } from "react-router-dom";
// import App from "./components/app/App";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <BrowserRouter>
    <Routes />
  </BrowserRouter>,
  document.getElementById("root") as HTMLElement
);
registerServiceWorker();
