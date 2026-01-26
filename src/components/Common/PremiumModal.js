import { Link } from "react-router-dom";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const PremiumModal = ({ isOpen, toggle }) => {
    return (
        <Modal
            isOpen={isOpen}
            toggle={toggle}
            centered
            className="premium-modal"
            size="md"
        >
            <ModalHeader toggle={toggle} className="border-0 pb-0">
                <div className="d-flex align-items-center">
                    <div className="premium-icon-circle me-3">
                        <i className="bx bxs-crown font-size-24 text-warning"></i>
                    </div>
                    <h5 className="modal-title mb-0 fw-bold text-dark">Premium Feature</h5>
                </div>
            </ModalHeader>
            <ModalBody className="pt-4 px-4">
                <h4 className="fw-bold mb-3 text-dark">Elevate Your Trading Strategy</h4>
                <p className="text-muted mb-4">
                    Unlock professional-grade tools designed to give you an edge in the markets. 
                    Get access to advanced configurations and persistent calculation backups.
                </p>
                
                <div className="premium-benefits mb-4">
                    <div className="d-flex align-items-start mb-3">
                        <div className="mt-1 bg-soft-success rounded-circle p-1 me-3">
                            <i className="bx bx-check text-success font-size-16 d-block"></i>
                        </div>
                        <div>
                            <h6 className="mb-0 fw-semibold text-dark">Advanced Configurations</h6>
                            <p className="text-muted small mb-0">Fine-tune SL counts, drawdown, and multipliers.</p>
                        </div>
                    </div>
                    <div className="d-flex align-items-start mb-3">
                        <div className="mt-1 bg-soft-success rounded-circle p-1 me-3">
                            <i className="bx bx-check text-success font-size-16 d-block"></i>
                        </div>
                        <div>
                            <h6 className="mb-0 fw-semibold text-dark">Calculation Backups</h6>
                            <p className="text-muted small mb-0">Save and reload your setups across any device.</p>
                        </div>
                    </div>
                    <div className="d-flex align-items-start">
                        <div className="mt-1 bg-soft-success rounded-circle p-1 me-3">
                            <i className="bx bx-check text-success font-size-16 d-block"></i>
                        </div>
                        <div>
                            <h6 className="mb-0 fw-semibold text-dark">Priority Email Support</h6>
                            <p className="text-muted small mb-0">Get direct help with your risk management strategy.</p>
                        </div>
                    </div>
                </div>

                <div className="premium-value-proposition p-3 rounded-3 text-center mb-0" style={{ backgroundColor: "#f0f4ff", border: "1px solid #dbe3ff" }}>
                    <p className="mb-1 text-primary small fw-semibold uppercase tracking-wider">PREMIUM ACCESS</p>
                    <h5 className="mb-0 text-dark fw-bold">
                        Professional Tools Starting at <span className="text-primary">₹99 / Month</span>
                    </h5>
                    <p className="mb-0 text-muted small mt-1">(Only ₹1.6 / day with the Yearly Plan)</p>
                </div>
            </ModalBody>
            <ModalFooter className="border-0 pt-4 pb-4 px-4 justify-content-end">
                <Button color="link" className="text-muted text-decoration-none me-3" onClick={toggle}>
                    Maybe Later
                </Button>
                <Link to="/pricing">
                    <Button color="primary" className="px-4 py-2 fw-bold premium-cta-btn shadow-sm" onClick={toggle}>
                        Join Premium <i className="bx bx-right-arrow-alt ms-1"></i>
                    </Button>
                </Link>
            </ModalFooter>
        </Modal>
    );
};

export default PremiumModal;
