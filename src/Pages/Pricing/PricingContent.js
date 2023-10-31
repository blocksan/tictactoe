import React from 'react'
import {
    Row,
    Col,
    Card,
    CardBody,
    CardFooter
} from "reactstrap";
import { getFirebaseApp } from '../../helpers/firebase_helper';
import { getCheckoutUrl } from '../../helpers/stripe/stripePayment';
// import OffLogo33 from "../../assets/images/OffLogo33Compressed.png";
import OffLogo50 from "../../assets/images/OffLogo50Compressed.png";
const PRICING_PLANS = ["Free", "Monthly", "Yearly"];
function PricingContent(props) {
    const PricingData = [
        {
            title: "Forever Free",
            caption: "Free for lifetime",
            icon: "mdi mdi-hand-heart-outline",
            price: "0",
            pricingPlan: PRICING_PLANS[0],
            isChild: [
                { id: "1", features: "Perform Unlimited Calculation" },
            ],
        },

        {
            title: "Monthly",
            caption: "Small payment for a big change",
            icon: "bx bx-calendar-star",
            price: "49",
            pricingPlan: PRICING_PLANS[1],
            isChild: [
                { id: "1", features: "Perform Unlimited Calculation" },
                { id: "2", features: "Advance Configurations" },
                { id: "3", features: "Save Calculation" },
                { id: "4", features: "Free Support over Email" },
            ],
        },
        {
            title: "Yearly",
            caption: "Best suited, if don't want to pay monthly",
            icon: "bx bx-calendar",
            price: "588",
            discountedPrice: "299",
            yearly: true,
            pricingPlan: PRICING_PLANS[2],
            isChild: [
                { id: "1", features: "Perform Unlimited Calculation" },
                { id: "2", features: "Advance Configurations" },
                { id: "3", features: "Save Calculation" },
                { id: "4", features: "Free Support over Email" },
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

    const firebaseApp = getFirebaseApp();

    const monthlySubscriptionHandler = async () => {

        try {
            if (!checkIfUserIsLoggedIn()) {
                return;
            }
            setLoading(true);
            const monthlyPriceId = process.env.REACT_APP_STRIPE_MONTHLY_PRICE_ID;
            const checkoutUrl = await getCheckoutUrl(firebaseApp, monthlyPriceId);
            window.location.replace(checkoutUrl);
            setLoading(false);
        } catch (err) {
            alert(err.message)
        }
    }
    const yearlySubscriptionHandler = async () => {
        try {
            if (!checkIfUserIsLoggedIn()) {
                return;
            }
            setLoading(true);
            const yearlyPriceId = process.env.REACT_APP_STRIPE_YEARLY_PRICE_ID;
            const checkoutUrl = await getCheckoutUrl(firebaseApp, yearlyPriceId);
            setLoading(false);
            window.location.replace(checkoutUrl);
        } catch (err) {
            alert(err.message)
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
                <Col lg={5}>
                    <div className="text-center mb-5">
                        <h4>Choose your Pricing plan</h4>
                        {/* <p className="text-muted">
                            To achieve this, it would be necessary to have uniform
                            grammar, pronunciation and more common words If several
                            languages coalesce
                        </p> */}
                    </div>
                </Col>
            </Row>
            <Row style={{ justifyContent: "center" }}>
                {PricingData.map((item, key) => (
                    <Col xl={3} md={3} lg={3} key={key}>
                        <Card>
                            <CardBody className="p-4">
                                <div className="d-flex mb-1">
                                    {/* <div className="flex-shrink-0 me-3">
                                        <div className="avatar-sm">
                                            <span className="avatar-title rounded-circle metrics-card-primary-2">
                                                <i className={item.icon + " font-size-20"}></i>
                                            </span>
                                        </div>
                                    </div> */}
                                    <div className="flex-grow-1 text-center" style={{ minHeight: "85px" }}>
                                        <h5 className="font-size-18" style={{ color: "#444" }}>{item.title}</h5>
                                        <p className="text-muted">{item.caption}</p>
                                    </div>
                                </div>
                                <div className="py-2 border-bottom pt-2 text-center">

                                    <h4>
                                        <sup>
                                            <small>&#8377;</small>
                                        </sup>{" "}
                                        {item.pricingPlan == PRICING_PLANS[2] && <><span className='strikediag' style={{ fontSize: "0.9em", }}>{item.price}</span> &nbsp; <strong>{item.discountedPrice}</strong>/<span className="font-size-14"> Yearly</span></>}
                                        {item.pricingPlan == PRICING_PLANS[1] && <><strong>{item.price}</strong>/ <span className="font-size-14"> Monthly</span></>}
                                        {item.pricingPlan == PRICING_PLANS[0] && <><strong>{item.price}</strong> </>}


                                    </h4>
                                </div>
                                <div className="plan-features mt-4" style={{ minHeight: "150px", position: "relative" }}>
                                    {item.yearly && <img src={OffLogo50} className="offer-image" />}
                                    <h5 className="text-left font-size-15 mb-4" style={{ color: "#444" }}>
                                        Plan Features :
                                    </h5>
                                    {item.isChild.map((subitem, key) => (
                                        <p key={key}>
                                            <i className="mdi mdi-checkbox-marked-circle-outline font-size-16 align-middle text-primary me-2"></i>{" "}
                                            {subitem.features}
                                        </p>
                                    ))}
                                </div>
                            </CardBody>
                            {item.pricingPlan !== PRICING_PLANS[0] &&
                                <CardFooter className='text-center'>
                                    <div className="float-centre plan-btn">
                                        <button
                                        disabled
                                            // onClick={item.yearly ? yearlySubscriptionHandler : monthlySubscriptionHandler}
                                            className="btn metrics-card-primary-2 btn-sm waves-effect waves-light"
                                        >
                                            Coming Soon...
                                        </button>
                                    </div>
                                </CardFooter>}
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    )
}

export default PricingContent