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
                                    <h1 className="hero text-white" style={{fontSize:"2em", lineHeight:"1em"}}>Manage your Risk today, to Trade tomorrow.</h1>
                                    {/* <p className="lead"></p> */}
                                    <p className="lead">A lightweight tool suite for Traders which helps you to visualize your losses and targets based on your capital.</p>
                                    
                                    <span onClick={signInWithGoogle}>
                                        <GoogleButton></GoogleButton>
                                    </span>
                                    {/* <a href="signup.html" className="button button-primary space-top" role="button">Get Started</a> */}
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
                                <h3 style={{ color: "white" }}>Risk Calculator</h3>
                                <p className="paragraph">You just need to feed the inputs like Trading Capital, Trading Sessions, Max SL count, Target Ratio, etc... </p>
                            </div>
                            <div className="col-one-half">
                                <img className="rounded shadow-l" src={riskcalculator} alt="Risk Calculator" />
                            </div>
                        </div>
                        <div className="row max-width-l reverse-order">
                            <div className="col-one-half">
                                <img className="rounded shadow-l" src={riskcalculatorresult} alt="Sketch" />
                            </div>
                            <div className="col-one-half middle">
                                <h3 style={{ color: "white" }}>Capital Drawdown graph</h3>
                                <p className="paragraph">Gives you insight on your trading capital. Information like how many days you can survive, what maximum SL you should take, and many other useful metrics to improve you as a trader.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-gradient-light -margin-bottom-2 overlay padding">
                    <div className="center max-width-m">
                        <h2>Trrader.in</h2>
                        <p className="paragraph">At Trrader.in, we're on a mission to ensure that traders like you not only survive but thrive in the dynamic world of financial markets. Trading isn't just about today's wins; it's about building a lasting presence in the market, securing your financial future, and achieving long-term success. Our exceptional Risk Management Tool is your key to this journey. It's not just about risk mitigation; it's about <strong>maintaining your position in the market for years</strong> to come.</p>
                    </div>
                    <div className="margin-top max-width-l">
                        <img className="rounded shadow-l" src={productOverview} alt="Opalin Dashboard" />
                    </div>
                </section>

                <section className="bg-gradient-dark center dark padding">
                    {/* <div className="margin-top max-width-l">
                        <div className="margin-bottom max-width-m">
                            <h3>Over 20,000 Paying Customers</h3>
                            <p className="opacity-m paragraph">Thousands of the most successful companies rely on our service.</p>
                        </div>
                        <div className="row min-two-columns">
                            <div className="col-one-fourth">
                                <img src="media/content/trusted-company-dark.png" srcset="media/content/trusted-company-dark.png 1x, media/content/trusted-company-dark@2x.png 2x" alt="Trusted Company" />
                            </div>
                            <div className="col-one-fourth">
                                <img src="media/content/trusted-company-dark.png" srcset="media/content/trusted-company-dark.png 1x, media/content/trusted-company-dark@2x.png 2x" alt="Trusted Company" />
                            </div>
                            <div className="col-one-fourth">
                                <img src="media/content/trusted-company-dark.png" srcset="media/content/trusted-company-dark.png 1x, media/content/trusted-company-dark@2x.png 2x" alt="Trusted Company" />
                            </div>
                            <div className="col-one-fourth">
                                <img src="media/content/trusted-company-dark.png" srcset="media/content/trusted-company-dark.png 1x, media/content/trusted-company-dark@2x.png 2x" alt="Trusted Company" />
                            </div>
                        </div>
                        <img className="margin-top rounded shadow-l" src="media/content/customers.jpg" srcset="media/content/customers.jpg 1x, media/content/customers@2x.jpg 2x" alt="Customers" />
                    </div> */}
                </section>

                <section className="padding">
                    <div className="max-width-l">
                        <div className="center">
                            {/* <h2>Timeline</h2> */}
                            <p className="paragraph">A successful trader can vary significantly from person to person and depends on various factors, including your starting point, Goals, <strong>Risk Management</strong> and the Trading Strategies you choose.</p>
                        </div>
                        {/* <div className="row margin-top timeline">
                            <div className="col-one-fourth">
                                <h5>Research</h5>
                                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.</p>
                            </div>
                            <div className="col-one-fourth">
                                <h5>Ideation</h5>
                                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur mollit.</p>
                            </div>
                            <div className="col-one-fourth">
                                <h5>Development</h5>
                                <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                            </div>
                            <div className="col-one-fourth">
                                <h5>Launch</h5>
                                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>
                            </div>
                        </div> */}
                    </div>
                </section>

                <section className="bg-light center">
                    <div className="row no-gutter">
                        <div className="col-one-half middle padding">
                            <div className="max-width-m">
                                <p className="paragraph">Marty Schwartz:</p>
                                <h3>"Learn to take losses. The most important thing in making money is not letting your losses get out of hand!"</h3>
                                <br />
                                <br />
                                <img src={logoVoiled} alt="" />
                            </div>
                        </div>
                        <div className="col-one-half middle padding">
                            <img src={tradingdesktops} alt="Trading with desktops" />
                        </div>
                        {/* <div className="col-one-half bg-image-03 padding-bottom padding-top"></div> */}
                    </div>
                </section>

                <section className="bg-gradient-light">
                    <div className="center max-width-l">
                        {/* <h2>How to use the Risk Management Calculator ?</h2> */}
                        {/* <p className="paragraph">It is as simple as </p> */}
                    </div>
                    {/* <div className="row margin-top max-width-l">
                        <div className="col-one-fourth card card-content">
                            <p className="muted">Step 1</p>
                            <h4>Download</h4>
                            <p className="paragraph">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        </div>
                        <div className="col-one-fourth card card-content">
                            <p className="muted">Step 2</p>
                            <h4>Customize</h4>
                            <p className="paragraph">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur mollit.</p>
                        </div>
                        <div className="col-one-fourth card card-content">
                            <p className="muted">Step 3</p>
                            <h4>Upload</h4>
                            <p className="paragraph">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        </div>
                        <div className="col-one-fourth card card-content dark">
                            <p className="muted">Step 4</p>
                            <h4>Done!</h4>
                            <p className="paragraph">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.</p>
                        </div>
                    </div> */}
                    {/* <div className="center margin-top max-width-l">
                        <span className="muted">If you need any help, make sure to </span><a href="signup.html">book a demo</a><span className="muted">.</span>
                    </div> */}
                </section>


                <footer className="footer-main bg-gradient-primary dark overlay-shape-06">
                    <div className="padding">
                        <div className="center margin-bottom max-width-m">
                            <h3 className="text-white">Trade with skills, knowledge and better risk management</h3>
                            <p className="paragraph"> Tool suite which can you help you to minimise your loss and can keep you longer in the market.</p>
                        </div>
                        <div className="center margin-bottom max-width-l">
                        </div>
                        <div className="card card-content dark margin-bottom max-width-l">
                            <form className="row reduce-spacing">
                            <div className="col-two-thirds center-tablet middle">
                                    <div style={{ display: "flex", alignItems: "center", color: "white"}}>
                                    <img src={logoVoiled} alt="" style={{ width: 60 }} />
                                    <div>
                                    </div>
                                           <div style={{marginLeft:"10px"}}>
                                                <h3 className="space-none text-white">Ready to get started?</h3>
                                                <p className="paragraph">Manage your risk today, to trade tomorrow.</p>
                                            </div>
                                </div>
                                </div>
                                <div className="col-one-third middle">
                                    <span onClick={signInWithGoogle}>
                                        <GoogleButton></GoogleButton>
                                    </span>
                                </div>
                            </form>
                        </div>
                        <div className="row max-width-l">
                            <div className="col-one-half">
                                <h6 className="text-white">Trrader ®</h6>
                                <p className="text-white text-opacity-50">Precision risk management tools designed for modern traders. Built to protect your capital and optimize your performance.</p>
                            </div>
                            <div className="col-one-half">
                                <h6 className="text-white">Resources</h6>
                                <ul className="blank">
                                    <li><Link to={"/openpricing"} style={{color:"white"}}>Pricing</Link></li>
                                    <li><Link to={"/termsandconditions"} style={{color:"white"}}>Terms & Conditions</Link></li>
                                    <li><Link to={"/faq"} style={{color:"white"}}>FAQ</Link></li>
                                    <li><Link to={"/privacypolicy"} style={{color:"white"}}>Privacy & Policy</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <p className="copyright"><span>Product by Trrader, for Trrader</span><span> © 2023, all rights reserved.</span></p>
                </footer>
            </div>
        </React.Fragment>
    );
};

export default withRouter(Landing);

Landing.propTypes = {
    history: PropTypes.object,
};