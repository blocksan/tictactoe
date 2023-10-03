import React from "react"
import { Container, Row, Col } from "reactstrap"

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid ={true}>
          <Row>
            <Col sm={6}>{new Date().getFullYear()} © Trrader.in</Col>
            <Col sm={6}>
              <div className="text-sm-end d-none d-sm-block">
                Built with <i className="mdi mdi-heart text-danger"></i> in India
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </React.Fragment>

  );
}

export default Footer;