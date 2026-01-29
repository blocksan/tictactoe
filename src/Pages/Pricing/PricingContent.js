import React from 'react';
import {
    Card,
    CardBody,
    Col,
    Row
} from "reactstrap";
import { getFirebaseBackend } from '../../helpers/firebase_helper';
// import OffLogo33 from "../../assets/images/OffLogo33Compressed.png";
import { toast } from 'react-toastify';
import { PRICING_PLANS, PricingData, TOAST_DELAY } from '../../constants/common';
import { createPaymentIntent, fetchPaymentStatus } from '../../helpers/cashfree_helper';

function PricingContent(props) {
    

    const [loading, setLoading] = React.useState(false);
    
    // Check for Return URL (Payment Callback)
    React.useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const orderId = queryParams.get("order_id");

        if (orderId) {
            handlePaymentCallback(orderId);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePaymentCallback = async (orderId) => {
        setLoading(true);
        // Clear URL params
        window.history.replaceState({}, document.title, window.location.pathname);

        try {
            const firebaseBackend = getFirebaseBackend();
            const statusRes = await fetchPaymentStatus(orderId);
            console.log("Payment Callback Status:", statusRes);

            // Cashfree 'PAID' status check. 
            // STRICT CHECK: Only 'PAID' means money received. 'ACTIVE' means order is still open/pending.
            if (statusRes.status === "success" && statusRes.payment_status === "PAID") {
                const pendingPlan = JSON.parse(localStorage.getItem("pending_subscription_plan"));
                
                // UPDATE LOG TO SUCCESS
                await firebaseBackend.updatePaymentStatus(orderId, "SUCCESS", { 
                    paymentId: statusRes.data.cf_payment_id || "N/A",  // Capture CF Payment ID if available
                    response: statusRes.data
                });

                if (pendingPlan) {
                     await saveSuccessfulSubscription(statusRes, pendingPlan);
                     localStorage.removeItem("pending_subscription_plan");
                } else {
                    toast.error("Payment received! However, plan details were not found. Please contact support.");
                }
            } else if (statusRes.status === "success" && statusRes.payment_status === "ACTIVE") {
                 console.warn("Payment Status is ACTIVE (Pending/Abandoned)");
                 // UPDATE LOG TO PENDING/CANCELLED
                 await firebaseBackend.updatePaymentStatus(orderId, "PENDING", { response: statusRes.data });
                 
                 toast.warn("Payment process was cancelled or is still pending. If you deduced money, please contact support.");
            } else {
                // UPDATE LOG TO FAILED
                await firebaseBackend.updatePaymentStatus(orderId, "FAILED", { 
                    response: statusRes.data || statusRes.error
                });
                toast.error("Payment failed or cancelled. Status: " + statusRes.payment_status);
            }
        } catch (err) {
            console.error(err);
            toast.error("Error verifying payment: " + err.message);
        }
        setLoading(false);
    };

    const saveSuccessfulSubscription = async (paymentStatus, selectedPlan) => {
        const firebaseBackend = getFirebaseBackend();
        const saveResult = await firebaseBackend.saveSubscription({
            id: paymentStatus.order_id, 
            order_id: paymentStatus.order_id,
            amount: selectedPlan.yearly ? selectedPlan.discountedPrice : selectedPlan.price,
            currency: "INR",
            planId: selectedPlan.planId,
            payment_status: "PAID"
        }, props.user);

        if (saveResult.status) {
            toast.success("Subscription successful! You are now a Premium member.");
            setTimeout(() => {
                window.location.reload();
            }, TOAST_DELAY);
        } else {
            console.error(saveResult.error);
            toast.error("Payment successful but failed to update subscription in database. Please contact support. Error: " + saveResult.error);
        }
    };


    const handleSubscription = async (pricingPlan) => {
        try {
            if (!checkIfUserIsLoggedIn()) {
                return;
            }
            
            const selectedPlan = PricingData.find(p => p.pricingPlan === pricingPlan);
            if (!selectedPlan) return;

            setLoading(true);
            
            // 1. Create Payment Intent (Order)
            const amount = selectedPlan.yearly ? selectedPlan.discountedPrice : selectedPlan.price;
            
            // Pass user details for Cashfree
            const userDetails = {
                uid: props.user.uid,
                email: props.user.email,
                phone: props.user.phone // Ensure phone is available or handle fallback in helper
            };

            const paymentIntent = await createPaymentIntent(amount, "INR", userDetails);
            if (paymentIntent.status === "success") {
                // Store plan details for post-payment verification
                localStorage.setItem("pending_subscription_plan", JSON.stringify(selectedPlan));
                
                // LOG INITIATION
                const firebaseBackend = getFirebaseBackend();
                await firebaseBackend.logPaymentInitiation({
                    order_id: paymentIntent.order_id,
                    payment_session_id: paymentIntent.payment_session_id,
                    amount: amount,
                    currency: "INR",
                    planId: selectedPlan.planId || selectedPlan.pricingPlan,
                }, props.user);

                // 2. Initiate Payment (Redirects or opens simple checkout)
                // We need to import doPayment from helper
                const { doPayment } = require('../../helpers/cashfree_helper'); // Lazy import if not top-level
                await doPayment(paymentIntent.payment_session_id);
                
                // Code execution might stop here if redirecting
            } else {
                toast.error("Failed to initiate payment: " + paymentIntent.error);
                setLoading(false);
            }
            
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong: " + err.message);
            setLoading(false);
        }
    }

    const checkIfUserIsLoggedIn = () => {
        if (!props.user) {
            toast.error("Please login from landing page to purchase the plan")
            return false
        } else {
            return true
        }
    }

    return (
        <>
            <Row className="justify-content-center">
            {loading && <div class="full-page-loading"></div>}
                <Col lg={7}>
                    <div className="text-center mb-5">
                        <h2 className="fw-black mb-3 text-dark" style={{ fontSize: "3.5rem", fontWeight: "800", letterSpacing: "-0.05em", lineHeight: "1.2" }}> Built By Trrader, For Trrader</h2>
                        <p className="text-muted font-size-17 px-lg-5">
                            Scale your trading strategy with institutional-grade risk management tools. 
                        </p>
                    </div>
                </Col>
            </Row>
            <Row className="justify-content-center gx-4">
                {PricingData.map((item, key) => (
                    <Col xl={3} md={6} className="mb-4" key={key}>
                        <Card className={`pricing-card h-100 border-0 ${item.yearly ? 'pricing-card-highlight' : ''}`}>
                            <CardBody className="p-4 d-flex flex-column">
                                {item.yearly && (
                                    <div className="pricing-badge">
                                        <span className="badge rounded-pill bg-danger shadow-sm">50% OFF</span>
                                    </div>
                                )}
                                
                                <div className="text-center mb-4">
                                    <div className="pricing-icon-bg mb-3">
                                        <i className={`${item.icon} font-size-24 text-primary`}></i>
                                    </div>
                                    <h5 className="fw-bold text-dark mb-1">{item.title}</h5>
                                    <p className="text-muted small mb-0">{item.caption}</p>
                                </div>

                                <div className="pricing-price-container py-3 mb-4 border-top border-bottom border-light text-center">
                                    <h2 className="mb-0 fw-bold text-dark">
                                        <span className="font-size-18 fw-normal me-1">&#8377;</span>
                                        {item.yearly ? (
                                            <>
                                                <span className="text-muted text-decoration-line-through font-size-16 me-2 fw-normal">{item.price}</span>
                                                <span className="text-primary">{item.discountedPrice}</span>
                                            </>
                                        ) : (
                                            <span>{item.price}</span>
                                        )}
                                        <span className="font-size-14 text-muted fw-normal ms-1">
                                            {item.pricingPlan === PRICING_PLANS[0] ? '/ Lifetime' : `/ ${item.pricingPlan}`}
                                        </span>
                                    </h2>
                                </div>

                                <div className="flex-grow-1">
                                    <h6 className="text-dark fw-bold mb-3 font-size-13 text-uppercase tracking-wider">Strategic Features</h6>
                                    <ul className="list-unstyled mb-0">
                                        {item.isChild.map((subitem, key) => (
                                            <li key={key} className="d-flex align-items-start mb-3">
                                                <i className="bx bx-check text-success font-size-18 me-2 mt-0"></i>
                                                <span className="text-muted font-size-14" style={{ lineHeight: "1.4" }}>{subitem.features}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-4">
                                    {props.user && props.user.planId === item.planId ? (
                                        <button className="btn btn-soft-success w-100 fw-bold py-2 border-0" disabled>
                                            <i className="bx bx-check-double me-1"></i> Active Plan
                                        </button>
                                    ) : item.pricingPlan === PRICING_PLANS[0] ? (
                                        <button className="btn btn-light w-100 fw-bold py-2 disabled" style={{ backgroundColor: "#f8f9fa" }}>
                                            {props.user && props.user.planId ? "Standard Access" : "Current Plan"}
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleSubscription(item.pricingPlan)}
                                            className="btn btn-primary w-100 fw-bold py-2 shadow-sm premium-cta-btn"
                                        >
                                            Upgrade Now
                                        </button>
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    )
}

export default PricingContent