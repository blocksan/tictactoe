import { Route, Routes } from "react-router-dom";

// redux
import { useSelector } from "react-redux";

//constants
import { layoutTypes } from "../constants/layout";

// layouts
import HorizontalLayout from "../Layout/HorizontalLayout/index";
import NonAuthLayout from "../Layout/NonAuthLayout";
import PublicLayout from "../Layout/PublicLayout";
import VerticalLayout from "../Layout/VerticalLayout/index";
import AuthProtected from "./AuthProtected";

import { authProtectedRoutes, publicRoutes } from "./routes";

const getLayout = (layoutType) => {
  let Layout = VerticalLayout;
  switch (layoutType) {
    case layoutTypes.VERTICAL:
      Layout = VerticalLayout;
      break;
    case layoutTypes.HORIZONTAL:
      Layout = HorizontalLayout;
      break;
    default:
      break;
  }
  return Layout;
};



const Index = () => {

  const { layoutType, user } = useSelector((state) => ({
    layoutType: state.Layout.layoutType,
    user: state.login.user
  }));

  const Layout = getLayout(layoutType);

  const adaptiveRoutes = ['/termsandconditions', '/faq', '/privacypolicy', '/openpricing'];

  return (
    <Routes>
      <Route>
        {publicRoutes.map((route, idx) => {
          let LayoutComponent = NonAuthLayout;
            if (adaptiveRoutes.includes(route.path)) {
                if (user) {
                    LayoutComponent = Layout;
                } else {
                    LayoutComponent = PublicLayout;
                }
            }
          
          return (
          <Route
            path={route.path}
            element={
              <LayoutComponent>
                  {route.component}
              </LayoutComponent>
          }
            key={idx}
            exact={true}
          />
        )})}
      </Route>

      <Route>
          {authProtectedRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={
                <AuthProtected>
                    <Layout>{route.component}</Layout>
                </AuthProtected>}
              key={idx}
              exact={true}
            />
          ))}
      </Route>
    </Routes>
  );
};

export default Index;
