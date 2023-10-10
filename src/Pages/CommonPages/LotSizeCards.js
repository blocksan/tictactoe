import React from 'react'
import { BANKNIFTY_LOT_SIZE, FINNIFTY_LOT_SIZE, NIFTY50_LOT_SIZE } from '../../constants/NSE_index'
import {
    Row,
    Col,
    Card,
    CardBody,
    FormGroup,
    Button,
    CardTitle,
    CardSubtitle,
    Label,
    Input,
    Container,
    FormFeedback,
    Form,
    CardText,
    CardHeader,
    UncontrolledAlert,
    Progress
  } from "reactstrap";
function LotSizeCards() {
  return (
    <Row>
                                                <Col xl="6" md="4">
                                                    <Card xl="2" className="metrics-card metrics-card-raw-info">

                                                        <CardBody>
                                                            <p className="mb-4 card-info-header">BANKNIFTY </p>
                                                            <CardText className="metric-number">
                                                                {BANKNIFTY_LOT_SIZE} <span className="sub-metric-number">Qty</span>
                                                            </CardText>
                                                            <span>1 Lot Size</span>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                                <Col xl="6" md="4">
                                                    <Card xl="2" className="metrics-card metrics-card-raw-info">

                                                        <CardBody>
                                                            <p className="mb-4 card-info-header">FINNIFTY </p>
                                                            <CardText className="metric-number">
                                                                {FINNIFTY_LOT_SIZE} <span className="sub-metric-number">Qty</span>
                                                            </CardText>
                                                            <span>1 Lot Size</span>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                                <Col xl="6" className="offset-xl-3" md="4" >
                                                    <Card className="metrics-card metrics-card-raw-info" xl="2">

                                                        <CardBody>
                                                            <p className="mb-4 card-info-header">NIFTY 50 </p>
                                                            <CardText className="metric-number">
                                                                {NIFTY50_LOT_SIZE} <span className="sub-metric-number">Qty</span>
                                                            </CardText>
                                                            <span>1 Lot Size</span>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            </Row>
  )
}

export default LotSizeCards