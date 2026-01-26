import React from 'react'
import { Container, Row } from 'reactstrap'


function PrivacyPolicy() {
    return (
        <React.Fragment>


            <Row>
                <Container fluid={true} style={{marginTop:"120px"}}>
                    <div className="container">
                        <section id="terms-of-service" className="mt-10">
                            <div
                                class="card"
                                style={{
                                    padding: "2rem",
                                    backgroundColor: "white",
                                }}
                            >
                                <h2
                                    style={{
                                        textAlign: "left",
                                        paddingBottom: "2rem",
                                        color: "black",
                                        fontWeight: "600",
                                        fontSize: "2.2rem",
                                    }}
                                >
                                    Privacy Policy
                                </h2>
                                <div
                                    style={{
                                        color: "black",
                                        fontSize: "22px",
                                    }}
                                >
                                    <p style={{
                                        color: "black",
                                        fontSize: "1rem",
                                    }}>At <strong>Trrader.in</strong>, we take the privacy of our users very seriously. This privacy policy explains how we collect, use, and protect the personal information of users.
                                    </p>
                                    <br></br>
                                    <h3 style={{
                                        fontWeight: "600",
                                        color: "black",
                                        fontSize: "1.25rem",

                                    }}>Information Collection and Use</h3>
                                    <br></br>
                                    <ul style={{
                                        color: "black",
                                        fontSize: "1rem",
                                    }}>
                                        <li>We collect personal information which includes only names, email, and profile from users to create the profile.</li>
                                        <li>We do not use this information for any other purpose except creating the user account</li>
                                    </ul>
                                    <br></br>
                                    <h3 style={{
                                        fontWeight: "600",
                                        color: "black",
                                        fontSize: "1.25rem",
                                    }}>Information Sharing</h3>
                                    <br></br>
                                    <ul style={{
                                        color: "black",
                                        fontSize: "1rem",
                                    }}>
                                        <li>We do not share personal information with third parties without the consent of the user, except as required by law or to comply with legal process.</li>
                                    </ul>
                                    <br></br>
                                    <h3 style={{
                                        fontWeight: "600",
                                        color: "black",
                                        fontSize: "1.25rem",
                                    }}>Information Protection</h3>
                                    <br></br>
                                    <ul style={{
                                        color: "black",
                                        fontSize: "1rem",
                                    }}>
                                        <li>We use state-of-the-art encryption and security measures to protect personal information from unauthorized access, use, or disclosure.
                                        </li>
                                        <li>
                                            We have implemented a comprehensive security program to protect against data breaches, unauthorized access, and other potential security risks.
                                        </li>
                                        <li>
                                            We regularly review and update our security measures to ensure that personal information remains protected at all times.
                                        </li>
                                    </ul>
                                    <br></br>
                                    <h3 style={{
                                        fontWeight: "600",
                                        color: "black",
                                        fontSize: "1.25rem",
                                    }}>Accessing and Updating Personal Information</h3>
                                    <br></br>
                                    <ul style={{
                                        color: "black",
                                        fontSize: "1rem",
                                    }}>
                                        <li>Users can always login to the account using the email, there is no other method we support as of now</li>
                                    </ul>
                                    <br></br>
                                    <h3 style={{
                                        fontWeight: "600",
                                        color: "black",
                                        fontSize: "1.25rem",
                                    }}>Compliance with Laws and Regulations</h3>
                                    <br></br>
                                    <ul style={{
                                        color: "black",
                                        fontSize: "1rem",
                                    }}>
                                        <li>We comply with all applicable laws and regulations related to data protection.</li>
                                    </ul>
                                    <br></br>
                                    <h3 style={{
                                        fontWeight: "600",
                                        color: "black",
                                        fontSize: "1.25rem",
                                    }}>Changes to this Privacy Policy</h3>
                                    <br></br>
                                    <ul style={{
                                        color: "black",
                                        fontSize: "1rem",
                                    }}>
                                        <li>We may update this privacy policy from time to time to reflect changes in our practices and services.</li>
                                    </ul>
                                    <br></br>
                                    <h3 style={{
                                        fontWeight: "600",
                                        color: "black",
                                        fontSize: "1.25rem",
                                    }}>Contact Us</h3>
                                    <br></br>
                                    <p style={{
                                        color: "black",
                                        fontSize: "1rem",
                                    }}>
                                        If you have any questions or concerns about this privacy policy, please contact us at <strong>trraderin@gmail.com</strong>
                                    </p>

                                </div>

                            </div>
                        </section>
                    </div>
                </Container>


            </Row>

        </React.Fragment>
    )
}

export default PrivacyPolicy