import React from 'react';
import { connect } from 'react-redux';
import {
  Col,
  Container,
  Row
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import PricingContent from './PricingContent';

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