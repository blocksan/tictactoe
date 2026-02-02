import React from "react";
import Routes from "./Routes/index";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TOAST_DELAY } from './constants/common';
// Import Scss
import './assets/scss/theme.scss';

// Fake Backend 
// import fakeBackend from "./helpers/AuthType/fakeBackend";



// Firebase
// Import Firebase Configuration file
import { initFirebaseBackend } from "./helpers/firebase_helper";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  // databaseURL: process.env.REACT_APP_DATABASEURL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID,
}

// // init firebase backend
initFirebaseBackend(firebaseConfig)
// Activating fake backend
// fakeBackend();


function App() {
  return (
    <React.Fragment>
      <Routes />
      <ToastContainer autoClose={TOAST_DELAY} pauseOnHover />
    </React.Fragment>
  );
}

export default App;
