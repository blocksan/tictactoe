import React from 'react'
import { Container, Row } from 'reactstrap'
import Footer from '../../Layout/VerticalLayout/Footer'
import Header from '../../Layout/VerticalLayout/Header'

function PrivacyPolicy() {
    return (
        <React.Fragment>
            <Header></Header>

            <Row>
                <Container style={{ marginTop: "70px" }}>
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
                                    }}>At Decentralized Job Portal, we take the privacy of our users very seriously. This privacy policy explains how we collect, use, and protect the personal information of job seekers and employers who use our decentralized job platform.
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
                                        <li>We collect personal information such as names, contact information, resumes, and job preferences from job seekers who use our platform to search for job opportunities and create profiles.</li>
                                        <li>Employers who use our platform to post job listings and search for job candidates also provide personal information such as company information and contact information.</li>
                                        <li>We use this information to match job seekers with job openings, to communicate with job seekers and employers, and to improve our services</li>
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
                                        <li>We use smart contracts to ensure that all job seekers and employers are verified before they can access the platform.</li>
                                        <li>We use blockchain technology to ensure that all transactions on our platform are secure and transparent.</li>
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
                                        <li>Job seekers and employers can access and update their personal information by logging into their account on our platform.</li>
                                        <li>Users can also contact us directly to request access to or updates to their personal information.</li>
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
                                        <li>We comply with all applicable laws and regulations related to data protection, including the General Data Protection Regulation (GDPR) in the European Union.</li>
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
                                        If you have any questions or concerns about this privacy policy, please contact us at <strong>contact@onchaincareer.io</strong>
                                    </p>

                                </div>

                            </div>
                        </section>
                    </div>
                </Container>

                <Footer></Footer>
            </Row>

        </React.Fragment>
    )
}

export default PrivacyPolicy