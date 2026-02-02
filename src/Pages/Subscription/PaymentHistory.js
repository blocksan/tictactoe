import React, { useEffect, useState } from 'react';
import { Badge, Card, CardBody, CardTitle, Col, Container, Row, Spinner, Table } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { getFirebaseBackend } from '../../helpers/firebase_helper';

const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            const backend = getFirebaseBackend();
            const response = await backend.getUserPayments();
            if (response.status) {
                setPayments(response.data);
            }
            setLoading(false);
        };
        fetchPayments();
    }, []);

    const formatDate = (date) => {
        if (!date) return "-";
        return date.toLocaleDateString("en-IN", {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        switch (status?.toUpperCase()) {
            case 'PAID':
            case 'SUCCESS':
                return <Badge color="success" className="font-size-12">Success</Badge>;
            case 'FAILED':
                return <Badge color="danger" className="font-size-12">Failed</Badge>;
            case 'PENDING':
            case 'ACTIVE':
                return <Badge color="warning" className="font-size-12">Pending</Badge>;
            default:
                return <Badge color="secondary" className="font-size-12">{status}</Badge>;
        }
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Breadcrumbs title="Settings" breadcrumbItem="Payment History" />

                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardBody>
                                    <CardTitle className="mb-4">Recent Payments</CardTitle>
                                    
                                    {loading ? (
                                        <div className="text-center py-4">
                                            <Spinner color="primary" />
                                        </div>
                                    ) : payments.length > 0 ? (
                                        <div className="table-responsive">
                                            <Table className="table-centered table-nowrap mb-0">
                                                <thead className="thead-light">
                                                    <tr>
                                                        <th>Order ID</th>
                                                        <th>Date</th>
                                                        <th>Plan</th>
                                                        <th>Amount</th>
                                                        <th>Status</th>
                                                        <th>Payment ID</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {payments.map((payment, index) => (
                                                        <tr key={payment.id || index}>
                                                            <td>
                                                                <span className="text-dark fw-bold">{payment.orderId}</span>
                                                            </td>
                                                            <td>{formatDate(payment.createdOn)}</td>
                                                            <td>
                                                                {payment.planId ? payment.planId.replace(/_/g, ' ') : "-"}
                                                            </td>
                                                            <td>
                                                                {payment.currency} {payment.amount}
                                                            </td>
                                                            <td>
                                                                {getStatusBadge(payment.status)}
                                                            </td>
                                                            <td>
                                                                <small className="text-muted">{payment?.response?.cf_payment_id || "-"}</small>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                    ) : (
                                        <div className="text-center text-muted py-4">
                                            <p>No payment history found.</p>
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default PaymentHistory;
