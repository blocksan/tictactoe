import React from 'react';
import {
    Card,
    CardBody,
    Col,
    Row
} from "reactstrap";
import { getFirebaseBackend } from '../../helpers/firebase_helper';
// import OffLogo33 from "../../assets/images/OffLogo33Compressed.png";
import { createPaymentIntent, fetchPaymentStatus } from '../../helpers/cashfree_helper';
const PRICING_PLANS = ["Free", "Monthly", "Yearly"];
function PricingContent(props) {
    const PricingData = [
        {
            title: "Free",
            caption: "Precision planning for every trader",
            icon: "bx bx-rocket",
            price: "0",
            pricingPlan: PRICING_PLANS[0],
            planId: "FREE",
            isChild: [
                { id: "1", features: "10 Calculations" },
                { id: "2", features: "Standard Risk Tools" },
                { id: "3", features: "Basic Position Sizing" },
            ],
        },

        {
            title: "Professional",
            caption: "Advanced tools for active traders",
            icon: "bx bx-trending-up",
            price: "99",
            planId: "MONTHLY99",
            pricingPlan: PRICING_PLANS[1],
            isChild: [
                { id: "1", features: "Unlimited Calculations" },
                { id: "2", features: "Custom Risk Configurations" },
                { id: "3", features: "Secure Cloud Backups" },
                { id: "4", features: "Priority Email Support" },
            ],
        },
        {
            title: "Expert",
            caption: "Maximum efficiency and best value",
            icon: "bx bx-diamond",
            price: "1199",
            discountedPrice: "599",
            yearly: true,
            planId: "YEARLY599",
            pricingPlan: PRICING_PLANS[2],
            isChild: [
                { id: "1", features: "All Professional Features" },
                { id: "2", features: "50% Annual Cost Savings" },
                { id: "3", features: "Advanced Support Access" },
                { id: "4", features: "Priority Feature Access" },
            ],
        },
        // {
        //   title: "Enterprise",
        //   caption: "Sed neque unde",
        //   icon: "fas fa-shield-alt",
        //   price: "39",
        //   isChild: [
        //     { id: "1", features: "Free Live Support" },
        //     { id: "2", features: "Unlimited User" },
        //     { id: "3", features: "No Time Tracking" },
        //     { id: "4", features: "Free Setup" },
        //   ],
        // },
        // {
        //   title: "Unlimited",
        //   caption: "Itque eam rerum",
        //   icon: "fas fa-headset",
        //   price: "49",
        //   isChild: [
        //     { id: "1", features: "Free Live Support" },
        //     { id: "2", features: "Unlimited User" },
        //     { id: "3", features: "No Time Tracking" },
        //     { id: "4", features: "Free Setup" },
        //   ],
        // },
    ];

    const [loading, setLoading] = React.useState(false);



    const handleSubscription = async (pricingPlan) => {
        try {
            if (!checkIfUserIsLoggedIn()) {
                return;
            }
            
            const selectedPlan = PricingData.find(p => p.pricingPlan === pricingPlan);
            if (!selectedPlan) return;

            setLoading(true);
            
            // 1. Create Payment Intent
            const amount = selectedPlan.yearly ? selectedPlan.discountedPrice : selectedPlan.price;
            const paymentIntent = await createPaymentIntent(amount, "INR");
            
            if (paymentIntent.status === "success") {
                // 2. Fetch Payment Status (Simulating payment completion)
                const paymentStatus = await fetchPaymentStatus(paymentIntent.order_id);
                
                if (paymentStatus.status === "success" && paymentStatus.payment_status === "PAID") {
                    // 3. Save Subscription
                    const firebaseBackend = getFirebaseBackend();
                    const saveResult = await firebaseBackend.saveSubscription({
                        id: paymentStatus.payment_session_id, // using session id as payment id for now
                        order_id: paymentStatus.order_id,
                        amount: amount,
                        currency: "INR",
                        planId: selectedPlan.planId
                    }, props.user);

                    if (saveResult.status) {
                        alert("Subscription successful! You are now a Premium member.");
                        // Optionally refresh page or updatestate
                         window.location.reload();
                    } else {
                        alert("Payment successful but failed to save subscription: " + saveResult.error);
                    }
                } else {
                    alert("Payment failed or pending.");
                }
            } else {
                alert("Failed to initiate payment.");
            }
            
            setLoading(false);
        } catch (err) {
            console.error(err);
            alert("Something went wrong: " + err.message);
            setLoading(false);
        }
    }

    const checkIfUserIsLoggedIn = () => {
        if (!props.user) {
            alert("Please login from landing page to purchase the plan")
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
                        <h2 className="fw-bold mb-3 text-dark">Professional Risk Management for Every Trader</h2>
                        <p className="text-muted font-size-17 px-lg-5">
                            Scale your trading strategy with institutional-grade risk management tools. 
                            Choose the professional edge that aligns with your performance goals.
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