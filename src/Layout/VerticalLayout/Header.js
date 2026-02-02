import React, { useEffect, useState } from "react";

import { connect } from "react-redux";
import { Link } from "react-router-dom";

// import LanguageDropdown from "../../components/Common/TopbarDropdown/LanguageDropdown";
// import NotificationDropdown from "../../components/Common/TopbarDropdown/NotificationDropdown";

//i18n
import { withTranslation } from "react-i18next";

//import images
import logoVoiled from "../../assets/images/OnlyLogoVoiled.png";
// Redux Store
import ProfileMenu from "../../components/Common/TopbarDropdown/ProfileMenu";
import { TRADING_HOLIDAYS } from "../../constants/common";
import {
  changeSidebarType,
  showRightSidebarAction,
  toggleLeftmenu,
} from "../../store/actions";
// import AppsDropdown from "../../components/Common/TopbarDropdown/AppsDropdown";

const Header = (props) => {
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMarketOpen, setIsMarketOpen] = useState(false);

  useEffect(() => {
      const timer = setInterval(() => {
          const now = new Date();
          setCurrentTime(now);
          
          // Check Market Status (Mon-Fri, 9:15 - 15:30)
          const day = now.getDay(); // 0 is Sunday, 6 is Saturday
          const hour = now.getHours();
          const minute = now.getMinutes();
          const totalMinutes = hour * 60 + minute;
          
          // Format today as YYYY-MM-DD for holiday check
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const date = String(now.getDate()).padStart(2, '0');
          const todayStr = `${year}-${month}-${date}`;
          
          const isWeekend = day === 0 || day === 6;
          const isHoliday = TRADING_HOLIDAYS.includes(todayStr);
          const isTradingHours = totalMinutes >= (9 * 60 + 15) && totalMinutes < (15 * 60 + 30);
          
          const marketOpen = !isWeekend && !isHoliday && isTradingHours;
                            
          setIsMarketOpen(marketOpen);
      }, 1000);
      
      return () => clearInterval(timer);
  }, []);

  function toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

  useEffect(() => {
    function handleResize() {
        if(window.innerWidth < 998) {
            setShowHamburgerMenu(true);
        }else{
            setShowHamburgerMenu(false);
        }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
}, []);
  function tToggle() {
    var body = document.body;
    if (window.screen.width <= 998) {
    } else {
      // body.classList.toggle("vertical-collpsed");
      body.classList.toggle("sidebar-enable");
    }
  }

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header position-relative">
          <div className="d-flex">
            <div className="navbar-brand-box text-left">
              <Link to="/drawdown-calculator" className="logo logo-dark text-left" style={{
                color:"black"
              
              }}>
                <span className="logo-sm">
                  <img src={logoVoiled} alt="logo-sm-dark" width={40} />
                </span>
                <span className="logo-lg">
                  <img src={logoVoiled} alt="logo-dark" width={40} />
                  <strong style={{color:"black"}}>Trrader.in</strong>
                </span>
              </Link>

              <Link to="/drawdown-calculator" className="logo logo-light text-left">
                <span className="logo-sm">
                  <img src={logoVoiled} alt="logo-sm-light" width={40} />
                </span>
                <span className="logo-lg text-left">
                  <img src={logoVoiled} alt="logo-light" width={40}  />
                  <strong style={{color:"white"}}>Trrader.in</strong>
                </span>
              </Link>
            </div>

            <button
              type="button"
              className="btn btn-sm px-3 font-size-24 header-item waves-effect"
              id="vertical-menu-btn"
              onClick={() => {
                tToggle();
              }}
            >
             {showHamburgerMenu && <i className="ri-menu-2-line align-middle"></i>}
            </button>

            {/* <form className="app-search d-none d-lg-block">
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                />
                <span className="ri-search-line"></span>
              </div>
            </form> */}
          </div>

            {/* Market Status Widget (Centered over Content) */}
            <div 
                className="d-none d-md-flex justify-content-center align-items-center position-absolute top-50 translate-middle-y"
                style={{ zIndex: 10, left: '45%', transform: 'translateX(-50%)' }} 
            >
                <style>
                    {`
                        @keyframes pulse-green {
                            0% { box-shadow: 0 0 0 0 rgba(52, 195, 143, 0.7); }
                            70% { box-shadow: 0 0 0 6px rgba(52, 195, 143, 0); }
                            100% { box-shadow: 0 0 0 0 rgba(52, 195, 143, 0); }
                        }
                        @keyframes pulse-red {
                            0% { box-shadow: 0 0 0 0 rgba(244, 106, 106, 0.7); }
                            70% { box-shadow: 0 0 0 6px rgba(244, 106, 106, 0); }
                            100% { box-shadow: 0 0 0 0 rgba(244, 106, 106, 0); }
                        }
                    `}
                </style>
                <div 
                    className="d-flex align-items-center shadow-sm rounded-pill px-3 py-2 bg-white" 
                    style={{ border: '1px solid #f1f5f7' }}
                >
                    
                    {/* Market Status Section */}
                    <div className="d-flex align-items-center me-3 pe-3 border-end" style={{ height: '28px' }}>
                        <div 
                            className={`rounded-circle me-2 ${isMarketOpen ? 'bg-success' : 'bg-danger'}`} 
                            style={{ 
                                width: '10px', 
                                height: '10px', 
                                animation: isMarketOpen ? 'pulse-green 2s infinite' : 'none'
                             }}
                        ></div>
                        <div className="d-flex flex-column">
                            <span className={`font-size-12 fw-bold ${isMarketOpen ? 'text-success' : 'text-danger'} line-height-1`}>
                                {isMarketOpen ? 'MARKET OPEN' : 'MARKET CLOSED'}
                            </span>
                            {isMarketOpen && <small className="text-muted font-size-10">Live Updates</small>}
                        </div>
                    </div>

                    {/* Time Section */}
                    <div className="d-flex flex-column justify-content-center text-end ps-1">
                        <div className="line-height-1 mb-1">
                             <span className="font-size-16 fw-bolder text-dark font-family-secondary" style={{minWidth: '110px'}}>
                                {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                            </span>
                        </div>
                        <div className="line-height-1">
                             <span className="font-size-11 text-muted fw-semibold">
                                {currentTime.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'long' })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

          <div className="d-flex">
            {/* <div className="dropdown d-inline-block d-lg-none ms-2">
              <button
                onClick={() => {
                  setsearch(!search);
                }}
                type="button"
                className="btn header-item noti-icon "
                id="page-header-search-dropdown"
              >
                <i className="ri-search-line" />
              </button>
              <div
                className={
                  search
                    ? "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 show"
                    : "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                }
                aria-labelledby="page-header-search-dropdown"
              >
                <form className="p-3">
                  <div className="form-group m-0">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search ..."
                        aria-label="Recipient's username"
                      />
                      <div className="input-group-append">
                                    <Link className="dropdown-item" to="/riskreward-calculator">
                                        <i className="mdi mdi-target font-size-16 align-middle me-1"></i>{" "}
                                        Risk Reward Calculator
                                    </Link>
                  </div>
                </form>
              </div>
            </div> */}

            {/* <LanguageDropdown /> */}
            {/* <AppsDropdown /> */}



            <div className="dropdown d-none d-lg-inline-block ms-1">
              <button
                type="button"
                onClick={() => {
                  toggleFullscreen();
                }}
                className="btn header-item noti-icon"
                data-toggle="fullscreen"
              >
                <i className="ri-fullscreen-line" />
              </button>
            </div>

            
            {props.user && <ProfileMenu />}

            {/* <div
              className="dropdown d-inline-block"
              onClick={() => {
                props.showRightSidebarAction(!props.showRightSidebar);
              }}
            >
              <button
                type="button"
                className="btn header-item noti-icon right-bar-toggle waves-effect"
              >
                <i className="mdi mdi-cog"></i>
              </button>
            </div> */}
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

const mapStatetoProps = (state) => {
  const { layoutType, showRightSidebar, leftMenu, leftSideBarType } =
    state.Layout;
  const { user } = state.login;
  return { layoutType, showRightSidebar, leftMenu, leftSideBarType, user };
};

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
})(withTranslation()(Header));
