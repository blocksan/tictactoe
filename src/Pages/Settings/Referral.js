import React from 'react'

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
  Progress,
  CardFooter,
  Toast,
  ToastHeader,
  ToastBody,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import logoVoiled from "../../assets/images/OnlyLogoVoiled.png";
const Referral = () => {
  const [toast, setToast] = React.useState(false);
  const toggleToast = () => {
    setToast(!toast);
    setTimeout(() => {
      setToast(false);
    }, 2000);
  }
  return (
    <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Settings" breadcrumbItem="Referral Link" />
                </Container>
                <Row>
                  <Col md="4" className='offset-md-4' >
                      <Card style={{minHeight:'320px', cursor:"pointer"}} color='info' className='card-info' onClick={() => {
                        navigator.clipboard.writeText("https://www.abc.com/ref/123456")
                        toggleToast();
                        }}>
                            <h6 className="card-header text-center">Referral Link</h6>
                          <CardBody style={{paddingTop:"100px"}}>
                              <CardText className='text-center'>Your referral link is</CardText>
                              <CardTitle className='text-center' style={{fontSize:"1.6em"}}>https://www.abc.com/ref/123456</CardTitle>
                              <CardSubtitle className='text-center'></CardSubtitle>
                          </CardBody>
                          <CardFooter className='text-center text-black'>
                            <span style={{fontSize:"1.2em"}}>Click to copy &nbsp; <i className='mdi mdi-content-copy'></i></span>
                          </CardFooter>
                      </Card>
                      <div
                        className="position-fixed top-0 left-0 end-0 p-3"
                        style={{ zIndex: "1005" }}
                      >
                        <Toast isOpen={toast}>
                          <ToastHeader toggle={toggleToast}>
                            <img
                              src={logoVoiled}
                              alt=""
                              className="me-2"
                              height="18"
                            />
                            Trrader.in
                          </ToastHeader>
                          <ToastBody color="primary">
                            Referral Link Copied Successfully
                          </ToastBody>
                        </Toast>
                      </div>
                  </Col>
                
                </Row>
                <Row>
                  <Col>
                  <br />
                  <br />
                    <h5>Note: <small className="text-muted font-size-14">Please, do share your referral link and get  <strong style={{fontSize:"1.2em"}}>100 points</strong> credited to your account for every successful account signup.</small></h5></Col>
                </Row>
              </div>
    </React.Fragment>
  )
}

export default Referral;