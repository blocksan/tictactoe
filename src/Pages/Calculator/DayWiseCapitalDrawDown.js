import React from 'react';
import LineColumnArea from './LineColumnArea';
import ReactHtmlParser from 'react-html-parser';
import {
    Card,
    CardBody,
    Col,
    Row
} from "reactstrap";

// import { OverViewData } from '../../CommonData/Data/index';


const DayWiseCapitalDrawDown = (props) => {
    return (
        <React.Fragment>
            <Col xl={12}>
                <Card>
                    <CardBody>
                        <div className="d-flex align-items-center">
                            <div className="flex-grow-1">
                                <h5 className="card-title" style={{fontWeight:"normal"}}>{ReactHtmlParser(props.title)}</h5>

                            </div>
                            <div className="flex-shrink-0">
                                {/* <div>
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
                                </div> */}
                            </div>
                        </div>
                        <div>
                            <LineColumnArea drawDownMetrics = {props.drawDownMetrics}/>
                        </div>
                    </CardBody>
                    <CardBody style={{background:"rgb(236 251 255)"}}>
                        <div className="text-muted text-center">
                            <Row className='offset-md-0'>
                                {props.calculatedMetadata.map((item, key) => (
                                  <Col md={3} key={key} style={{borderRight:"1px solid black",borderColor:"black"}}>
                                    <div className={item.makeDanger == 'true' ? 'chart-bottom-card-danger':''} style={{height:"70px"}}>
                                        <p className="mb-1"><i className={"mdi mdi-circle font-size-12 me-1 text-" + item.color}></i> {item.title}</p>
                                        <h5 className="font-size-16 mb-0 chart-bottom-card-danger-text">{ReactHtmlParser(item.count)} <span className="text-danger font-size-12">
                                            {item.percentage && <><i className="mdi mdi-menu-down font-size-14 me-1"></i>{item.percentage} %</>
                                            }
                                            </span>
                                            
                                            </h5>
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

export default DayWiseCapitalDrawDown;