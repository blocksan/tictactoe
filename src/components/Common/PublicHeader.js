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
            <div className="header-main dark" style={{ backgroundColor: "#272544" }}>
                <nav>
                    <div className="nav-toggle"></div>
                    <ul className="inline left logo-nav">
                        <Link to="/" style={{ display: "flex", alignItems: "center", color: "white", textDecoration: "none" }}>
                            <img src={logoVoiled} alt="" style={{ width: 60 }} />
                            <div>
                                <h4 style={{ color: "white", marginBottom: 0 }}>Trrader.in</h4>
                                {props.user?.isPremiumUser ? (
                                     <h6 style={{ color: "#FFD700", fontSize: "0.9em", fontWeight: "bold", textTransform: "uppercase", marginTop: "5px" }}>(Premium)</h6>
                                ) : (
                                    <h6 style={{ color: "white", fontSize: "0.9em", fontWeight: "normal" }}>Built by Trrader, for Trrader</h6>
                                )}
                            </div>
                        </Link>
                    </ul>
                    <ul className="inline right">
                        <li><a href="/openpricing">Pricing</a></li>
                        <li>
                            <span onClick={signInWithGoogle} style={{ cursor: "pointer" }}>
                                <GoogleButton />
                            </span>
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
