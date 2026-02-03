import React from 'react';
import { Col, Container, Row } from 'reactstrap';

function PrivacyPolicy() {
  return (
    <React.Fragment>
      <div className="doc-page-wrapper">
        <Container>
          <div className="doc-container pt-5">
            <Row>
              <Col lg={12}>
                <div className="doc-card">
                  <h2 className="doc-main-heading">Privacy Policy</h2>

                  <div className="doc-content">
                    <p>
                      At <strong>Trrader.in</strong> (a product of <strong>Blocksan Tech Solutions</strong>), we take the privacy of our users very seriously. This privacy policy explains how we collect, use, and protect the personal information of users.
                    </p>
                    
                     <div className="alert alert-warning border-0 bg-opacity-10 text-dark p-3 rounded-3 mb-4" style={{ backgroundColor: '#fff3cd' }}>
                        <strong>Disclaimer:</strong> All the information provided on this platform is for <strong>educational purposes only</strong>. We do not encourage users to take any trades based solely on the results or calculations provided by our tools.
                    </div>

                    <h3>Information Collection and Use</h3>
                    <ul>
                      <li>We collect personal information which includes only names, email, and profile from users to create the profile.</li>
                      <li>We do not use this information for any other purpose except creating the user account.</li>
                    </ul>

                    <h3>Information Sharing</h3>
                    <ul>
                      <li>We do not share personal information with third parties without the consent of the user, except as required by law or to comply with legal process.</li>
                    </ul>

                    <h3>Information Protection</h3>
                    <ul>
                      <li>We use state-of-the-art encryption and security measures to protect personal information from unauthorized access, use, or disclosure.</li>
                      <li>We have implemented a comprehensive security program to protect against data breaches, unauthorized access, and other potential security risks.</li>
                      <li>We regularly review and update our security measures to ensure that personal information remains protected at all times.</li>
                    </ul>

                    <h3>Accessing and Updating Personal Information</h3>
                    <ul>
                      <li>Users can always login to the account using the email, there is no other method we support as of now.</li>
                    </ul>

                    <h3>Compliance with Laws and Regulations</h3>
                    <ul>
                      <li>We comply with all applicable laws and regulations related to data protection.</li>
                    </ul>

                    <h3>Changes to this Privacy Policy</h3>
                    <ul>
                      <li>We may update this privacy policy from time to time to reflect changes in our practices and services.</li>
                    </ul>

                    <h3>Contact Us</h3>
                    <p>
                      If you have any questions or concerns about this privacy policy, please contact us at <strong>trraderin@gmail.com</strong>
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default PrivacyPolicy;