import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

//i18n
import { withTranslation } from "react-i18next";
// Redux
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import withRouter from "../withRouter";
import optimizedPremium from "../../../assets/images/TrraderPremium2.png";
import { getFirebaseBackend } from "../../../helpers/firebase_helper";

// users
// import user1 from "../../../assets/images/users/avatar-1.jpg";

const ProfileMenu = props => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);
  const [username, setusername] = useState("Admin");
  const [avatarUrl, setAvatarUrl] = useState();
  const [isPremiumOrTrial, setIsPremiumOrTrial] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(!props.user) {
      // history.push("/logout");
      return;
    };
    let obj = props.user;
    setusername(obj.name);
    setAvatarUrl(obj.picture);
    setIsPremiumOrTrial(obj.isPremiumOrTrial);
  }, [props.user]);


  const navigateToStripePortal = async () => {
    setLoading(true)
    const portalUrl = await getFirebaseBackend().getStripePortalUrl();
    setLoading(false)
    //navigate to new page
    window.location.replace(portalUrl)
  }

  return (
    <React.Fragment>
     {loading && <div className="full-page-loading">Loading&#8230;</div>}
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item "
          id="page-header-user-dropdown"
          tag="button"
          style={{position: "relative"}}
        >
          <span>
          {isPremiumOrTrial && <img src={optimizedPremium} style={{
            position: "absolute",
            left: "2px",
            width: "55px",
            top: "8px",
          }} alt="Header Avatar" className="header-premium-icon" />}
          <img
            className="rounded-circle header-profile-user"
            src={avatarUrl}
            alt="Header Avatar"
            style={{
              zIndex: "10",
              position: "relative",
            }}
          />
          </span>
          <span className="d-none d-xl-inline-block ms-2 me-2">{username}</span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          {/* <DropdownItem tag="a" href="/userprofile">
            {" "}
            <i className="ri-user-line align-middle me-2" />
            {props.t("Profile")}{" "}
          </DropdownItem> */}
          {/* <DropdownItem tag="a" href="#">
            <i className="ri-wallet-2-line align-middle me-2" />
            {props.t("My Wallet")}
          </DropdownItem> */}
          {isPremiumOrTrial && <DropdownItem tag="a" onClick={navigateToStripePortal} style={{cursor:"pointer"}}>
              <i className="ri-settings-2-line align-middle me-2" />
            {props.t("Subscription")}
          </DropdownItem>}
          <DropdownItem tag="a">
          <Link to="/pricing" style={{color:"black"}}>
            <i className="bx bx-rupee align-middle me-2" />
            {props.t("Pricing Plans")}
          </Link>
          </DropdownItem>
          <div className="dropdown-divider" />
          <Link to="/logout" className="dropdown-item">
            <i className="ri-shut-down-line align-middle me-2 text-danger" />
            <span>{props.t("Logout")}</span>
          </Link>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

ProfileMenu.propTypes = {
  user: PropTypes.any,
  t: PropTypes.any
};

const mapStatetoProps = state => {
  const { error, user } = state.login;
  return { error, user };
};

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
);
