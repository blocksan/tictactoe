import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { addDoc, collection, doc, getDocs, getFirestore, query, setDoc, updateDoc, where } from "firebase/firestore";
import { PRICING_PLANS } from "../constants/common";
import {
  DRAWDOWN_CALCULATOR_COLLECTION,
  RISK_REWARD_CALCULATOR_COLLECTION,
  SUBSCRIPTIONS_COLLECTION
} from "../constants/firebase";
import { loginSuccess } from "../store/actions";
import { cancelSubscription } from "./cashfree_helper";
import { getStore } from "./redux_store_helper";
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

  isPremiumUser = async (includeTrial) => {
    try {
      // Check Firestore premium status
      console.log("Checking premium status...", includeTrial);
      const status = await this.currentPremiumStatus();
      console.log("Premium status:", status);
      return status; 
    } catch (err) {
      console.log("Error checking premium user:", err);
      return { isPremium: false };
    }
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
        uid: user.uid,
      };

      // await collection(db, "users").id(user.uid).set(dbUser);
      const userQuery = query(collection(db, "users"), where("email", "==", dbUser.email));
      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.empty) {
        const existingData = querySnapshot.docs[0].data();
        await updateDoc(querySnapshot.docs[0].ref, {
          lastAccessedOn: new Date(),
        });
        return { user: { ...dbUser, ...existingData } };
      } else {
        await addDoc(collection(db, "users"), {
          ...dbUser
        });
        return { user: dbUser };
      }
      // const collection = firebaseApp.firestore().collection("users");
    } catch (err) {
      console.log(err, '---err--')
      throw err;
    }
  };

  addOrUpdateDrawdownCalculatorConfigToFirestore = async (config, configName, isUpdateQuery) => {
    try {
      const db = getFirestore(firebaseApp);
      const user = await this.waitForCurrentUser();
      if (!user) {
        return {
          status: false,
          error: "User not found"
        };
      }
      const riskConfigDoc = {
        createdOn: new Date(),
        updatedOn: new Date(),
        drawdownConfig: JSON.stringify(config),
        customerEmail: user.email,
        configName: configName
      };

      if (isUpdateQuery) {
        const userQuery = query(collection(db, DRAWDOWN_CALCULATOR_COLLECTION), where("customerEmail", "==", user.email));
        const querySnapshot = await getDocs(userQuery);
        if (!querySnapshot.empty) {
          await updateDoc(querySnapshot.docs[0].ref, {
            drawdownConfig: riskConfigDoc.drawdownConfig,
            updatedOn: riskConfigDoc.updatedOn,
            configName: riskConfigDoc.configName
          });
        } else {
          await addDoc(collection(db, DRAWDOWN_CALCULATOR_COLLECTION), {
            ...riskConfigDoc
          });
        }
      } else {
        await addDoc(collection(db, DRAWDOWN_CALCULATOR_COLLECTION), {
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

  addOrUpdateRiskRewardCalculatorConfigToFirestore = async (config, configName, isUpdateQuery) => {
    try {
      const db = getFirestore(firebaseApp);
      const user = await this.waitForCurrentUser();
      if (!user) {
        return {
          status: false,
          error: "User not found"
        };
      }
      const riskRewardConfigDoc = {
        createdOn: new Date(),
        updatedOn: new Date(),
        riskRewardConfig: JSON.stringify(config),
        customerEmail: user.email,
        configName: configName
      };

      if (isUpdateQuery) {
        const userQuery = query(collection(db, RISK_REWARD_CALCULATOR_COLLECTION), where("customerEmail", "==", user.email));
        const querySnapshot = await getDocs(userQuery);
        if (!querySnapshot.empty) {
          await updateDoc(querySnapshot.docs[0].ref, {
            riskRewardConfig: riskRewardConfigDoc.riskRewardConfig,
            updatedOn: riskRewardConfigDoc.updatedOn,
            configName: riskRewardConfigDoc.configName
          });
        } else {
          await addDoc(collection(db, RISK_REWARD_CALCULATOR_COLLECTION), {
            ...riskRewardConfigDoc
          });
        }
      } else {
        await addDoc(collection(db, RISK_REWARD_CALCULATOR_COLLECTION), {
          ...riskRewardConfigDoc
        });

      }

      return {
        status: true
      };

    } catch (err) {
      console.log("error in addOrUpdateRiskRewardCalculatorConfigToFirestore", err)
      return {
        status: false,
        error: err.message
      };

    }
  }

  saveSubscription = async (paymentData, providedUser = null) => {
    try {
      const db = getFirestore(firebaseApp);
      let user = providedUser;
      
      if (!user) {
         user = await this.waitForCurrentUser();
      }
      
      if (!user) {
        return { status: false, error: "User not found" };
      }

      // Calculate subscription duration
      const startDate = new Date();
      const endDate = new Date();
      const isYearly = paymentData.planId && paymentData.planId.includes('YEARLY');
      // Add 365 days for yearly, 30 days for monthly (default)
      endDate.setDate(startDate.getDate() + (isYearly ? 365 : 30));

      let userId = user.uid || user.id;
      if (!userId) {
          const authUser = await this.waitForCurrentUser();
          if (authUser) userId = authUser.uid;
      }

      const subscriptionData = {
        userId: userId || user.email,
        email: user.email,
        paymentId: paymentData.id || "manual",
        orderId: paymentData.order_id || "manual",
        amount: paymentData.amount || 0,
        currency: paymentData.currency || "INR",
        status: "active",
        startDate: startDate,
        endDate: endDate,
        createdOn: new Date(),
        updatedOn: new Date(),
        planId: paymentData.planId || "unknown",
        planType: isYearly ? PRICING_PLANS[1] : PRICING_PLANS[0],
      };

      // Save to subscriptions collection
      await addDoc(collection(db, SUBSCRIPTIONS_COLLECTION), subscriptionData);

      // Update local auth object
      await this.updateAuthUser({
        ...user,
        isPremiumUser: true,
        subscriptionEndDate: endDate
      });

      return { status: true, data: subscriptionData };

    } catch (err) {
      return { status: false, error: err.message };
    }
  }

  // Log initial payment attempt
  logPaymentInitiation = async (paymentData, user) => {
    try {
        const db = getFirestore(firebaseApp);
        const paymentRecord = {
            userId: user.uid || user.email,
            email: user.email,
            orderId: paymentData.order_id,
            paymentId: paymentData.payment_session_id, // Initially use session ID
            amount: paymentData.amount,
            currency: paymentData.currency || "INR",
            status: "INITIATED",
            planId: paymentData.planId,
            createdOn: new Date(),
            platform: "Cashfree"
        };
        // Use orderId as doc ID to easily update it later
        await setDoc(doc(db, "payments", paymentData.order_id), paymentRecord);
        return { status: true };
    } catch (err) {
        return { status: false, error: err.message };
    }
  }

  // Update payment status (Success or Failed)
  updatePaymentStatus = async (orderId, status, details = {}) => {
      try {
        const db = getFirestore(firebaseApp);
        const paymentRef = doc(db, "payments", orderId);
        
        await updateDoc(paymentRef, {
            status: status,
            updatedOn: new Date(),
            ...details
        });
        return { status: true };
      } catch (err) {
          return { status: false, error: err.message };
      }
  }

  // New function to fetch payment history
  getUserPayments = async () => {
    try {
        const db = getFirestore(firebaseApp);
        const user = await this.waitForCurrentUser();
        if (!user) return { status: false, error: "User not found" };

        const paymentsQuery = query(
            collection(db, "payments"),
            where("email", "==", user.email)
        );

        const querySnapshot = await getDocs(paymentsQuery);
        const payments = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdOn: doc.data().createdOn ? doc.data().createdOn.toDate() : new Date()
        })).sort((a, b) => b.createdOn - a.createdOn);

        return { status: true, data: payments };
    } catch (err) {
        return { status: false, error: err.message };
    }
  }

  currentPremiumStatus = async () => {
    try {
      const db = getFirestore(firebaseApp);
      // Wait for user session to initialize
      const user = await this.waitForCurrentUser();
      
      if (!user) {
        return { isPremium: false };
      }

      // Check subscriptions collection for active subscription
      // Check subscriptions collection for active subscription
      // Query by email only to avoid composite index requirement
      const subscriptionsQuery = query(
        collection(db, SUBSCRIPTIONS_COLLECTION), 
        where("email", "==", user.email)
      );
      
      const querySnapshot = await getDocs(subscriptionsQuery);

      // Fetch user doc to sync freeTrialConfig
      const userQuery = query(collection(db, "users"), where("email", "==", user.email));
      const userSnapshot = await getDocs(userQuery);
      let freeTrialConfig = {};
      if (!userSnapshot.empty) {
          freeTrialConfig = userSnapshot.docs[0].data().freeTrialConfig || {};
      }

      // Filter in memory for active subscriptions
      const activeSubscriptions = querySnapshot.docs
        .map(doc => doc.data())
        .filter(sub => {
            const endDate = sub.endDate.toDate();
            // Check if active AND not expired
            return sub.status === 'active' && endDate > new Date();
        });

      if (activeSubscriptions.length > 0) {
        // Found at least one active subscription
        // We can pick the one with the latest end date if multiple exist
        const latestSubscription = activeSubscriptions
          .sort((a, b) => b.endDate.toDate() - a.endDate.toDate())[0];
          
         const endDate = latestSubscription.endDate.toDate();
         const planId = latestSubscription.planId;

         await this.updateAuthUser({ isPremiumUser: true, subscriptionEndDate: endDate, planId: planId, freeTrialConfig: freeTrialConfig });
         return { isPremium: true, endDate: endDate, planId: planId, freeTrialConfig: freeTrialConfig };
      }

      // If we reach here, user is NOT premium. Update local state to sync.
      await this.updateAuthUser({ isPremiumUser: false, freeTrialConfig: freeTrialConfig, planId: null });
      return { isPremium: false, freeTrialConfig: freeTrialConfig };

    } catch (err) {
      return { isPremium: false, error: err.message };
    }
  }

  getUserSubscriptions = async () => {
    try {
      const db = getFirestore(firebaseApp);
      // Wait for user session to initialize
      const user = await this.waitForCurrentUser();
      
      if (!user) {
        return { status: false, error: "User not found" };
      }

      const subscriptionsQuery = query(
        collection(db, SUBSCRIPTIONS_COLLECTION), 
        where("email", "==", user.email)
      );
      
      const querySnapshot = await getDocs(subscriptionsQuery);
      
      const subscriptions = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
              ...data,
              id: doc.id,
              startDate: data.startDate ? data.startDate.toDate() : null,
              endDate: data.endDate ? data.endDate.toDate() : null,
          };
      }).sort((a, b) => b.startDate - a.startDate);

      return { status: true, data: subscriptions };

    } catch (err) {
      return { status: false, error: err.message };
    }
  }

  cancelUserSubscription = async (subscriptionId, orderId) => {
    try {
        // 1. Call payment gateway cancel (dummy)
        const cancelResult = await cancelSubscription(orderId);
        if (cancelResult.status !== 'success') {
             return { status: false, error: cancelResult.message };
        }

        // 2. Update Firestore
        const db = getFirestore(firebaseApp);
        const subRef = doc(db, SUBSCRIPTIONS_COLLECTION, subscriptionId);
        await updateDoc(subRef, {
            status: "cancelled",
            updatedOn: new Date()
        });
        
        // 3. Update local premium status
        await this.currentPremiumStatus();

        return { status: true };
    } catch (err) {
        return { status: false, error: err.message };
    }
  }

  updateAuthUser = async (updatedUser) => {
    try {
       // Update localStorage
       const currentAuthUser = JSON.parse(localStorage.getItem("authUser")) || {};
       const newAuthUser = { ...currentAuthUser, ...updatedUser };
       localStorage.setItem("authUser", JSON.stringify(newAuthUser));
       const reduxStore = getStore();
       if (reduxStore) {
           reduxStore.dispatch(loginSuccess(newAuthUser));
       }
       return newAuthUser;
    } catch (err) {
      return null;
    }
  }

  checkAndIncrementTrialCount = async (category) => {
    try {
      const db = getFirestore(firebaseApp);
      const user = await this.waitForCurrentUser();
      
      if (!user) return { allowed: false, error: "User not logged in" };

      // Check premium status first
      const premiumStatus = await this.currentPremiumStatus();
      if (premiumStatus.isPremium) {
          return { allowed: true, isPremium: true };
      }

      // Fetch user doc to check trial count
      const userQuery = query(collection(db, "users"), where("email", "==", user.email));
      const querySnapshot = await getDocs(userQuery);
      
      if (querySnapshot.empty) {
          return { allowed: false, error: "User record not found" };
      }
      
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      
      const freeTrialConfig = userData.freeTrialConfig || {};
      const currentCategoryCount = freeTrialConfig[category] || 0;
      
      // Calculate total count across all categories
      const totalCount = Object.values(freeTrialConfig).reduce((sum, val) => sum + val, 0);
      
      if (totalCount >= 10) {
          return { allowed: false, count: totalCount, isPremium: false };
      }
      
      // Increment category count
      const updatedConfig = {
          ...freeTrialConfig,
          [category]: currentCategoryCount + 1
      };

      await updateDoc(userDoc.ref, {
          freeTrialConfig: updatedConfig,
          updatedOn: new Date()
      });
      
      // Sync local state so header can pick it up
      await this.updateAuthUser({ freeTrialConfig: updatedConfig });
      
      return { allowed: true, count: totalCount + 1, isPremium: false };
      
    } catch (err) {
      console.error("Error in checkAndIncrementTrialCount:", err);
      return { allowed: false, error: err.message };
    }
  }

  fetchDrawdownCalculatorConfigFromFirestore = async (customerId) => {
    try {
      const user = await this.waitForCurrentUser();
      if (!user) {
        return {
          status: false,
          data: []
        };
      }
      const db = getFirestore(firebaseApp);
      const userQuery = query(collection(db, DRAWDOWN_CALCULATOR_COLLECTION), where("customerEmail", "==", user.email));
      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.empty) {
        let data = querySnapshot.docs.map(doc => {
          return {
            ...doc.data(),
            createdOn: doc.data().createdOn.toDate(),
            updatedOn: doc.data().updatedOn.toDate(),
            parsedConfig: JSON.parse(doc.data().drawdownConfig)
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
      return {
        status: false,
        error: err.message,
        data: []
      };

    }
  }

  fetchRiskRewardCalculatorConfigFromFirestore = async (customerId) => {
    try {
      const user = await this.waitForCurrentUser();
      if (!user) {
        return {
          status: false,
          data: []
        };
      }
      const db = getFirestore(firebaseApp);
      const userQuery = query(collection(db, RISK_REWARD_CALCULATOR_COLLECTION), where("customerEmail", "==", user.email));
      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.empty) {
        let data = querySnapshot.docs.map(doc => {
          return {
            ...doc.data(),
            createdOn: doc.data().createdOn.toDate(),
            updatedOn: doc.data().updatedOn.toDate(),
            parsedConfig: JSON.parse(doc.data().riskRewardConfig)
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

  waitForCurrentUser = async () => {
    return new Promise((resolve) => {
        const auth = getAuth(firebaseApp);
        if (auth.currentUser) {
            resolve(auth.currentUser);
            return;
        }
        const unsubscribe = auth.onAuthStateChanged(user => {
            unsubscribe();
            resolve(user);
        });
    });
  }

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
export function initFirebaseBackend(config) {
  if (!_fireBaseBackend) {
    _fireBaseBackend = new FirebaseAuthBackend(config);
  }
  return _fireBaseBackend;
};

/**
 * Returns the firebase backend
 */
export function getFirebaseBackend() {
  return _fireBaseBackend;
};

export function getFirebaseApp() {
  return firebaseApp;
}

