import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Badge, Button, Card, CardBody, CardTitle, Col, Container, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner, Table } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { TOAST_DELAY } from '../../constants/common';
import { getFirebaseBackend } from '../../helpers/firebase_helper';

const MySubscription = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);
    const [modal, setModal] = useState(false);
    const [subToCancel, setSubToCancel] = useState(null);

    const fetchSubscriptions = async () => {
        const backend = getFirebaseBackend();
        const response = await backend.getUserSubscriptions();
        if (response.status) {
            setSubscriptions(response.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const toggleModal = () => setModal(!modal);

    const handleCancelClick = (sub) => {
        setSubToCancel(sub);
        toggleModal();
    };

    const handleCancelSubscription = async () => {
        toggleModal();
        if (!subToCancel) return;
        const sub = subToCancel;

        setCancellingId(sub.id);
        const backend = getFirebaseBackend();
        const result = await backend.cancelUserSubscription(sub.id, sub.order_id || sub.orderId); // Handle case sensitivity if any
        
        if (result.status) {
            // Analytics: Subscription Cancelled
            const daysRemaining = Math.max(0, Math.ceil((sub.endDate - new Date()) / (1000 * 60 * 60 * 24)));
            backend.logEvent("subscription_cancelled", { 
                plan: sub.planId, 
                days_remaining: daysRemaining 
            });

            toast.success("Subscription cancelled successfully.");
            setTimeout(() => {
                window.location.reload();
            }, TOAST_DELAY);
        } else {
            toast.error("Failed to cancel subscription: " + result.error);
            setCancellingId(null);
        }
    };

    const formatDate = (date) => {
        if (!date) return "-";
        const dateStr = date.toLocaleDateString("en-IN", {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
        const timeStr = date.toLocaleTimeString("en-IN", {
            hour: '2-digit',
            minute: '2-digit'
        });
        return (
            <div>
                <div>{dateStr}</div>
                <small className="text-muted">{timeStr}</small>
            </div>
        );
    };

    const getStatusBadge = (sub) => {
        if (sub.status === 'UPGRADED') {
            return <Badge color="info" className="font-size-12">Upgraded</Badge>;
        }

        const isExpired = new Date() > sub.endDate;
        if (isExpired) {
             return <Badge color="secondary" className="font-size-12">Expired</Badge>;
        }

        if (sub.status === 'cancelled') {
            // Cancelled but NOT expired yet (Access continues)
            return <Badge color="danger" className="font-size-12">Cancelled</Badge>;
        }
        
        if (sub.status === 'active') {
             return <Badge color="success" className="font-size-12">Active</Badge>;
        }
        
        return <Badge color="secondary" className="font-size-12">Expired</Badge>;
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Settings" breadcrumbItem="My Subscriptions" />

                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    <CardTitle className="mb-4">Subscription History</CardTitle>
                                    
                                    {loading ? (
                                        <div className="text-center py-4">
                                            <Spinner color="primary" />
                                        </div>
                                    ) : subscriptions.length > 0 ? (
                                        <div className="table-responsive">
                                            <Table className="table-centered table-nowrap mb-0">
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th>Plan</th>
                                                        <th>Purchased On</th>
                                                        <th>Start Date</th>
                                                        <th>End Date</th>
                                                        <th>Cancelled On</th>
                                                        <th>Amount</th>
                                                        <th>Status</th>
                                                        <th>Order ID</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {subscriptions.map((sub, index) => (
                                                        <tr key={sub.id || index}>
                                                            <td>
                                                                <h5 className="font-size-14 mb-1">
                                                                    {sub.planId && sub.planId.includes("YEARLY") ? "Yearly Plan" : 
                                                                     sub.planId && sub.planId.includes("MONTHLY") ? "Monthly Plan" : "Premium Plan"}
                                                                </h5>
                                                                {/* <span className="text-muted font-size-12">{sub.planId}</span> */}
                                                            </td>
                                                            <td>{formatDate(sub.purchasedOn)}</td>
                                                            <td>{formatDate(sub.startDate)}</td>
                                                            <td>{formatDate(sub.endDate)}</td>
                                                            <td>{formatDate(sub.cancelledOn)}</td>
                                                            <td>
                                                                {sub.currency} {sub.amount}
                                                            </td>
                                                            <td>
                                                                {getStatusBadge(sub)}
                                                            </td>
                                                            <td>
                                                                <small className="text-muted">{sub.orderId || sub.order_id}</small>
                                                            </td>
                                                            <td>
                                                                {sub.status === 'active' && new Date() < sub.endDate && (
                                                                    <Button 
                                                                        color="danger" 
                                                                        size="sm" 
                                                                        outline
                                                                        onClick={() => handleCancelClick(sub)}
                                                                        disabled={cancellingId === sub.id}
                                                                    >
                                                                        {cancellingId === sub.id ? "Cancelling..." : "Cancel"}
                                                                    </Button>
                                                                )} 
                                                                {sub.status === 'cancelled' && (
                                                                   <span>NA</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                    ) : (
                                        <div className="text-center text-muted py-4">
                                            <p>No subscriptions found.</p>
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Modal isOpen={modal} toggle={toggleModal} centered>
                        <ModalHeader toggle={toggleModal}>Confirm Cancellation</ModalHeader>
                        <ModalBody>
                            Are you sure you want to cancel your subscription?
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={toggleModal}>Close</Button>
                            <Button color="danger" onClick={handleCancelSubscription}>Yes, Cancel</Button>
                        </ModalFooter>
                    </Modal>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default MySubscription;
