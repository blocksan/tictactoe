import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import { getFirestore, collection, addDoc, updateDoc, query, where, getDocs } from "firebase/firestore";
import { getPremiumStatus } from "./stripe/premiumStatus";
import { stripePortalUrl } from "./stripe/stripePayment";

// import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// import {ref} from 'firebase/database';
// import { getAnalytics } from "firebase/analytics";

let firebaseApp=null;
let _fireBaseBackend = null;
class FirebaseAuthBackend {
  constructor(firebaseConfig) {
    if (firebaseConfig && !firebaseApp) {
      // Initialize Firebase
      firebaseApp = initializeApp(firebaseConfig);
      // firebase.auth().onAuthStateChanged(user => {
      //   if (user) {
      //     localStorage.setItem("authUser", JSON.stringify(user));
      //   } else {
      //     localStorage.removeItem("authUser");
      //   }
      // });
    }
  }


  /**
   * Registers the user with given details
   */
  // registerUser = (email, password) => {
  //   return new Promise((resolve, reject) => {
  //     firebase
  //       .auth()
  //       .createUserWithEmailAndPassword(email, password)
  //       .then(
  //         user => {
  //           resolve(firebase.auth().currentUser);
  //         },
  //         error => {
  //           reject(this._handleError(error));
  //         }
  //       );
  //   });
  // };

  /**
   * Registers the user with given details
   */
  // editProfileAPI = (email, password) => {
  //   return new Promise((resolve, reject) => {
  //     firebase
  //       .auth()
  //       .createUserWithEmailAndPassword(email, password)
  //       .then(
  //         user => {
  //           resolve(firebase.auth().currentUser);
  //         },
  //         error => {
  //           reject(this._handleError(error));
  //         }
  //       );
  //   });
  // };

  /**
   * Login user with given details
   */
  // loginUser = (email, password) => {
  //   return new Promise((resolve, reject) => {
  //     firebase
  //       .auth()
  //       .signInWithEmailAndPassword(email, password)
  //       .then(
  //         user => {
  //           resolve(firebase.auth().currentUser);
  //         },
  //         error => {
  //           reject(this._handleError(error));
  //         }
  //       );
  //   });
  // };

  /**
   * forget Password user with given details
   */
  // forgetPassword = email => {
  //   return new Promise((resolve, reject) => {
  //     firebase
  //       .auth()
  //       .sendPasswordResetEmail(email, {
  //         url:
  //           window.location.protocol + "//" + window.location.host + "/login",
  //       })
  //       .then(() => {
  //         resolve(true);
  //       })
  //       .catch(error => {
  //         reject(this._handleError(error));
  //       });
  //   });
  // };

  /**
   * Logout the user
   */
  logout = () => {
    return new Promise((resolve, reject) => {
      const auth = getAuth(firebaseApp);
      auth.signOut()
        .then(() => {
          resolve(true);
        })
        .catch(error => {
          reject(this._handleError(error));
        });
    });
  };

  /**
   * Social Login user with given details
   */
  socialLoginUser =  (data, type) => {
    return new Promise((resolve, reject) => {
            try{
              resolve(this.addNewUserToFirestore(data));
            }catch(err){
              reject(this._handleError(err));
            }
    });
    // console.log('---data---',data);
    // console.log('---type---',type)
    // if (type === "google") {
    //   credential = firebase.auth.GoogleAuthProvider.credential(data.token);
    // } else if (type === "facebook") {
    //   credential = firebase.auth.FacebookAuthProvider.credential(data.token);
    // }
    // console.log('---credential---',credential)
    // return new Promise((resolve, reject) => {
    //   if (!!credential) {
    //     firebase.auth().signInWithCredential(credential)
    //       .then(user => {
    //         console.log('---user---',user)
    //         resolve(this.addNewUserToFirestore(user));
    //       })
    //       .catch(error => {
    //         console.log(error,'---error--')
    //         reject(this._handleError(error));
    //       });
    //   } else {
    //     // console.log(error)
    //     // reject(this._handleError(error));
    //   }
    // });
  };

  isPremiumOrTrial = async (includeTrial) => {
    return new Promise((resolve, reject) => {
        try{
          resolve(getPremiumStatus(firebaseApp, includeTrial));
        }catch(err){
          reject(false)
        }
    })
  };

  getStripePortalUrl = async () => {
    return new Promise((resolve, reject) => {
        try{
          resolve(stripePortalUrl(firebaseApp));
        }catch(err){
          reject(false)
        }
    })
  };

  addNewUserToFirestore = async (user) => {
    try{
      const db = getFirestore(firebaseApp);
      const dbUser = {
        name: user.name,
        email: user.email,
        avatarUrl: user.picture,
        createdOn: new Date(),
        lastAccessedOn: new Date(),
        viaGooleSignIn: true,
      };

      // await collection(db, "users").id(user.uid).set(dbUser);
      const userQuery = query(collection(db, "users"), where("email", "==", dbUser.email));
      const querySnapshot = await getDocs(userQuery);
      if(!querySnapshot.empty){
        await updateDoc(querySnapshot.docs[0].ref, {
          lastAccessedOn: new Date(),
        });
      }else{
        await addDoc(collection(db, "users"), {
          ...dbUser
        });
      }
      return {user:dbUser};
      // const collection = firebaseApp.firestore().collection("users");
    }catch(err){
      console.log(err,'---err--')
      throw err;
    }
  };

  setLoggeedInUser = user => {
    localStorage.setItem("authUser", JSON.stringify(user));
  };

  /**
   * Returns the authenticated user
   */
  getAuthenticatedUser = () => {
    if (!localStorage.getItem("authUser")) return null;
    return JSON.parse(localStorage.getItem("authUser"));
  };

  /**
   * Handle the error
   * @param {*} error
   */
  _handleError(error) {
    // var errorCode = error.code;
    var errorMessage = error.message;
    return errorMessage;
  }
}


/**
 * Initilize the backend
 * @param {*} config
 */
const initFirebaseBackend = config => {
  if (!_fireBaseBackend) {
    _fireBaseBackend = new FirebaseAuthBackend(config);
  }
  return _fireBaseBackend;
};

/**
 * Returns the firebase backend
 */
const getFirebaseBackend = () => {
  return _fireBaseBackend;
};

const getFirebaseApp = () => {
  return firebaseApp;
}

export { initFirebaseBackend, getFirebaseBackend, getFirebaseApp };
