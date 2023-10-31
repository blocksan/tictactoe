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

function Pricing(props) {
  return (
    <React.Fragment>
            <div className="page-content landing-header-main">
                <Container fluid={true}>
                    <Breadcrumbs title="Plans" breadcrumbItem="Pricing Plans" />
                </Container>
                <Row>
                <Col>
                <PricingContent user={props.user}></PricingContent>
                </Col>
                </Row>
                </div>

    </React.Fragment>
  )
}

const mapStateToProps = state => {
  return { ...state.login };
};
export default connect(mapStateToProps, {})(Pricing)