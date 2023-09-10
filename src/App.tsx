
import React, { useState } from 'react';
import './App.css';
import { initializeApp } from "firebase/app";
import { getFirestore,collection, addDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { ToastContainer, toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import toast CSS
// require('dotenv').config();
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env. REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
function isValidEmail(email: any) {
  // Regular expression for a valid email address
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
}
function App() {
  const [email, setEmail] = useState('');



  const handleEmailSubmit = async () => {

    if (!isValidEmail(email)) {
      toast.error('Invalid email format. Please enter a valid email address.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    try {
      // Add the email to Firestore
      // await db.collection('waitlistEmails').add({ email });
      const docRef = await addDoc(collection(db, "waitlistEmails"), {
        email,
        createdOn: new Date()    
      });
      // Clear the input field
      setEmail('');
      console.log("Document written with ID: ", docRef.id);
      toast.success('You joined the waitlist successfully', {
        position: 'top-right',
        autoClose: 3000, // Auto-close the toast after 3 seconds
      });

      // You can display a success message to the user here
    } catch (error) {
      console.error('Error adding document: ', error);
      // Handle error and show an error message to the user
      toast.error('Error submitting email. Please try again later.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };
  return (
    <div className="app">
      {/* Logo */}
      <div className="coming-soon">Coming Soon...</div>
      <div className="logo"></div>
      <div className="waitlist-container">
      <input
          type="email"
          placeholder="Please, your email"
          className="waitlist-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="join-button" onClick={handleEmailSubmit}>
          Join Waitlist
        </button>
      </div>
      <div className="footer">
      <span role="img" aria-label="flag">🇮🇳</span> Made in India <span role="img" aria-label="flag">🇮🇳</span>
      </div>
      {/* Your website content goes here */}
      <ToastContainer />
    </div>
  );
}

export default App;
