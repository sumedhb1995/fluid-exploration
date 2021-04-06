import Fluid from './fluidStatic';

import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';

import {
  OdspService,
  pushServiceToken,
  sharePointToken,
} from './utils/odspUtils';
// Initialize Fluid with the ODSP service
Fluid.init(new OdspService(sharePointToken, pushServiceToken));

// import { TinyliciousService } from './fluidStatic/getContainer';
// // Initialize Fluid with the Tinylicious service
// Fluid.init(new TinyliciousService());

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
