import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";

const Footer = () => {
  return (
    <footer className="footer shadow-sm">
      <div className="container-fluid">
        <Row className="align-items-center">
          <Col md={6}>
            <div className="d-flex align-items-center">
              <span className="fw-semibold text-dark me-2">Trrader ®</span>
              <span className="text-muted font-size-13">© {new Date().getFullYear()} All rights reserved.</span>
            </div>
          </Col>
          <Col md={6}>
            <div className="text-md-end footer-links">
              <Link to="/termsandconditions" className="text-muted ms-4 hover-primary transition-all font-size-13">Terms</Link>
              <Link to="/privacypolicy" className="text-muted ms-4 hover-primary transition-all font-size-13">Privacy</Link>
              <Link to="/faq" className="text-muted ms-4 hover-primary transition-all font-size-13">FAQ</Link>
            </div>
          </Col>
        </Row>
      </div>
    </footer>
  );
};

export default Footer;
