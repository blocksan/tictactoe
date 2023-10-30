import React from "react";
import { Navigate } from "react-router-dom";

//Dashboard
import Dashboard from "../Pages/Dashboard";

// Import Authentication pages
import Login from "../Pages/Authentication/Login";
import ForgetPasswordPage from "../Pages/Authentication/ForgetPassword";
import Logout from "../Pages/Authentication/Logout";
import Register from "../Pages/Authentication/Register";
import UserProfile from "../Pages/Authentication/user-profile";
import RiskCalculator from "../Pages/Calculator/RiskCalculator";
import TargetCalculator from "../Pages/Calculator/TargetCalculator";
import CapitalCalculator from "../Pages/Calculator/CapitalCalculator";
import Landing from './../Pages/Landing/landing'
import Referral from "../Pages/Settings/Referral";
import Pricing from "../Pages/Pricing/Pricing";
import TermsNConditions from "../Pages/DocPages/TermsNConditions";
import Faq from "../Pages/DocPages/Faq";
import PrivacyPolicy from "../Pages/DocPages/PrivacyPolicy";
import OpenPricing from "../Pages/Pricing/OpenPricing";

const authProtectedRoutes = [
  //dashboard
  // { path: "/dashboard", component: <Dashboard /> },

  // Profile
  // { path: "/userprofile", component: <UserProfile /> },
  { path: "/referrallink", component: <Referral /> },
  { path: "/targetcalculator", component: <TargetCalculator /> },
  { path: "/riskcalculator", component: <RiskCalculator /> },
  { path: "/capitalcalculator", component: <CapitalCalculator /> },
  { path: "/pricing", component: <Pricing /> },


  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  // {
  //   path: "/dashboard",
  //   exact: true,
  //   component: <Navigate to="/dashboard" />,
  // },
];

const publicRoutes = [

  // Authentication Page
  {
    path: "/",
    exact: true,
    component: <Landing></Landing>,
  },
  { path: "/logout", component: <Logout /> },
  { path: "/openpricing", component: <OpenPricing /> },
  { path: "/termsnconditions", component: <TermsNConditions /> },
  { path: "/faq", component: <Faq /> },
  { path: "/privacypolicy", component: <PrivacyPolicy /> },
  // { path: "/login", component: <Login /> },
  // { path: "/forgot-password", component: <ForgetPasswordPage /> },
  // { path: "/register", component: <Register /> },
];

export { authProtectedRoutes, publicRoutes };
