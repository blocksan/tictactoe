import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import "./i18n";

import {configureStore} from "./store/store";
import { google } from './config';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId={google.CLIENT_ID}>
  <Provider store={configureStore({})}>
    <React.Fragment>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.Fragment>
  </Provider>
  </GoogleOAuthProvider>
);
reportWebVitals();
// serviceWorker.unregister();

