import React, { useState } from 'react'
import { Row, Col, Card, CardBody, Collapse, CardTitle, Container } from 'reactstrap'
import classnames from "classnames";
import Footer from '../../Layout/VerticalLayout/Footer';
import Header from '../../Layout/VerticalLayout/Header';

function Faq() {
    const [col1, setcol1] = useState(true);
    const [col2, setcol2] = useState(false);
    const [col3, setcol3] = useState(false);

    const [col5, setcol5] = useState(true);
    const [col6, setcol6] = useState(true);
    const [col7, setcol7] = useState(true);

    const [col9, setcol9] = useState(true);
    const [col10, setcol10] = useState(false);
    const [col11, setcol11] = useState(false);
    const t_col9 = () => {
        setcol9(!col9);
        setcol10(false);
        setcol11(false);
    };

    const t_col10 = () => {
        setcol10(!col10);
        setcol9(false);
        setcol11(false);
    };

    const t_col11 = () => {
        setcol11(!col11);
        setcol10(false);
        setcol9(false);
    };
    return (
        <React.Fragment>
            <Header></Header>
            <Row>
                <Container style={{ marginTop: "70px" }}>
                    <div className="container">
                        <Col xl={12}>
                            <Card>
                                <CardBody>
                                    <Row>
                                        <Col lg={12}>
                                            <CardTitle className="h4">Accordion Flush</CardTitle>
                                            <p className="card-title-desc">
                                                Add <code>.accordion-flush</code> to remove the default{" "}
                                                <code>background-color</code>, some borders, and some
                                                rounded corners to render accordions edge-to-edge with
                                                their parent container.
                                            </p>

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
                                                                { collapsed: !col9 }
                                                            )}
                                                            type="button"
                                                            onClick={t_col9}
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                            Accordion Item #1
                                                        </button>
                                                    </h2>

                                                    <Collapse
                                                        isOpen={col9}
                                                        className="accordion-collapse"
                                                    >
                                                        <div className="accordion-body">
                                                            <div className="text-muted">
                                                                Anim pariatur cliche reprehenderit, enim eiusmod
                                                                high life accusamus terry richardson ad squid. 3
                                                                wolf moon officia aute, non cupidatat skateboard
                                                                dolor brunch. Food truck quinoa nesciunt laborum
                                                                eiusmod. Brunch 3 wolf moon tempor, sunt aliqua
                                                                put a bird on it squid single-origin coffee
                                                                nulla assumenda shoreditch et. Nihil anim
                                                                keffiyeh helvetica, craft beer labore wes
                                                                anderson cred nesciunt sapiente ea proident. Ad
                                                                vegan excepteur butcher vice.
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
                                                                { collapsed: !col10 }
                                                            )}
                                                            type="button"
                                                            onClick={t_col10}
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                            Accordion Item #2
                                                        </button>
                                                    </h2>

                                                    <Collapse
                                                        isOpen={col10}
                                                        className="accordion-collapse"
                                                    >
                                                        <div className="accordion-body">
                                                            <div className="text-muted">
                                                                Anim pariatur cliche reprehenderit, enim eiusmod
                                                                high life accusamus terry richardson ad squid. 3
                                                                wolf moon officia aute, non cupidatat skateboard
                                                                dolor brunch. Food truck quinoa nesciunt laborum
                                                                eiusmod. Brunch 3 wolf moon tempor, sunt aliqua
                                                                put a bird on it squid single-origin coffee
                                                                nulla assumenda shoreditch et. Nihil anim
                                                                keffiyeh helvetica, craft beer raw denim
                                                                aesthetic synth nesciunt you probably haven't
                                                                heard of them accusamus labore.
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
                                                                { collapsed: !col11 }
                                                            )}
                                                            type="button"
                                                            onClick={t_col11}
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                            Accordion Item #3
                                                        </button>
                                                    </h2>
                                                    <Collapse
                                                        isOpen={col11}
                                                        className="accordion-collapse"
                                                    >
                                                        <div className="accordion-body">
                                                            <div className="text-muted">
                                                                Anim pariatur cliche reprehenderit, enim eiusmod
                                                                high life accusamus terry richardson ad squid. 3
                                                                wolf moon officia aute, non cupidatat skateboard
                                                                dolor brunch. Food truck quinoa nesciunt laborum
                                                                eiusmod. Brunch 3 wolf moon tempor, sunt aliqua
                                                                put a bird on it squid single-origin coffee
                                                                nulla assumenda shoreditch et. Nihil anim
                                                                keffiyeh helvetica, craft beer labore wes
                                                                anderson cred nesciunt sapiente ea proident.
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
                <Footer></Footer>
            </Row>
        </React.Fragment>
    )
}

export default Faq