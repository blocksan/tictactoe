import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import withRouter from "../../components/Common/withRouter";

//actions
import {
    changeLayout,
    changeLayoutWidth,
    changeTopbarTheme,
    showRightSidebarAction,
} from "../../store/actions";

//redux
import { useDispatch, useSelector } from "react-redux";

//components
import RightSidebar from "../../components/Common/RightSideBar";
import Footer from "./Footer";
import Header from "./Header";
import Navbar from "./NavBar";

const Layout = (props) => {
  const dispatch = useDispatch();

  const { topbarTheme, layoutWidth, showRightSidebar } =
    useSelector((state) => ({
      topbarTheme: state.Layout.topbarTheme,
      layoutWidth: state.Layout.layoutWidth,
      showRightSidebar: state.Layout.showRightSidebar,
    }));

  /*
  document title
  */
  useEffect(() => {
    const title = props.router.location.pathname;
    let currentage = title.charAt(1).toUpperCase() + title.slice(2);

    document.title = currentage + " | Trrader - React Admin & Dashboard Template";
  }, [props.router.location.pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  //hides right sidebar on body click
  const hideRightbar = useCallback(
    (event) => {
      var rightbar = document.getElementById("right-bar");
      //if clicked in inside right bar, then do nothing
      if (rightbar && rightbar.contains(event.target)) {
        return;
      } else {
        //if clicked in outside of rightbar then fire action for hide rightbar
        dispatch(showRightSidebarAction(false));
      }
    },
    [dispatch]
  );

  /*
  layout settings
  */
  useEffect(() => {
    dispatch(changeLayout("horizontal"));
  }, [dispatch]);

  useEffect(() => {
    //init body click event fot toggle rightbar
    document.body.addEventListener("click", hideRightbar, true);
  }, [hideRightbar]);

  useEffect(() => {
    if (topbarTheme) {
      dispatch(changeTopbarTheme(topbarTheme));
    }
  }, [dispatch, topbarTheme]);

  useEffect(() => {
    if (layoutWidth) {
      dispatch(changeLayoutWidth(layoutWidth));
    }
  }, [dispatch, layoutWidth]);

  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const openMenu = () => {
    setIsMenuOpened(!isMenuOpened);
  };

  return (
    <React.Fragment>

      <div id="layout-wrapper">
        <Header
          theme={topbarTheme}
          isMenuOpened={isMenuOpened}
          openLeftMenuCallBack={openMenu}
        />
        <Navbar />
        <div className="main-content">
          {props.children}
          <Footer />
        </div>
      </div>

      {showRightSidebar ? <RightSidebar /> : null}
    </React.Fragment>
  );
};

Layout.propTypes = {
  changeLayout: PropTypes.func,
  changeLayoutWidth: PropTypes.func,
  changeTopbarTheme: PropTypes.func,
  children: PropTypes.object,
  layoutWidth: PropTypes.any,
  location: PropTypes.object,
  showRightSidebar: PropTypes.any,
  topbarTheme: PropTypes.any,
};

export default withRouter(Layout);
