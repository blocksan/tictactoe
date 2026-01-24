import classnames from "classnames";
import React, { useState } from 'react';
import { Card, CardBody, Col, Collapse, Container, Row } from 'reactstrap';


function Faq() {
    const [col1, setcol1] = useState(true);
    const [col2, setcol2] = useState(false);
    const [col3, setcol3] = useState(false);
    const [col4, setcol4] = useState(false);
    const [col5, setcol5] = useState(false);
    const [col6, setcol6] = useState(false);
    const [col7, setcol7] = useState(false);
    const [col8, setcol8] = useState(false);
    const [col9, setcol9] = useState(false);

    const t_col1 = () => {
        disableAllCols();
        setcol1(!col1);
    }

    const t_col2 = () => {
        disableAllCols();
        setcol2(!col2);
    };

    const t_col3 = () => {
        disableAllCols();
        setcol3(!col3);
    };

    const t_col4 = () => {
        disableAllCols();
        setcol4(!col4);
    };

    const t_col5 = () => {
        disableAllCols();
        setcol5(!col5);
    };

    const t_col6 = () => {
        disableAllCols();
        setcol6(!col6);
    };

    const t_col7 = () => {
        disableAllCols();
        setcol7(!col7);
    };

    const t_col8 = () => {
        disableAllCols();
        setcol8(!col8);
    };

    const t_col9 = () => {
        disableAllCols();
        setcol9(!col9);
    };

    const disableAllCols = () => {
        setcol1(false);
        setcol2(false);
        setcol3(false);
        setcol4(false);
        setcol5(false);
        setcol6(false);
        setcol7(false);
        setcol8(false);
        setcol9(false);
    }

    return (
        <React.Fragment>

            <Row>
                <Container style={{ marginTop: "120px", minHeight:"75vh" }}>
                    <div className="container">
                        <Col xl={12}>
                            <Card>
                                <CardBody>
                                    <Row>
                                        <Col lg={12}>
                                        <h2
                  class="primary-heading"
                  style={{
                    textAlign: "left",
                    paddingBottom: "2rem",
                    color: "black",
                    fontWeight: "600",
                    fontSize: "2.2rem",
                  }}
                >
                  FAQ
                </h2>
                                            <div
                                                className="accordion accordion-flush"
                                                id="accordionFlushExample"
                                            >
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingFlushOne">
                                                        <button
                                                            className={classnames(
                                                                "accordion-button",
                                                                "fw-medium",
                                                                { collapsed: !col1 }
                                                            )}
                                                            type="button"
                                                            onClick={t_col1}
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                            What is Trrader.in ?
                                                        </button>
                                                    </h2>

                                                    <Collapse
                                                        isOpen={col1}
                                                        className="accordion-collapse"
                                                    >
                                                        <div className="accordion-body">
                                                            <div className="text-muted">
                                                            A lightweight tool suite for Traders which helps you to visualize your losses and targets based on your capital.
                                                            </div>
                                                        </div>
                                                    </Collapse>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2 className="accordion-header" id="headingFlushTwo">
                                                        <button
                                                            className={classnames(
                                                                "accordion-button",
                                                                "fw-medium",
                                                                { collapsed: !col2 }
                                                            )}
                                                            type="button"
                                                            onClick={t_col2}
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                            How Do I Get Started?
                                                        </button>
                                                    </h2>

                                                    <Collapse
                                                        isOpen={col2}
                                                        className="accordion-collapse"
                                                    >
                                                        <div className="accordion-body">
                                                            <div className="text-muted">
                                                            To get started, visit our website and sign up for an account. Once you're registered, you can access our tools like Risk Management Tool and Target Calculator tool.
                                                            </div>
                                                        </div>
                                                    </Collapse>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2
                                                        className="accordion-header"
                                                        id="headingFlushThree"
                                                    >
                                                        <button
                                                            className={classnames(
                                                                "accordion-button",
                                                                "fw-medium",
                                                                { collapsed: !col3}
                                                            )}
                                                            type="button"
                                                            onClick={t_col3}
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                            What Types of Risks Can I Manage with&nbsp;<a href="https://trrader.in">Trrader.in</a>&nbsp;Tool suite?
                                                        </button>
                                                    </h2>
                                                    <Collapse
                                                        isOpen={col3}
                                                        className="accordion-collapse"
                                                    >
                                                        <div className="accordion-body">
                                                            <div className="text-muted">
                                                            <a href="https://trrader.in">Trrader.in</a> has different tools to manage your risk and targets. 
                                                            You can use our Risk Management Tool to calculate your risk based on your capital deployed in the stock market. 
                                                            You can use our Target Calculator tool to calculate your target based on your deployed capital in the stock market.
                                                            </div>
                                                        </div>
                                                    </Collapse>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2
                                                        className="accordion-header"
                                                        id="headingFlushThree"
                                                    >
                                                        <button
                                                            className={classnames(
                                                                "accordion-button",
                                                                "fw-medium",
                                                                { collapsed: !col4 }
                                                            )}
                                                            type="button"
                                                            onClick={t_col4}
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                            Is &nbsp; <a href="https://trrader.in">Trrader.in</a>&nbsp; Tool Suitable for retail traders and beginners?
                                                        </button>
                                                    </h2>
                                                    <Collapse
                                                        isOpen={col4}
                                                        className="accordion-collapse"
                                                    >
                                                        <div className="accordion-body">
                                                            <div className="text-muted">
                                                            <a href="https://trrader.in">Trrader.in</a> has been designed to help retail traders and beginners to manage their risk and targets based on their capital deployed in the stock market.
                                                            It's very easy to use the different tools available on <a href="https://trrader.in">Trrader.in</a> website. 
                                                            With minimal inputs, you can calculate your risk and targets on the capital.
                                                            </div>
                                                        </div>
                                                    </Collapse>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2
                                                        className="accordion-header"
                                                        id="headingFlushThree"
                                                    >
                                                        <button
                                                            className={classnames(
                                                                "accordion-button",
                                                                "fw-medium",
                                                                { collapsed: !col5 }
                                                            )}
                                                            type="button"
                                                            onClick={t_col5}
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                             Do You Offer Customer Support?
                                                        </button>
                                                    </h2>
                                                    <Collapse
                                                        isOpen={col5}
                                                        className="accordion-collapse"
                                                    >
                                                        <div className="accordion-body">
                                                            <div className="text-muted">
                                                           At <a href="https://trrader.in">Trrader.in</a> Yes, we offer customer support to assist you with any questions or issues you may have. Contact our support team at trraderin@gmail.com
                                                            </div>
                                                        </div>
                                                    </Collapse>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2
                                                        className="accordion-header"
                                                        id="headingFlushThree"
                                                    >
                                                        <button
                                                            className={classnames(
                                                                "accordion-button",
                                                                "fw-medium",
                                                                { collapsed: !col6 }
                                                            )}
                                                            type="button"
                                                            onClick={t_col6}
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                            Can I Upgrade or Change My Subscription Plan?
                                                        </button>
                                                    </h2>
                                                    <Collapse
                                                        isOpen={col6}
                                                        className="accordion-collapse"
                                                    >
                                                        <div className="accordion-body">
                                                            <div className="text-muted">
                                                            Yes, you can upgrade, change, or cancel your subscription plan at any time. Just log in to your account and manage your subscription preferences.
                                                            </div>
                                                        </div>
                                                    </Collapse>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2
                                                        className="accordion-header"
                                                        id="headingFlushThree"
                                                    >
                                                        <button
                                                            className={classnames(
                                                                "accordion-button",
                                                                "fw-medium",
                                                                { collapsed: !col7 }
                                                            )}
                                                            type="button"
                                                            onClick={t_col7}
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                            What Is Your Refund Policy?
                                                        </button>
                                                    </h2>
                                                    <Collapse
                                                        isOpen={col7}
                                                        className="accordion-collapse"
                                                    >
                                                        <div className="accordion-body">
                                                            <div className="text-muted">
                                                            Refund policies, if applicable, are outlined in your subscription agreement or on our website. Please review the refund policy carefully under the <a href="https://trrader.in/termsandconditions">Terms n Conditions</a> before making a payment.
                                                            </div>
                                                        </div>
                                                    </Collapse>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2
                                                        className="accordion-header"
                                                        id="headingFlushThree"
                                                    >
                                                        <button
                                                            className={classnames(
                                                                "accordion-button",
                                                                "fw-medium",
                                                                { collapsed: !col8 }
                                                            )}
                                                            type="button"
                                                            onClick={t_col8}
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                            Is Training Available for&nbsp;<a href="https://trrader.in">Trrader.in</a>&nbsp;Tool?
                                                        </button>
                                                    </h2>
                                                    <Collapse
                                                        isOpen={col8}
                                                        className="accordion-collapse"
                                                    >
                                                        <div className="accordion-body">
                                                            <div className="text-muted">
                                                            We assume that you are familiar with the basics of the stock market. The tools we have designed are very easy to use and you can start using them right away.
                                                            </div>
                                                        </div>
                                                    </Collapse>
                                                </div>
                                                <div className="accordion-item">
                                                    <h2
                                                        className="accordion-header"
                                                        id="headingFlushThree"
                                                    >
                                                        <button
                                                            className={classnames(
                                                                "accordion-button",
                                                                "fw-medium",
                                                                { collapsed: !col9 }
                                                            )}
                                                            type="button"
                                                            onClick={t_col9}
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                            How Do I Contact&nbsp;<a href="https://trrader.in">Trrader.in</a>&nbsp;Support?
                                                        </button>
                                                    </h2>
                                                    <Collapse
                                                        isOpen={col9}
                                                        className="accordion-collapse"
                                                    >
                                                        <div className="accordion-body">
                                                            <div className="text-muted">
                                                            You can reach our support team by writing at trraderin@gmail.com.
                                                            </div>
                                                        </div>
                                                    </Collapse>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </div>
                </Container>

            </Row>
        </React.Fragment>
    )
}

export default Faq