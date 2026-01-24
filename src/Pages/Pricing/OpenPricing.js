import React from 'react';
import { connect } from 'react-redux';
import {
    Col,
    Container,
    Row
} from "reactstrap";
import PricingContent from './PricingContent';


function OpenPricing(props) {
  return (
    <React.Fragment>

      <Row>
        <Container fluid={true} style={{marginTop:"120px"}}>
          <Col>
            <PricingContent user={props.user}></PricingContent>
          </Col>
        </Container>

      </Row>

    </React.Fragment>
  )
}

const mapStateToProps = state => {
  return { ...state.login };
};
export default connect(mapStateToProps, {})(OpenPricing)