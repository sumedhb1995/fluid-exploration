import Fluid from "@fluid-experimental/fluid-static";
import { TinyliciousService } from "@fluid-experimental/get-container";

import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';

// Initialize Fluid with the Tinylicious service
Fluid.init(new TinyliciousService());

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);