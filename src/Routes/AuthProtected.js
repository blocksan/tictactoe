import { Navigate } from "react-router-dom";

import { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import withRouter from "../components/Common/withRouter";
import { getFirebaseBackend } from "../helpers/firebase_helper";
import { loginSuccess } from "../store/actions";

const AuthProtected = (props) => {
  /*
    redirect is un-auth access protected routes via url
    */



  const dispatch = useDispatch();

  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!props.user) return;
      try {
        const backend = getFirebaseBackend();
        const premiumStatus = await backend.isPremiumUser(true);
        const isPremium = premiumStatus.isPremium;
        const planId = premiumStatus.planId;
        
        if (props.user.isPremiumUser !== isPremium || props.user.planId !== planId) {
             const updatedUser = { ...props.user, isPremiumUser: isPremium, planId: planId };
             // Update local storage as well to be safe, though helper does it too? 
             // Helper's isPremiumUser -> currentPremiumStatus -> updateAuthUser updates localStorage.
             // So we just need to update Redux.
             dispatch(loginSuccess(updatedUser));
        }
      } catch (err) {
        console.error("Failed to check premium status", err);
      }
    };

    checkPremiumStatus();
  }, [dispatch, props.user]);

  if (!props.user) {
    return (
      <Navigate to={{ pathname: "/", state: { from: props.location } }} />
    );
  }

  return <>{props.children}</>;
};




const mapStateToProps = state => {
  return { ...state.login };
};
export default withRouter(
  connect(mapStateToProps, {})(AuthProtected)
);
// export { AuthProtected, AccessRoute };
