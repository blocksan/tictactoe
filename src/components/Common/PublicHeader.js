import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React from "react";
import { connect, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logoVoiled from "../../assets/images/OnlyLogoVoiled.png";
import { getFirebaseApp } from "../../helpers/firebase_helper";
import { socialLogin } from "../../store/actions";
import GoogleButton from "./GoogleButton";

const PublicHeader = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const firebaseApp = getFirebaseApp();
    const firebaseAuth = getAuth(firebaseApp);
    const provider = new GoogleAuthProvider();

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(firebaseAuth, provider);
            const user = result.user;
            const postData = {
                name: user.displayName,
                email: user.email,
                picture: user.photoURL,
                uid: user.uid,
            };
            dispatch(socialLogin(postData, navigate, "google"));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <React.Fragment>
            <div className="landing">
                <div className="header-main dark border-bottom border-secondary border-opacity-10" style={{ backgroundColor: "#1e1b3a", backdropFilter: "blur(10px)" }}>
                    <nav className="container-fluid px-lg-5">
                        <div className="nav-toggle"></div>
                        <ul className="inline left logo-nav">
                            <Link to="/" className="d-flex align-items-center text-decoration-none">
                                <div className="logo-wrapper bg-white bg-opacity-10 rounded-3 p-1 me-3">
                                    <img src={logoVoiled} alt="Trrader Logo" style={{ width: 48, filter: "brightness(1.1)" }} />
                                </div>
                                <div>
                                    <h4 className="text-white fw-bold mb-0 tracking-tight">Trrader.in</h4>
                                    {props.user?.isPremiumUser ? (
                                        <div className="d-flex align-items-center mt-1">
                                            <span className="badge bg-soft-warning text-warning fw-bold px-2 py-1" style={{ fontSize: "0.65rem", letterSpacing: "0.05em" }}>
                                                <i className="bx bxs-crown me-1"></i> PREMIUM
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="d-flex flex-column">
                                            <h6 className="text-white text-opacity-50 fw-medium small mb-0" style={{ fontSize: "0.75rem" }}>Professional Risk Management</h6>
                                            {props.user && props.user.freeTrialConfig && (
                                                <div className="d-flex align-items-center mt-1">
                                                    <span className="text-warning small fw-bold d-flex align-items-center" style={{ fontSize: "0.7rem" }}>
                                                        TRIAL CREDITS : 
                                                        <span className="bg-warning text-dark rounded-pill px-2 ms-2 fw-black" style={{ fontSize: "0.75rem" }}>
                                                            {Math.max(0, 10 - Object.values(props.user.freeTrialConfig).reduce((a, b) => a + b, 0))}
                                                        </span>
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        </ul>
                        <ul className="inline right d-flex align-items-center">
                            <li className="me-4 d-none d-md-block"><a href="/openpricing" className="text-white text-opacity-75 text-decoration-none fw-medium hover-white transition-all">Pricing</a></li>
                            <li>
                                <div onClick={signInWithGoogle} className="transition-transform hover-scale">
                                    <GoogleButton />
                                </div>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </React.Fragment>
    );
};

const mapStateToProps = state => {
    return { ...state.login };
  };

export default connect(mapStateToProps,{})(PublicHeader);
