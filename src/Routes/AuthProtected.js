import React from "react";
import { Navigate, Route } from "react-router-dom";

import withRouter from "../components/Common/withRouter";
import { connect } from "react-redux";

const AuthProtected = (props) => {
  /*
    redirect is un-auth access protected routes via url
    */

  if (!props.user) {
    return (
      <Navigate to={{ pathname: "/", state: { from: props.location } }} />
    );
  }

  return <>{props.children}</>;
};

const AccessRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        return (<> <Component {...props} /> </>);
      }}
    />
  );
};


const mapStateToProps = state => {
  return { ...state.login };
};
export default withRouter(
  connect(mapStateToProps, {})(AuthProtected)
);
// export { AuthProtected, AccessRoute };
