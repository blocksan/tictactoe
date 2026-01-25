import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { addDoc, collection, getDocs, getFirestore, query, updateDoc, where } from "firebase/firestore";
import { RISK_CALCULATOR_COLLECTION, TARGET_CALCULATOR_COLLECTION } from "../constants/firebase";
import { getPremiumStatus } from "./stripe/premiumStatus";
import { stripePortalUrl } from "./stripe/stripePayment";

// import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// import {ref} from 'firebase/database';
// import { getAnalytics } from "firebase/analytics";

let firebaseApp = null;
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
  socialLoginUser = (data, type) => {
    return new Promise((resolve, reject) => {
      try {
        resolve(this.addNewUserToFirestore(data));
      } catch (err) {
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
      try {
        resolve(getPremiumStatus(firebaseApp, includeTrial));
      } catch (err) {
        reject(false)
      }
    })
  };

  getStripePortalUrl = async () => {
    return new Promise((resolve, reject) => {
      try {
        resolve(stripePortalUrl(firebaseApp));
      } catch (err) {
        reject(false)
      }
    })
  };

  addNewUserToFirestore = async (user) => {
    try {
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
      if (!querySnapshot.empty) {
        await updateDoc(querySnapshot.docs[0].ref, {
          lastAccessedOn: new Date(),
        });
      } else {
        await addDoc(collection(db, "users"), {
          ...dbUser
        });
      }
      return { user: dbUser };
      // const collection = firebaseApp.firestore().collection("users");
    } catch (err) {
      console.log(err, '---err--')
      throw err;
    }
  };

  addOrUpdateRiskCalculatorConfigToFirestore = async (config, configName, isUpdateQuery) => {
    try {
      const db = getFirestore(firebaseApp);
      const user = this.getAuthenticatedUser();
      if (!user) {
        return {
          status: false,
          error: "User not found"
        };
      }
      const riskConfigDoc = {
        createdOn: new Date(),
        updatedOn: new Date(),
        riskConfig: JSON.stringify(config),
        customerEmail: user.email,
        configName: configName
      };

      if (isUpdateQuery) {
        const userQuery = query(collection(db, RISK_CALCULATOR_COLLECTION), where("customerEmail", "==", user.email));
        const querySnapshot = await getDocs(userQuery);
        if (!querySnapshot.empty) {
          await updateDoc(querySnapshot.docs[0].ref, {
            riskConfig: riskConfigDoc.riskConfig,
            updatedOn: riskConfigDoc.updatedOn,
            configName: riskConfigDoc.configName
          });
        } else {
          await addDoc(collection(db, RISK_CALCULATOR_COLLECTION), {
            ...riskConfigDoc
          });
        }
      } else {
        await addDoc(collection(db, RISK_CALCULATOR_COLLECTION), {
          ...riskConfigDoc
        });
      }

      return {
        status: true
      };

    } catch (err) {
      console.log("error in addOrUpdateRiskCalculatorConfigToFirestore", err)
      return {
        status: false,
        error: err.message
      };

    }
  };

  addOrUpdateTargetCalculatorConfigToFirestore = async (config, configName, isUpdateQuery) => {
    try {
      const db = getFirestore(firebaseApp);
      const user = this.getAuthenticatedUser();
      if (!user) {
        return {
          status: false,
          error: "User not found"
        };
      }
      const targetConfigDoc = {
        createdOn: new Date(),
        updatedOn: new Date(),
        targetConfig: JSON.stringify(config),
        customerEmail: user.email,
        configName: configName
      };

      if (isUpdateQuery) {
        const userQuery = query(collection(db, TARGET_CALCULATOR_COLLECTION), where("customerEmail", "==", user.email));
        const querySnapshot = await getDocs(userQuery);
        if (!querySnapshot.empty) {
          await updateDoc(querySnapshot.docs[0].ref, {
            targetConfig: targetConfigDoc.targetConfig,
            updatedOn: targetConfigDoc.updatedOn,
            configName: targetConfigDoc.configName
          });
        } else {
          await addDoc(collection(db, TARGET_CALCULATOR_COLLECTION), {
            ...targetConfigDoc
          });
        }
      } else {
        await addDoc(collection(db, TARGET_CALCULATOR_COLLECTION), {
          ...targetConfigDoc
        });

      }

      return {
        status: true
      };

    } catch (err) {
      console.log("error in addOrUpdateTargetCalculatorConfigToFirestore", err)
      return {
        status: false,
        error: err.message
      };

    }
  }

  fetchRiskCalculatorConfigFromFirestore = async (customerId) => {
    try {
      const user = this.getAuthenticatedUser();
      if (!user) {
        return {
          status: false,
          data: []
        };
      }
      const db = getFirestore(firebaseApp);
      const userQuery = query(collection(db, RISK_CALCULATOR_COLLECTION), where("customerEmail", "==", user.email));
      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.empty) {
        let data = querySnapshot.docs.map(doc => {
          return {
            ...doc.data(),
            createdOn: doc.data().createdOn.toDate(),
            updatedOn: doc.data().updatedOn.toDate(),
            parsedConfig: JSON.parse(doc.data().riskConfig)
          }}).sort((a, b) => b.createdOn - a.createdOn)
        return {
          status: true,
          data
        };
      } else {
        return {
          status: false,
          data: []
        };
      }
    } catch (err) {
      console.log("error in fetchRiskCalculatorConfigFromFirestore", err)
      return {
        status: false,
        error: err.message,
        data: []
      };

    }
  }

  fetchTargetCalculatorConfigFromFirestore = async (customerId) => {
    try {
      const user = this.getAuthenticatedUser();
      if (!user) {
        return {
          status: false,
          data: []
        };
      }
      const db = getFirestore(firebaseApp);
      const userQuery = query(collection(db, TARGET_CALCULATOR_COLLECTION), where("customerEmail", "==", user.email));
      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.empty) {
        let data = querySnapshot.docs.map(doc => {
          return {
            ...doc.data(),
            createdOn: doc.data().createdOn.toDate(),
            updatedOn: doc.data().updatedOn.toDate(),
            parsedConfig: JSON.parse(doc.data().targetConfig)
          }}).sort((a, b) => b.createdOn - a.createdOn)
        return {
          status: true,
          data: data
        };
      } else {
        return {
          status: false,
          data: []
        };
      }
    } catch (err) {
      console.log("error in fetchTargetCalculatorConfigFromFirestore", err)
      return {
        status: false,
        error: err.message,
        data: []
      };

    }
  }

  setLoggeedInUser = user => {
    localStorage.setItem("authUser", JSON.stringify(user));
  };

  /**
   * Returns the authenticated user
   */
  getAuthenticatedUser = () => {
    if (!firebaseApp) {
      return null;
    }
    const auth = getAuth(firebaseApp);
    return auth.currentUser
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

export { getFirebaseApp, getFirebaseBackend, initFirebaseBackend };

