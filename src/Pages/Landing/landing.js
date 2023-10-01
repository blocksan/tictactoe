import React from "react";
import PropTypes from "prop-types";
import logoVoiled from "../../assets/images/OnlyLogoVoiled.png";
import withRouter from "../../components/Common/withRouter";
import { useDispatch } from "react-redux";
import { GoogleLogin } from '@react-oauth/google';
import mandrawing from "../../assets/images/mandrawing.png";
import riskcalculator from "../../assets/images/riskcalculator.png";
import riskcalculatorresult from "../../assets/images/riskcalculatorresult.png";
import productOverview from "../../assets/images/product-overview.png";
import tradingdesktops from "../../assets/images/tradingdesktopscompressed.png";
import { socialLogin } from "../../store/actions";
import jwt_decode from "jwt-decode";
//Import config
import { google } from "../../config";
import "./../../assets/scss/landing.scss";
const Landing = (props) => {
    const dispatch = useDispatch();
    const signIn = (res, type) => {
        if (type === "google" && res) {
            const postData = {
                name: res.name,
                email: res.email,
                picture: res.picture,
            };
            dispatch(socialLogin(postData, props.router.navigate, type));
        } else if (type === "facebook" && res) {
            const postData = {
                name: res.name,
                email: res.email,
                token: res.accessToken,
                idToken: res.jti,
            };
            dispatch(socialLogin(postData, props.router.navigate, type));
        }
    };

    //handleGoogleLoginResponse
    const googleResponse = response => {
        let user = jwt_decode(response.credential);
        const formattedResponse = {
            ...user
        }
        // console.log(formattedResponse,'--formattedResponse--')
        signIn(formattedResponse, "google");
    };
    return (
        <React.Fragment>

            <div className="landing">
                <div className="landing-header-main header-main dark">
                    <nav>
                        <div className="nav-toggle"></div>
                        <ul className="inline left">
                            <div style={{ display: "flex", alignItems: "center", color: "white" }}>
                                <img src={logoVoiled} alt="" style={{ width: 60 }} />
                                <div>
                                <h4 style={{ color: "white", marginBottom:0 }}>Trrader.in</h4>
                                <h6 style={{ color: "white", fontSize:"0.9em", fontWeight:"normal" }}>Built by Trader, for Trader</h6>
                                </div>
                            </div>
                        </ul>
                        <ul className="inline right">
                            {/* <li><a href="#">Pricing</a></li> */}
                            <li>

                                <GoogleLogin
                                    clientId={google.CLIENT_ID}
                                    render={renderProps => (
                                        <i className="mdi mdi-google" onClick={renderProps.onClick} />
                                    )}
                                    theme="filled_blue"
                                    shape="circle"
                                    useOneTap
                                    onSuccess={googleResponse}
                                    onFailure={() => { }}
                                />
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
                                    <h1 className="hero text-white" >Manage your Risk today, to Trade tomorrow.</h1>
                                    {/* <p className="lead"></p> */}
                                    <p className="lead">A lightweight tool suite which can you help you to minimise your loss and can keep you longer in the market.</p>
                                    <GoogleLogin
                                        className="button button-primary space-top" role="button" style={{ "maxWidth": "120px" }}
                                        clientId={google.CLIENT_ID}
                                        render={renderProps => (
                                            <i className="mdi mdi-google" onClick={renderProps.onClick} />
                                        )}
                                        theme="filled_blue"
                                        shape="circle"
                                        onSuccess={googleResponse}
                                        onFailure={() => { }}
                                    />
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
                        <h2>Present Your Product</h2>
                        <p className="paragraph">At Trrader, we're on a mission to ensure that traders like you not only survive but thrive in the dynamic world of financial markets. Trading isn't just about today's wins; it's about building a lasting presence in the market, securing your financial future, and achieving long-term success. Our exceptional Risk Management Tool is your key to this journey. It's not just about risk mitigation; it's about <strong>maintaining your position in the market for years</strong> to come.</p>
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
                            <p className="paragraph"> suite which can you help you to minimise your loss and can keep you longer in the market.</p>
                        </div>
                        <div className="center margin-bottom max-width-l">
                            {/* <div className="row margin-bottom min-two-columns">
                                <div className="col-one-fourth">
                                    <i className="feature-icons material-icons bg-gradient-pink">format_shapes</i>
                                    <h6>Minimal Design</h6>
                                </div>
                                <div className="col-one-fourth">
                                    <i className="feature-icons material-icons bg-gradient-cyan">network_check</i>
                                    <h6>Rocket Fast</h6>
                                </div>
                                <div className="col-one-fourth">
                                    <i className="feature-icons material-icons bg-gradient-green">line_style</i>
                                    <h6>Framework</h6>
                                </div>
                                <div className="col-one-fourth">
                                    <i className="feature-icons material-icons bg-gradient-indigo">check</i>
                                    <h6>HTML5 Valid</h6>
                                </div>
                            </div> */}
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
                                    <GoogleLogin
                                        clientId={google.CLIENT_ID}
                                        render={renderProps => (
                                            <i className="mdi mdi-google" onClick={renderProps.onClick} />
                                        )}
                                        theme="filled_blue"
                                        shape="circle"
                                        onSuccess={googleResponse}
                                        onFailure={() => { }}
                                    />
                                    {/* <a href="signup.html" className="button button-primary" role="button">Create An Account</a> */}
                                </div>
                            </form>
                        </div>
                        <div className="row center-desktop max-width-l">
                            <div className="col-two-fifths">
                            
                                {/* <h6>Trrader ®</h6> */}
                                {/* <p>Product by Trrader, for Trrader.</p> */}
                            </div>
                            <div className="col-one-fifth">
                                {/* <h6>Info</h6>
                                <ul className="blank">
                                    <li><a href="#">Getting Started</a></li>
                                    <li><a href="#">Resources</a></li>
                                    <li><a href="#">Design</a></li>
                                    <li><a href="#">Tutorials</a></li>
                                    <li><a href="#">Pricing</a></li>
                                </ul> */}
                            </div>
                            {/* <div className="col-one-fifth">
                                <h6>Support</h6>
                                <ul className="blank">
                                    <li><a href="#">Documentation</a></li>
                                    <li><a href="#">Requirements</a></li>
                                    <li><a href="#">License</a></li>
                                    <li><a href="#">Updates</a></li>
                                    <li><a href="#">Contact</a></li>
                                </ul>
                            </div> */}
                            <div className="col-one-fifth">
                                {/* <h6>Connect</h6>
                                <ul className="blank">
                                    <li><a href="#">Twitter</a></li>
                                    <li><a href="#">Facebook</a></li>
                                    <li><a href="#">Instagram</a></li>
                                    <li><a href="#">Medium</a></li>
                                </ul> */}
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
// export default withRouter(Login);

Landing.propTypes = {
    history: PropTypes.object,
};