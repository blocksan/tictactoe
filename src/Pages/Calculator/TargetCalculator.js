import React from 'react'

import {
  Row,
  Col,
  Container
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import logoVoiled from "../../assets/images/OnlyLogoVoiled.png";
const Referral = () => {
  return (
    <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Calculator" breadcrumbItem="Target Calculator" />
                </Container>
                <Row>
                    <Col className='text-center' style={{paddingTop:"100px"}}>
                    <h4>Coming soon...</h4>
                    </Col>
                    </Row>
              </div>
    </React.Fragment>
  )
}

export default Referral;