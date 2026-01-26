import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import mandrawing from "../../assets/images/mandrawing.png";
import logoVoiled from "../../assets/images/OnlyLogoVoiled.png";
import productOverview from "../../assets/images/product-overview.png";
import riskcalculator from "../../assets/images/riskcalculator.png";
import riskcalculatorresult from "../../assets/images/riskcalculatorresult.png";
import tradingdesktops from "../../assets/images/tradingdesktopscompressed.png";
import withRouter from "../../components/Common/withRouter";
import { logoutUser, socialLogin } from "../../store/actions";
//Import config

import { Link } from "react-router-dom";
import GoogleButton from "../../components/Common/GoogleButton";
import { getFirebaseApp } from "../../helpers/firebase_helper";
const Landing = (props) => {
    const dispatch = useDispatch();

    const firebaseApp = getFirebaseApp();
    const firebaseAuth = getAuth(firebaseApp);
    const provider = new GoogleAuthProvider();

    const signInWithGoogle = async () => {
        const result = await signInWithPopup(firebaseAuth, provider);
        const user = result.user;
        // if (type === "google") {
            const postData = {
                name: user.displayName,
                email: user.email,
                picture: user.photoURL,
            };
            dispatch(socialLogin(postData, props.router.navigate, "google"));
        // } 
        // else if (type === "facebook") {
        //     const postData = {
        //         name: res.name,
        //         email: res.email,
        //         token: res.accessToken,
        //         idToken: res.jti,
        //     };
        //     dispatch(socialLogin(postData, props.router.navigate, type));
        // }
    };

    useEffect(()=>{
        const user = firebaseAuth.currentUser;
        if(!user) {
            dispatch(logoutUser());
        }else{
            const postData = {
                name: user.displayName,
                email: user.email,
                picture: user.photoURL,
            };
            dispatch(socialLogin(postData, props.router.navigate, "google"));
        }
    },[])

    return (
        <React.Fragment>

            <div className="landing landing-page">
                <div className="header-main dark">
                    <nav>
                        <div className="nav-toggle"></div>
                        <ul className="inline left logo-nav">
                            <div style={{ display: "flex", alignItems: "center", color: "white" }}>
                                <img src={logoVoiled} alt="" style={{ width: 60 }} />
                                <div>
                                <h4 style={{ color: "white", marginBottom:0 }}>Trrader.in</h4>
                                <h6 style={{ color: "white", fontSize:"0.9em", fontWeight:"normal" }}>Built by Trrader, for Trrader</h6>
                                </div>
                            </div>
                        </ul>
                        <ul className="inline right">
                            <li><a href="/openpricing">Pricing</a></li>
                            <li>
                                <span onClick={signInWithGoogle}>
                                    <GoogleButton></GoogleButton>
                                </span>
                            </li>
                            {/* <li><a onClick={toggleLoginModal}>Log In</a></li> */}
                            {/* <li><a href="#" onClick={toggleLoginModal} className="button button-secondary button-m full-width-tablet" role="button">Sign Up</a></li> */}

                        </ul>
                    </nav>
                </div>
                <section className="bg-image-hero center-tablet dark overlay-hero">
                    <div className="full-screen -margin-bottom middle padding padding-top-tablet">
                        <div className="row max-width-l">
                            <div className="col-one-half middle">
                                <div>
                                    <h1 className="hero text-white mb-4">
                                        Protect Your Capital.<br/>Master Your Risk.
                                    </h1>
                                    <p className="lead text-white text-opacity-75 mb-5">
                                        Precision risk management tools designed for modern traders. Calculate position sizes, visualize drawdowns, and build the discipline required for long-term market success.
                                    </p>
                                    
                                    <div className="d-flex align-items-center gap-3">
                                        <span onClick={signInWithGoogle} className="cursor-pointer">
                                            <GoogleButton></GoogleButton>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-one-half middle">
                                <img src={mandrawing} alt="Hero Illustration" />
                            </div>
                        </div>
                    </div>
                    <div className="padding">
                        <div className="row margin-bottom max-width-l">
                            <div className="col-one-half middle">
                                <h6 className="text-white text-opacity-50 text-uppercase tracking-widest mb-3">Core Toolset</h6>
                                <h2 className="text-white mb-4">Intelligent Risk Planning</h2>
                                <p className="paragraph opacity-75">Stop guessing your position sizes. Input your capital, session duration, and risk tolerance to receive precise, mathematically-backed trade parameters. Stay disciplined with calculated stop-losses and profit targets.</p>
                            </div>
                            <div className="col-one-half">
                                <img className="rounded shadow-l" src={riskcalculator} alt="Risk Calculator Interface" />
                            </div>
                        </div>
                        <div className="row max-width-l reverse-order">
                            <div className="col-one-half">
                                <img className="rounded shadow-l" src={riskcalculatorresult} alt="Capital Drawdown Analytics" />
                            </div>
                            <div className="col-one-half middle">
                                <h6 className="text-white text-opacity-50 text-uppercase tracking-widest mb-3">Advanced Analytics</h6>
                                <h2 className="text-white mb-4">Capital Longevity Metrics</h2>
                                <p className="paragraph opacity-75">Visualize your survival rate. Our drawdown engine analyzes your strategy's resilience, showing you exactly how many sessions you can sustain under different market conditions. Better insights lead to better risk adjustments.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-gradient-light -margin-bottom-2 overlay padding">
                    <div className="center max-width-m">
                        <h6 className="text-uppercase tracking-widest mb-3 text-primary">The Trrader Edge</h6>
                        <h2>Mastering Market Discipline</h2>
                        <p className="paragraph">At Trrader.in, we believe that longevity is the ultimate metric for success. High-frequency patterns and complex indicators mean nothing if your capital is gone. Our mission is to provide every retail trader with the institutional-grade risk controls needed to weather any storm and build a sustainable trading career.</p>
                    </div>
                    <div className="margin-top max-width-l">
                        <img className="rounded shadow-xl" src={productOverview} alt="Platform Overview" />
                    </div>
                </section>

                <section className="bg-light center py-5">
                    <div className="row no-gutter align-items-center">
                        <div className="col-one-half middle padding">
                            <div className="max-width-m mx-auto">
                                <h6 className="text-uppercase tracking-widest mb-3 text-secondary">The Disciplined Mindset</h6>
                                <h3 className="mb-4">"Learn to take losses. The most important thing in making money is not letting your losses get out of hand."</h3>
                                <p className="paragraph muted">— Marty Schwartz, Pit Bull</p>
                                <div className="mt-4">
                                    <img src={logoVoiled} alt="Trrader Logo" style={{ width: 40, opacity: 0.6 }} />
                                </div>
                            </div>
                        </div>
                        <div className="col-one-half middle padding">
                            <img src={tradingdesktops} alt="Professional Trading Environment" className="rounded shadow-m" />
                        </div>
                    </div>
                </section>



                <footer className="footer-main bg-gradient-primary dark overlay-shape-06 py-5">
                    <div className="container">
                        {/* 1. CTA Card Section */}
                        <div className="row justify-content-center mb-5 pb-5">
                            <div className="col-xl-10">
                                <div className="card card-content dark p-4 p-md-5 rounded-4 border-0 shadow-lg" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1) !important" }}>
                                    <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between gap-4">
                                        <div className="d-flex flex-column flex-md-row align-items-center text-center text-md-start">
                                            <div className="bg-white bg-opacity-10 p-3 rounded-4 mb-3 mb-md-0 me-md-4 d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: "70px", height: "70px" }}>
                                                <img src={logoVoiled} alt="Trrader Logo" style={{ width: "40px" }} />
                                            </div>
                                            <div>
                                                <h2 className="text-white fw-bold mb-1" style={{ fontSize: "1.75rem" }}>Ready to master your risk?</h2>
                                                <p className="paragraph opacity-75 mb-0" style={{ fontSize: "1rem" }}>Join thousands of traders protecting their capital.</p>
                                            </div>
                                        </div>
                                        <div onClick={signInWithGoogle} className="cursor-pointer flex-shrink-0 transition-transform hover-scale">
                                            <GoogleButton />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Main Footer Content */}
                        <div className="row g-5">
                            {/* Column 1: Brand Info (Left Side) */}
                            <div className="col-lg-4 mb-5 mb-lg-0 text-center text-lg-start">
                                <div className="d-flex align-items-center mb-4 justify-content-center justify-content-lg-start">
                                    <img src={logoVoiled} alt="Trrader Logo" style={{ width: 32 }} className="me-2" />
                                    <h4 className="text-white fw-bold mb-0">Trrader.in</h4>
                                </div>
                                <p className="text-white text-opacity-50 small mb-0 mx-auto mx-lg-0" style={{ maxWidth: "340px", lineHeight: "1.8", fontSize: "0.95rem" }}>
                                    Building institutional-grade risk management tools for the modern retail trader. Focus on precision, discipline, and longevity.
                                </p>
                            </div>
                            
                            {/* Spacing Column */}
                            <div className="col-lg-1 d-none d-lg-block"></div>

                            {/* Column 2: Platform Links & Contact (Middle) */}
                            <div className="col-lg-3 col-md-6 text-center text-lg-start">
                                <div className="mb-5">
                                    <h6 className="text-white text-uppercase tracking-widest mb-4 fw-bold" style={{ fontSize: "0.8rem", opacity: "0.7", letterSpacing: "1px" }}>Platform</h6>
                                    <ul className="list-unstyled mb-0">
                                        <li className="mb-3"><Link to={"/openpricing"} className="text-white text-opacity-75 text-decoration-none hover-white transition-all">Pricing</Link></li>
                                        <li className="mb-3"><Link to={"/"} className="text-white text-opacity-75 text-decoration-none hover-white transition-all">Home</Link></li>
                                    </ul>
                                </div>
                                
                                {/* Reach Out Section (Placed here) */}
                                <div>
                                    <h6 className="text-white text-uppercase tracking-widest mb-3 fw-bold" style={{ fontSize: "0.8rem", opacity: "0.7", letterSpacing: "1px" }}>Reach Out</h6>
                                    <p className="text-white text-opacity-60 small mb-1">Have specific questions?</p>
                                    <a href="mailto:trraderin@gmail.com" className="text-white fw-bold text-decoration-none hover-primary transition-all fs-5">trraderin@gmail.com</a>
                                </div>
                            </div>

                            {/* Column 3: Legal Links (Right) */}
                            <div className="col-lg-3 col-md-6 text-center text-lg-start ps-lg-5">
                                <h6 className="text-white text-uppercase tracking-widest mb-4 fw-bold" style={{ fontSize: "0.8rem", opacity: "0.7", letterSpacing: "1px" }}>Legal & Support</h6>
                                <ul className="list-unstyled mb-0">
                                    <li className="mb-3"><Link to={"/termsandconditions"} className="text-white text-opacity-75 text-decoration-none hover-white transition-all">Terms of Service</Link></li>
                                    <li className="mb-3"><Link to={"/privacypolicy"} className="text-white text-opacity-75 text-decoration-none hover-white transition-all">Privacy Policy</Link></li>
                                    <li className="mb-3"><Link to={"/faq"} className="text-white text-opacity-75 text-decoration-none hover-white transition-all">FAQ</Link></li>
                                </ul>
                            </div>
                        </div>

                        {/* 3. Bottom Bar */}
                        <div className="row mt-5 pt-5 border-top border-white border-opacity-10 align-items-center text-center">
                            <div className="col-md-6 text-md-start mb-2 mb-md-0">
                                <p className="text-white text-opacity-40 small mb-0 fw-light">
                                    © {new Date().getFullYear()} Trrader. All rights reserved.
                                </p>
                            </div>
                            <div className="col-md-6 text-md-end">
                                <p className="text-white text-opacity-40 small mb-0 fw-light opacity-75">
                                    Built by Trrader, for Trrader.
                                </p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </React.Fragment>
    );
};

export default withRouter(Landing);

Landing.propTypes = {
    history: PropTypes.object,
};