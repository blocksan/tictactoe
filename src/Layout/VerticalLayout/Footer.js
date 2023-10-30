import React from "react"
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap"

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="loggedin-footer">
        <Container fluid ={true}>
          <Row>
            {/* <Col sm={6}>{new Date().getFullYear()} © Trrader.in</Col> */}
            <div className="landing">
              <footer className="footer-main bg-gradient-primary dark overlay-shape-06">
                    <div className="padding">
                        
                        <div className="row center-desktop max-width-l">
                            <div className="col-two-fifths">
                            
                                <h6>Trrader ®</h6>
                                <p>Product by Trrader, for Trrader.</p>
                            </div>
                            <div className="col-one-fifth">
                                <h6>Info</h6>
                                <ul className="blank">
                                    <li><Link to={"/termsnconditions"} style={{color:"white"}}> Terms & Conditions</Link></li>
                                    <li><Link to={"/faq"} style={{color:"white"}}> FAQ</Link></li>
                                    <li><Link to={"/privacypolicy"} style={{color:"white"}}> Privacy & Policy</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <p className="copyright"><span>Product by Trrader, for Trrader</span><span> © 2023, all rights reserved.</span></p>
                </footer>
            </div>
          </Row>
        </Container>
      </footer>
    </React.Fragment>

  );
}

export default Footer;