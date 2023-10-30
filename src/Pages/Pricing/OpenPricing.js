import React from 'react'
import {
  Row,
  Col,
  Container
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { getCheckoutUrl } from '../../helpers/stripe/stripePayment';
import { getFirebaseApp } from '../../helpers/firebase_helper';
import PricingContent from './PricingContent';
import { connect } from 'react-redux';
import Header from '../../Layout/VerticalLayout/Header';
import Footer from '../../Layout/VerticalLayout/Footer';

function OpenPricing(props) {
  return (
    <React.Fragment>
      <Header></Header>
      <Row>
        <Container fluid={true} style={{marginTop:"120px"}}>
          <Col>
            <PricingContent user={props.user}></PricingContent>
          </Col>
        </Container>
        <Footer></Footer>
      </Row>

    </React.Fragment>
  )
}

const mapStateToProps = state => {
  return { ...state.login };
};
export default connect(mapStateToProps, {})(OpenPricing)