import React from 'react';
import LineColumnArea from './LineColumnArea';

import {
    Card,
    CardBody,
    Col,
    Row,
    InputGroup,
    Button
} from "reactstrap";

import { OverViewData } from '../../CommonData/Data/index';


const OverView = () => {
    return (
        <React.Fragment>
            <Col xl={12}>
                <Card>
                    <CardBody>
                        <div className="d-flex align-items-center">
                            <Row>
                                <div className="d-flex d-lg-block">
                                    <h5 className="card-title">Overview</h5>
                                </div>
                            </Row>
                            </div>
                            <div className="d-flex align-items-center">
                            <div className="flex-grow-1">
                                <Row>
                                    <Col >
                                    <form className="app-search d-none d-lg-block">
                                    <div className="position-relative">
                                        <InputGroup>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search..."
                                            />
                                            <Button>
                                                Select Symbol
                                            </Button>
                                        </InputGroup>

                                    </div>
                                </form>
                                    </Col>
                                </Row>
                                
                            </div>
                            <div className="flex-shrink-0">
                                <div>
                                    <button type="button" className="btn btn-soft-secondary btn-sm me-1">
                                        ALL
                                    </button>
                                    <button type="button" className="btn btn-soft-primary btn-sm me-1">
                                        1M
                                    </button>
                                    <button type="button" className="btn btn-soft-secondary btn-sm me-1">
                                        6M
                                    </button>
                                    <button type="button" className="btn btn-soft-secondary btn-sm me-1 active">
                                        1Y
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div>
                            <LineColumnArea />
                        </div>
                    </CardBody>
                    <CardBody className="border-top">
                        <div className="text-muted text-center">
                            <Row>
                                {OverViewData.map((item, key) => (<Col md={4} key={key} className="border-end">
                                    <div>
                                        <p className="mb-2"><i className={"mdi mdi-circle font-size-12 me-1 text-" + item.color}></i> {item.title}</p>
                                        <h5 className="font-size-16 mb-0">$ {item.count} <span className="text-success font-size-12"><i className="mdi mdi-menu-up font-size-14 me-1"></i>{item.percentage} %</span></h5>
                                    </div>
                                </Col>))}
                            </Row>
                        </div>
                    </CardBody>
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default OverView;