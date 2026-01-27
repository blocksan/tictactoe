
//Dashboard

// Import Authentication pages
import Logout from "../Pages/Authentication/Logout";
import CapitalCalculator from "../Pages/Calculator/CapitalCalculator";
import DrawdownCalculator from "../Pages/Calculator/DrawdownCalculator";
import TargetCalculator from "../Pages/Calculator/TargetCalculator";
import Faq from "../Pages/DocPages/Faq";
import PrivacyPolicy from "../Pages/DocPages/PrivacyPolicy";
import TermsNConditions from "../Pages/DocPages/TermsNConditions";
import OpenPricing from "../Pages/Pricing/OpenPricing";
import Pricing from "../Pages/Pricing/Pricing";
import Referral from "../Pages/Settings/Referral";
import MySubscription from "../Pages/Subscription/MySubscription";
import Landing from './../Pages/Landing/landing';

const authProtectedRoutes = [
  //dashboard
  // { path: "/dashboard", component: <Dashboard /> },

  // Profile
  // { path: "/userprofile", component: <UserProfile /> },
  { path: "/referrallink", component: <Referral /> },
  { path: "/targetcalculator", component: <TargetCalculator /> },
  { path: "/drawdown-calculator", component: <DrawdownCalculator /> },
  { path: "/capitalcalculator", component: <CapitalCalculator /> },
  { path: "/pricing", component: <Pricing /> },
  { path: "/my-subscription", component: <MySubscription /> },


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
  { path: "/termsandconditions", component: <TermsNConditions /> },
  { path: "/faq", component: <Faq /> },
  { path: "/privacypolicy", component: <PrivacyPolicy /> },
  // { path: "/login", component: <Login /> },
  // { path: "/forgot-password", component: <ForgetPasswordPage /> },
  // { path: "/register", component: <Register /> },
];

export { authProtectedRoutes, publicRoutes };
