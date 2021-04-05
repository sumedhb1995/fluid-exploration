import Fluid from "./fluidStatic";

import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import App from "./App";
import {
  OdspService,
  pushServiceToken,
  sharePointToken,
} from "./utils/odspUtils";

// Initialize Fluid with the ODSP service
Fluid.init(new OdspService(sharePointToken, pushServiceToken));

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
