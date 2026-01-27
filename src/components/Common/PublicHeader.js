import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React from "react";
import { connect, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logoVoiled from "../../assets/images/OnlyLogoVoiled.png";
import { getFirebaseApp } from "../../helpers/firebase_helper";
import { socialLogin } from "../../store/actions";
import GoogleButton from "./GoogleButton";

import { Container, Navbar, NavbarBrand } from "reactstrap";

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
            <Navbar 
                expand="lg" 
                fixed="top" 
                className="header-main dark border-bottom border-secondary border-opacity-10 py-3" 
                style={{ backgroundColor: "#1e1b3a", backdropFilter: "blur(10px)", transition: "all 0.3s ease" }}
            >
                <Container className="d-flex align-items-center justify-content-between">
                    <NavbarBrand tag={Link} to="/" className="d-flex align-items-center text-decoration-none gap-3 m-0">
                        <div className="bg-white bg-opacity-10 rounded-3 p-1 d-flex align-items-center justify-content-center" style={{ width: "48px", height: "48px" }}>
                            <img src={logoVoiled} alt="Trrader Logo" style={{ height: "36px", filter: "brightness(1.1)" }} />
                        </div>
                        <div className="d-flex flex-column justify-content-center">
                            <h4 className="m-0 fw-bold fs-5 text-white lh-1" style={{ letterSpacing: "-0.5px" }}>Trrader.in</h4>
                            {props.user?.isPremiumUser ? (
                                <div className="d-flex align-items-center mt-1">
                                    <span className="badge bg-soft-warning text-warning fw-bold px-2 py-1" style={{ fontSize: "0.65rem", letterSpacing: "0.05em" }}>
                                        <i className="bx bxs-crown me-1"></i> PREMIUM
                                    </span>
                                </div>
                            ) : (
                                <div className="d-flex flex-column">
                                    <span className="text-white text-opacity-50 small fw-medium mt-1" style={{ fontSize: "0.75rem" }}> Built By Trrader, For Trrader</span>
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
                    </NavbarBrand>
                    
                    <div className="d-flex align-items-center gap-4">
                        <Link to="/openpricing" className="text-white text-opacity-75 text-decoration-none fw-medium hover-white transition-all" style={{ fontSize: "0.95rem" }}>Pricing</Link>
                        <div onClick={signInWithGoogle} className="transition-transform hover-scale cursor-pointer" style={{ cursor: "pointer" }}>
                            <GoogleButton />
                        </div>
                    </div>
                </Container>
            </Navbar>
        </React.Fragment>
    );
};

const mapStateToProps = state => {
    return { ...state.login };
  };

export default connect(mapStateToProps,{})(PublicHeader);
