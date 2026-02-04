import PropTypes from 'prop-types';
import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";

//i18n
import { withTranslation } from "react-i18next";
// Redux
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import optimizedPremium from "../../../assets/images/TrraderPremium2.png";
import { MAX_FREE_CALCULATIONS } from '../../../constants/common';
import withRouter from "../withRouter";

// users
// import user1 from "../../../assets/images/users/avatar-1.jpg";

const ProfileMenu = props => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);
  const [username, setusername] = useState("Admin");
  const [avatarUrl, setAvatarUrl] = useState();
  const [isPremiumUser, setIsPremiumUser] = useState(false);


  useEffect(() => {
    if(!props.user) {
      // history.push("/logout");
      return;
    };
    let obj = props.user;
    setusername(obj.name);
    setAvatarUrl(obj.picture);
    setIsPremiumUser(obj.isPremiumUser);
  }, [props.user]);




  return (
    <React.Fragment>


        {props.user && !isPremiumUser && (
             <span className="ms-1 d-flex align-items-center" style={{fontWeight: 'bold', color: 'orange', alignSelf: 'center', marginRight: '15px'}}>
                <span className="d-none d-lg-inline">Trial Left : </span>
                <span className="d-inline d-lg-none font-size-11">Trial : </span>
                <span style={{
                    backgroundColor: 'orange',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '2px 8px',
                    marginLeft: '5px',
                    fontSize: '0.8rem'
                }}>{Math.max(0, MAX_FREE_CALCULATIONS - (Object.values(props.user.freeTrialConfig || {}).reduce((a,b)=>a+b, 0)))}</span>
            </span>
        )}

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
          {isPremiumUser && <img src={optimizedPremium} style={{
            position: "absolute",
            left: "2px",
            width: "55px",
            top: "9px",
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
          <DropdownItem tag="a" href="#">
            <Link to="/my-subscription" style={{color:"black", display:"block", width:"100%"}}>
              <i className="ri-settings-2-line align-middle me-2" />
              {props.t("My Subscriptions")}
            </Link>
          </DropdownItem>
          <DropdownItem tag="a" href="#">
            <Link to="/payment-history" style={{color:"black", display:"block", width:"100%"}}>
              <i className="ri-history-line align-middle me-2" />
              {props.t("Payment History")}
            </Link>
          </DropdownItem>
          <DropdownItem tag="a">
          <Link to="/pricing" style={{color:"black"}}>
            <i className="bx bx-rupee align-middle me-2" />
            {props.t("Pricing Plans")}
          </Link>
          </DropdownItem>
          <div className="dropdown-divider" />
          <Link to="/logout" className="dropdown-item">
            <i className="ri-shut-down-line align-middle me-2 text-danger" />
            <span className='text-danger'>{props.t("Logout")}</span>
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
