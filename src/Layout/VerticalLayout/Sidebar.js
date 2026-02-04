import PropTypes from "prop-types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import sidebarData from "./SidebarData";
//Simple bar
import SimpleBar from "simplebar-react";
// MetisMenu
import MetisMenu from "metismenujs";
import { Link } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";
//i18n
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Button } from "reactstrap";
const Sidebar = (props) => {
  const ref = useRef();
  const [loggedInUser, setLoggedInUser] = useState(null)
  const activateParentDropdown = useCallback(item => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }
    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;
      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag
        const parent3 = parent2.parentElement; // li tag
        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);
  const removeActivation = items => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      const parent = items[i].parentElement;
      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.length && parent.childNodes[1]
            ? parent.childNodes[1]
            : null;
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show");
        }
        parent.classList.remove("mm-active");
        const parent2 = parent.parentElement;
        if (parent2) {
          parent2.classList.remove("mm-show");
          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove("mm-active"); // li
            parent3.childNodes[0].classList.remove("mm-active");
            const parent4 = parent3.parentElement; // ul
            if (parent4) {
              parent4.classList.remove("mm-show"); // ul
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove("mm-show"); // li
                parent5.childNodes[0].classList.remove("mm-active"); // a tag
              }
            }
          }
        }
      }
    }
  };
  const activeMenu = useCallback(() => {
    const pathName = props.router.location.pathname;
    const fullPath = pathName;
    let matchingMenuItem = null;
    const ul = document.getElementById("side-menu-item");
    const items = ul.getElementsByTagName("a");
    removeActivation(items);
    for (let i = 0; i < items.length; ++i) {
      if (fullPath === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [
    props.router.location.pathname,
    activateParentDropdown,
  ]);
  useEffect(() => {
    ref.current.recalculate();
  }, []);
  useEffect(() => {
    new MetisMenu("#side-menu-item");
    activeMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (props.user) {
      setLoggedInUser(JSON.parse(JSON.stringify(props.user)))
    } else {
      setLoggedInUser(null)
    }
  }, [props.user])
  useEffect(() => {
    activeMenu();
  }, [activeMenu]);
  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }
  return (
    <React.Fragment>
      <div className="vertical-menu">
        <SimpleBar className="h-100" ref={ref}>
          <div id="sidebar-menu">
            <ul className="metismenu list-unstyled" id="side-menu-item">
              {(sidebarData || []).map((item, key) => (
                <React.Fragment key={key}>
                  {item.isMainMenu ? (
                    <li className="menu-title text-white">{props.t(item.label)}</li>
                  ) : (
                    <li key={key}>
                      <Link
                        to={item.url ? item.url : "/#"}
                        onClick={() => {
                          if (window.innerWidth < 992) {
                            document.body.classList.remove("sidebar-enable");
                          }
                        }}
                        className={
                          (item.issubMenubadge || item.isHasArrow)
                            ? " "
                            : "has-arrow"
                        }
                      >
                        <i
                          className={item.icon}
                          style={{ marginRight: "5px" }}
                        ></i>
                        {item.issubMenubadge && (
                          <span
                            className={
                              "badge rounded-pill float-end " + item.bgcolor
                            }
                          >
                            {" "}
                            {item.badgeValue}{" "}
                          </span>
                        )}
                        <span>{props.t(item.label)}</span>
                      </Link>
                      {item.subItem && (
                        <ul className="sub-menu">
                          {item.subItem.map((item, key) => (
                            <li key={key}>
                              <Link
                                to={item.link}
                                className={
                                  item.subMenu && "has-arrow waves-effect"
                                }
                              >
                                {props.t(item.sublabel)}
                              </Link>
                              {item.subMenu && (
                                <ul className="sub-menu">
                                  {item.subMenu.map((item, key) => (
                                    <li key={key}>
                                      <Link to="#">
                                        {props.t(item.title)}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  )}
                </React.Fragment>
              ))}
            </ul>
            {loggedInUser && !loggedInUser.isPremiumUser &&
              <div className="sidebar-upgrade-card mx-3 my-4 p-3 rounded-3 shadow-sm">
                <div className="d-flex align-items-center mb-2">
                  <div className="upgrade-icon-bg me-2">
                    <i className="bx bxs-crown text-warning"></i>
                  </div>
                  <h6 className="mb-0 text-white font-size-13 fw-semibold">Free Edition</h6>
                </div>
                <p className="text-white text-opacity-50 small mb-3" style={{ fontSize: "0.75rem", lineHeight: "1.4" }}>
                  Unlock unlimited calculations and get access to premium features.
                </p>
                <Link to={"/pricing"}>
                  <Button className="btn btn-primary btn-sm w-100 fw-bold upgrade-sidebar-btn border-0 shadow-sm">
                    Upgrade Now
                  </Button>
                </Link>
              </div>
            }
          </div>
        </SimpleBar>
      </div>
    </React.Fragment>
  );
};
Sidebar.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};
const mapStateToProps = state => {
  return { ...state.login };
};
export default connect(mapStateToProps, {})(withRouter(withTranslation()(Sidebar)))