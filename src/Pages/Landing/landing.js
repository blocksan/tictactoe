import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import PropTypes from "prop-types";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
    AccordionBody,
    AccordionHeader,
    AccordionItem,
    Col,
    Container,
    Navbar,
    NavbarBrand,
    Row,
    UncontrolledAccordion
} from "reactstrap";

// Import Images
import mandrawing from "../../assets/images/mandrawing.png";
import logoVoiled from "../../assets/images/OnlyLogoVoiled.png";
import productOverview from "../../assets/images/product-overview.png";
import riskcalculator from "../../assets/images/riskcalculator.png";
import riskcalculatorresult from "../../assets/images/riskcalculatorresult.png";
import tradingdesktops from "../../assets/images/tradingdesktopscompressed.png";

// Import Components
import GoogleButton from "../../components/Common/GoogleButton";
import withRouter from "../../components/Common/withRouter";
import { getFirebaseApp } from "../../helpers/firebase_helper";
import { logoutUser, socialLogin } from "../../store/actions";

// Simple hook for scroll animations
const useOnScreen = (options) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect(); // Only trigger once
            }
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, [ref, options]);

    return [ref, isVisible];
};

const AnimatedSection = ({ children, className = "", delay = "" }) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.1 });
    return (
        <div ref={ref} className={`${className} ${isVisible ? 'animate-fade-in-up' : 'opacity-0'} ${delay}`} style={{ transition: 'opacity 0.5s' }}>
            {children}
        </div>
    );
};

const Landing = (props) => {
    const dispatch = useDispatch();
    const [scrolled, setScrolled] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const firebaseApp = getFirebaseApp();
    const firebaseAuth = getAuth(firebaseApp);
    const provider = new GoogleAuthProvider();

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(firebaseAuth, provider);
            const user = result.user;
            const postData = {
                name: user.displayName,
                email: user.email,
                picture: user.photoURL,
            };
            dispatch(socialLogin(postData, props.router.navigate, "google"));
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);

        const checkUser = async () => {
            const user = firebaseAuth.currentUser;
            if (!user) {
                dispatch(logoutUser());
            } else {
                const postData = {
                    name: user.displayName,
                    email: user.email,
                    picture: user.photoURL,
                };
                dispatch(socialLogin(postData, props.router.navigate, "google"));
            }
        };
        checkUser();

        return () => window.removeEventListener("scroll", handleScroll);
    }, [dispatch, firebaseAuth, props.router.navigate]);

    return (
        <React.Fragment>
            <div className="landing-page" style={{ backgroundColor: "#0f111a", overflowX: "hidden", minHeight: "100vh", color: "#fff", fontFamily: "'Inter', sans-serif" }}>
                
                {/* Navbar */}
                <Navbar
                    expand="lg"
                    fixed="top"
                    className={`transition-all py-3 ${scrolled ? 'glass-nav shadow-lg' : 'bg-transparent'}`}
                    style={{ transition: "all 0.3s ease" }}
                >
                    <Container className="d-flex align-items-center justify-content-between">
                        <NavbarBrand href="/" className="d-flex align-items-center gap-3 m-0">
                            <div className="bg-white bg-opacity-10 rounded-3 p-1 d-flex align-items-center justify-content-center" style={{ width: "48px", height: "48px" }}>
                                <img src={logoVoiled} alt="Trrader" style={{ height: "36px", filter: "brightness(1.1)" }} />
                            </div>
                            <div className="d-flex flex-column justify-content-center">
                                <h4 className="m-0 fw-bold fs-5 text-high-contrast lh-1" style={{ letterSpacing: "-0.5px" }}>Trrader.in</h4>
                                <span className="text-medium-contrast text-opacity-50 small fw-medium mt-1" style={{ fontSize: "0.75rem" }}>Professional Risk Management</span>
                            </div>
                        </NavbarBrand>
                        <div className="d-flex align-items-center gap-4">
                            <Link to="/openpricing" className="text-medium-contrast text-decoration-none fw-medium hover-text-white" style={{ fontSize: "0.95rem" }}>Pricing</Link>
                            <div onClick={signInWithGoogle} className="cursor-pointer">
                                <GoogleButton />
                            </div>
                        </div>
                    </Container>
                </Navbar>

                {/* Hero Section */}
                <section className="position-relative pt-5 pb-5 d-flex align-items-center" style={{ minHeight: "100vh" }}>
                    {/* Background Gradients */}
                    <div className="position-absolute top-0 start-0 w-100 h-100 overflow-hidden" style={{ zIndex: 0 }}>
                         {/* Enhanced Colorful Gradients */}
                        <div className="position-absolute top-0 start-50 translate-middle pointer-events-none" 
                             style={{ 
                                 width: "1000px", 
                                 height: "1000px", 
                                 background: "radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, rgba(15, 17, 26, 0) 70%)", 
                                 filter: "blur(80px)",
                                 top: "-200px"
                             }}></div>
                        <div className="position-absolute bottom-0 end-0 translate-middle-x pointer-events-none" 
                             style={{ 
                                 width: "800px", 
                                 height: "800px", 
                                 background: "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(15, 17, 26, 0) 70%)", 
                                 filter: "blur(100px)" 
                             }}></div>
                    </div>

                    <Container className="pt-5 position-relative z-1 mt-5">
                        <Row className="align-items-center gy-5">
                            <Col lg={6} className="text-center text-lg-start">
                                <AnimatedSection>
                                    {/* <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-4 border border-white border-opacity-10 bg-white bg-opacity-5 backdrop-blur-sm">
                                        <span className="badge bg-gradient-primary rounded-pill animate-pulse" style={{ background: "linear-gradient(to right, #4f46e5, #9333ea)", fontSize: "0.7rem", padding: "0.35em 0.8em" }}>BETA</span>
                                        <span className="text-medium-contrast small fw-medium">The New Standard in Risk Intelligence</span>
                                    </div> */}
                                    
                                    <h1 className="display-4 fw-black text-high-contrast mb-4 lh-tight tracking-tight" style={{ fontSize: "3.5rem", fontWeight: "800", textShadow: "0 0 40px rgba(79, 70, 229, 0.2)" }}>
                                        Capital Preservation <br />
                                        <span className="gradient-text" style={{ background: "linear-gradient(to right, #60a5fa, #a78bfa, #f472b6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                            Is Not Optional.
                                        </span>
                                    </h1>
                                    
                                    <p className="lead text-medium-contrast mb-5 w-75 mx-auto mx-lg-0" style={{ fontSize: "1.15rem", lineHeight: "1.7" }}>
                                        Deploy institutional-grade risk models to your retail trading. Calculate position sizing, forecast drawdowns, and execute with the discipline of a hedge fund algorithm.
                                    </p>
                                    
                                    <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-4">
                                        <div onClick={signInWithGoogle} className="cursor-pointer hover-transform" style={{ transition: "transform 0.2s" }}>
                                            <GoogleButton />
                                        </div>
                                        <div className="d-flex align-items-center gap-2 text-medium-contrast small">
                                           <div className="rounded-circle bg-success bg-opacity-25 p-1 d-flex align-items-center justify-content-center" style={{ width: "24px", height: "24px" }}>
                                                <i className="mdi mdi-check text-success" style={{ fontSize: "14px" }}></i>
                                           </div>
                                           <span>No credit card required</span>
                                        </div>
                                    </div>
                                </AnimatedSection>
                            </Col>
                            
                            <Col lg={6}>
                                <AnimatedSection delay="delay-200">
                                    <div className="position-relative text-center perspective-container">
                                        <div className="position-relative z-2 hero-image-container animate-float" style={{ transition: "transform 0.3s ease" }}>
                                            <img 
                                                src={mandrawing} 
                                                alt="Trading Analytics Dashboard" 
                                                className="img-fluid position-relative" 
                                                style={{ maxHeight: "600px", filter: "drop-shadow(0 20px 80px rgba(79, 70, 229, 0.4))" }} 
                                            />
                                        </div>
                                        <div className="position-absolute top-50 start-50 translate-middle z-0 rounded-circle" 
                                            style={{ 
                                                width: "60%", 
                                                height: "60%", 
                                                background: "radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, rgba(15, 17, 26, 0) 70%)", 
                                                filter: "blur(60px)" 
                                            }}></div>
                                    </div>
                                </AnimatedSection>
                            </Col>
                        </Row>
                    </Container>
                </section>

                {/* How It Works Section - LIGHT SECTION */}
                <section className="py-5 position-relative section-light">
                    <Container>
                        <AnimatedSection className="text-center mb-5 pb-4">
                            <h6 className="text-primary fw-bold text-uppercase letter-spacing-2 mb-3">Workflow</h6>
                            <h2 className="fw-bold display-6 text-high-contrast">Precision in Three Steps</h2>
                            <p className="text-medium-contrast max-width-600 mx-auto mt-3">
                                Stop calculating risk on napkins. Integrate a standardized, mathematical approach to every single trade you take.
                            </p>
                        </AnimatedSection>
                        
                        <Row className="g-4">
                            {[
                                { 
                                    icon: "mdi-bullseye-arrow", 
                                    title: "Define Parameters", 
                                    desc: "Input your total equity, risk tolerance percentage, and trade-specific stop-loss levels.",
                                    step: "01",
                                    iconColor: "#3b82f6"
                                },
                                { 
                                    icon: "mdi-calculator-variant", 
                                    title: "Automated Calculation", 
                                    desc: "Our engine instantly computes the exact lot size to match your risk profile—down to the decimal.",
                                    step: "02",
                                    iconColor: "#8b5cf6"
                                },
                                { 
                                    icon: "mdi-chart-timeline-variant", 
                                    title: "Execute & Protect", 
                                    desc: "Enter the market with confidence, knowing your downside is mathematically capped before the chart moves.",
                                    step: "03",
                                    iconColor: "#10b981"
                                }
                            ].map((item, index) => (
                                <Col lg={4} key={index}>
                                    <AnimatedSection delay={`delay-${index * 100 + 100}`}>
                                        <div className="card h-100 step-card p-4 border-0 position-relative overflow-hidden" style={{minHeight: "275px"}}>
                                            <div className="step-number">{item.step}</div>
                                            <div className="d-inline-flex align-items-center justify-content-center p-3 rounded-circle mb-4 position-relative z-1 shadow-sm" 
                                                 style={{ background: item.iconColor, width: "64px", height: "64px" }}>
                                                <i className={`mdi ${item.icon} text-white fs-2`}></i>
                                            </div>
                                            <h4 className="fw-bold text-high-contrast mb-3 position-relative z-1">{item.title}</h4>
                                            <p className="text-medium-contrast lh-lg mb-0 position-relative z-1">{item.desc}</p>
                                        </div>
                                    </AnimatedSection>
                                </Col>
                            ))}
                        </Row>
                    </Container>
                </section>

                {/* Features Section - Dark Glass styling with Vibrant Accents */}
                <section className="py-5 position-relative">
                    <Container>
                        {/* Feature 1 */}
                        <AnimatedSection delay="delay-100">
                        <div className="card card-vibrant mb-5 rounded-4">
                            <Row className="g-0 align-items-center">
                                <Col lg={6} className="p-5">
                                    <div className="icon-box d-inline-flex align-items-center justify-content-center p-3 rounded-3 mb-4" style={{ background: "rgba(59, 130, 246, 0.1)" }}>
                                        <i className="mdi mdi-shield-lock-outline text-primary fs-3"></i>
                                    </div>
                                    <h3 className="fw-bold mb-3 text-high-contrast">Dynamic Position Sizing</h3>
                                    <p className="text-medium-contrast mb-4 lh-lg">
                                        Most traders fail because of inconsistent bet sizing. Trrader normalizes your risk across different assets and volatility levels. 
                                    </p>
                                    <ul className="list-unstyled text-medium-contrast mb-0 d-flex flex-column gap-3">
                                        <li className="d-flex align-items-center gap-3">
                                            <i className="mdi mdi-check-circle text-primary fs-5"></i> 
                                            <span><strong>Asset Agnostic:</strong> Works seamlessly for XAUUSD, BTCUSD, and Major Pairs.</span>
                                        </li>
                                        <li className="d-flex align-items-center gap-3">
                                            <i className="mdi mdi-check-circle text-primary fs-5"></i> 
                                            <span><strong>Volatility Adjustment:</strong> Accounts for ATR and spread variations automatically.</span>
                                        </li>
                                    </ul>
                                </Col>
                                <Col lg={6} className="bg-dark bg-opacity-50 h-100 position-relative overflow-hidden">
                                    <div className="position-absolute top-0 end-0 w-100 h-100" style={{ background: "linear-gradient(45deg, transparent 40%, rgba(59, 130, 246, 0.1) 100%)" }}></div>
                                    <div className="p-4 h-100 d-flex align-items-center justify-content-center" style={{ minHeight: "400px" }}>
                                        <div className="position-relative group-hover-zoom">
                                            <img 
                                                src={riskcalculator} 
                                                alt="Risk Calculator" 
                                                className="img-fluid rounded-3 shadow-lg transform-rotate-left animate-float" 
                                                style={{ transform: "perspective(1000px) rotateY(-5deg) scale(0.95)", transition: "transform 0.3s", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", cursor: "zoom-in" }} 
                                                onClick={() => setSelectedImage(riskcalculator)}
                                            />
                                            <div className="position-absolute top-50 start-50 translate-middle opacity-0 hover-opacity-100 transition-opacity pointer-events-none">
                                                <div className="bg-black bg-opacity-50 rounded-circle p-3">
                                                    <i className="mdi mdi-magnify-plus-outline text-white fs-2"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        </AnimatedSection>

                        {/* Feature 2 (Reversed) */}
                        <AnimatedSection delay="delay-200">
                        <div className="card card-vibrant rounded-4">
                            <Row className="g-0 align-items-center flex-row-reverse">
                                <Col lg={6} className="p-5">
                                    <div className="icon-box d-inline-flex align-items-center justify-content-center p-3 rounded-3 mb-4" style={{ background: "rgba(16, 185, 129, 0.1)" }}>
                                        <i className="mdi mdi-chart-areaspline text-success fs-3"></i>
                                    </div>
                                    <h3 className="fw-bold mb-3 text-high-contrast">Drawdown Simulation</h3>
                                    <p className="text-medium-contrast mb-4 lh-lg">
                                        Understand your strategy's breaking point. Our simulation engine stresses your account balance against consecutive losses to help you visualize risk.
                                    </p>
                                    <ul className="list-unstyled text-medium-contrast mb-0 d-flex flex-column gap-3">
                                        <li className="d-flex align-items-center gap-3">
                                            <i className="mdi mdi-check-circle text-success fs-5"></i> 
                                            <span><strong>Survival Metrics:</strong> Calculations based on Monte Carlo simulation principles.</span>
                                        </li>
                                        <li className="d-flex align-items-center gap-3">
                                            <i className="mdi mdi-check-circle text-success fs-5"></i> 
                                            <span><strong>Recovery Modeling:</strong> See exactly what ROI is needed to recover from a 20% drawdown.</span>
                                        </li>
                                    </ul>
                                </Col>
                                <Col lg={6} className="bg-dark bg-opacity-50 h-100 position-relative overflow-hidden">
                                     <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: "linear-gradient(-45deg, transparent 40%, rgba(16, 185, 129, 0.1) 100%)" }}></div>
                                    <div className="p-4 h-100 d-flex align-items-center justify-content-center" style={{ minHeight: "400px" }}>
                                        <div className="position-relative group-hover-zoom">
                                            <img 
                                                src={riskcalculatorresult} 
                                                alt="Risk Analysis" 
                                                className="img-fluid rounded-3 shadow-lg animate-float-inverse" 
                                                style={{ transform: "perspective(1000px) rotateY(5deg) scale(0.95)", transition: "transform 0.3s", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", cursor: "zoom-in" }} 
                                                onClick={() => setSelectedImage(riskcalculatorresult)}
                                            />
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        </AnimatedSection>
                    </Container>
                </section>

                {/* FAQ Section */}
                <section className="py-5 bg-opacity-50">
                    <Container style={{ maxWidth: "800px" }}>
                        <AnimatedSection className="text-center mb-5">
                            <h2 className="fw-bold display-6 text-high-contrast">Frequently Asked Questions</h2>
                        </AnimatedSection>
                        
                        <AnimatedSection delay="delay-100">
                            <div className="landing-accordion">
                                <UncontrolledAccordion defaultOpen="1">
                                    <AccordionItem>
                                        <AccordionHeader targetId="1">
                                            Is Trrader suitable for absolute beginners?
                                        </AccordionHeader>
                                        <AccordionBody accordionId="1">
                                            Absolutely. In fact, it is crucial for beginners to start with proper risk management habits. Trrader simplifies complex calculations so you can focus on learning market dynamics without blowing your account.
                                        </AccordionBody>
                                    </AccordionItem>
                                    <AccordionItem>
                                        <AccordionHeader targetId="2">
                                            Does it work for Crypto and Forex?
                                        </AccordionHeader>
                                        <AccordionBody accordionId="2">
                                            Yes. Our calculator supports all major asset classes including Forex pairs, Cryptocurrencies, Indices, and Commodities. You can customize the contract size and currency.
                                        </AccordionBody>
                                    </AccordionItem>
                                    <AccordionItem>
                                        <AccordionHeader targetId="3">
                                            Is my trading data secure?
                                        </AccordionHeader>
                                        <AccordionBody accordionId="3">
                                            We prioritize your privacy. Trrader does not connect directly to your broker account, so we never have access to your funds. All calculations are performed on our secure platform.
                                        </AccordionBody>
                                    </AccordionItem>
                                    <AccordionItem>
                                        <AccordionHeader targetId="4">
                                            Is Trrader free to use?
                                        </AccordionHeader>
                                        <AccordionBody accordionId="4">
                                            We offer a comprehensive free tier that includes essential risk calculation tools. Advanced analytics and historical tracking features are available in our Pro plan.
                                        </AccordionBody>
                                    </AccordionItem>
                                </UncontrolledAccordion>
                            </div>
                        </AnimatedSection>
                    </Container>
                </section>

                {/* Dashboard Showcase - Full Width */}
                <section className="py-5 my-5 position-relative overflow-hidden">
                     {/* Background Glow */}
                    <div className="position-absolute w-100 h-100 top-0 start-0" style={{ background: "linear-gradient(180deg, rgba(71,71,161,0.05) 0%, rgba(15,17,26,0) 100%)" }}></div>
                    <Container className="position-relative z-1">
                        <AnimatedSection className="text-center max-width-800 mx-auto mb-5">
                            <h2 className="fw-bold display-5 mb-3 text-high-contrast">Unified Command Center</h2>
                            <p className="text-medium-contrast fs-5">
                                Stop switching between spreadhseets and charts. Manage your entire risk profile from a single, intuitive dashboard.
                            </p>
                        </AnimatedSection>
                        
                        <AnimatedSection delay="delay-200" className="position-relative p-2 rounded-4 mx-auto" style={{ maxWidth: "1100px", background: "linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(255,255,255,0.01))", backdropFilter: "blur(20px)" }}>
                             <div className="position-relative group-hover-zoom">
                                <img 
                                    src={productOverview} 
                                    className="img-fluid rounded-3 shadow-lg w-100" 
                                    alt="Dashboard" 
                                    style={{ cursor: "zoom-in" }}
                                    onClick={() => setSelectedImage(productOverview)}
                                />
                             </div>
                        </AnimatedSection>
                    </Container>
                </section>

                {/* Quote Section - Light Accent */}
                <section className="py-5 position-relative overflow-hidden">
                    <Container>
                        <AnimatedSection>
                        <div className="p-5 rounded-4 position-relative overflow-hidden" style={{ background: "#fff", color: "#0f111a" }}>
                            <Row className="align-items-center">
                                <Col lg={7}>
                                    <span className="text-primary fw-bold text-uppercase letter-spacing-2 mb-2 d-block small">The Disciplined Mindset</span>
                                    <h2 className="display-6 fw-bold mb-4 font-serif fst-italic">"The goal of a successful trader is to make the best trades. Money is secondary."</h2>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: "48px", height: "48px" }}>A</div>
                                        <div>
                                            <h5 className="mb-0 fw-bold">Alexander Elder</h5>
                                            <small className="text-muted">Trading for a Living</small>
                                        </div>
                                    </div>
                                </Col>
                                <Col lg={5} className="text-center mt-4 mt-lg-0">
                                    <img src={tradingdesktops} className="img-fluid rounded-3 shadow-lg" alt="Trading setup" style={{ transform: "rotate(3deg) scale(1.05)" }} />
                                </Col>
                            </Row>
                        </div>
                        </AnimatedSection>
                    </Container>
                </section>

                {/* Footer CTA */}
                <section className="py-5 position-relative">
                    <Container>
                        <AnimatedSection>
                        <div className="p-5 rounded-5 text-center position-relative overflow-hidden" 
                             style={{ 
                                 background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)",
                                 boxShadow: "0 20px 60px -15px rgba(59, 130, 246, 0.5)"
                             }}>
                            <div className="position-relative z-1 py-4">
                                <h2 className="display-5 fw-bold text-white mb-3">Ready to trade like a professional?</h2>
                                <p className="text-white opacity-90 fs-5 mb-5 max-width-600 mx-auto">Join thousands of traders who have stopped gambling and started managing risk with precision.</p>
                                <div onClick={signInWithGoogle} className="d-inline-block cursor-pointer bg-white text-primary fw-bold px-5 py-3 rounded-pill shadow-lg hover-scale" style={{ transition: "transform 0.2s", cursor: "pointer" }}>
                                    <div className="d-flex align-items-center gap-2">
                                        <img src="https://www.google.com/favicon.ico" alt="G" width="20" />
                                        <span>Get Started with Google</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Decorative Circles */}
                            <div className="position-absolute top-0 start-0 translate-middle rounded-circle bg-white animate-pulse" style={{ width: "300px", height: "300px", opacity: "0.1" }}></div>
                            <div className="position-absolute bottom-0 end-0 translate-middle rounded-circle bg-white animate-pulse" style={{ width: "400px", height: "400px", opacity: "0.1" }}></div>
                        </div>
                        </AnimatedSection>
                    </Container>
                </section>

                {/* Main Footer */}
                <footer className="py-5 border-top border-white border-opacity-10" style={{ background: "#06070a" }}>
                    <Container>
                        <Row className="g-5">
                            <Col lg={4}>
                                <div className="d-flex align-items-center gap-2 mb-4">
                                    <img src={logoVoiled} alt="Logo" width="32" />
                                    <h5 className="text-high-contrast m-0 fw-bold">Trrader.in</h5>
                                </div>
                                <p className="text-medium-contrast small lh-lg mb-4">
                                    Trrader provides institutional-grade risk management analytics for the retail trader. Our mission is to promote longevity through discipline.
                                </p>
                                <div className="d-flex gap-3 social-links">
                                    <a href="#" className="text-medium-contrast hover-text-white"><i className="mdi mdi-twitter fs-4"></i></a>
                                    <a href="#" className="text-medium-contrast hover-text-white"><i className="mdi mdi-linkedin fs-4"></i></a>
                                    <a href="#" className="text-medium-contrast hover-text-white"><i className="mdi mdi-instagram fs-4"></i></a>
                                </div>
                            </Col>
                            <Col lg={2}>
                                <h6 className="text-high-contrast fw-bold mb-4">Platform</h6>
                                <ul className="list-unstyled d-flex flex-column gap-3 text-medium-contrast small">
                                    <li><Link to="/" className="text-decoration-none text-medium-contrast hover-text-white">Home</Link></li>
                                    <li><Link to="/openpricing" className="text-decoration-none text-medium-contrast hover-text-white">Pricing</Link></li>
                                    <li><Link to="/calculators" className="text-decoration-none text-medium-contrast hover-text-white">Calculators</Link></li>
                                </ul>
                            </Col>
                            <Col lg={2}>
                                <h6 className="text-high-contrast fw-bold mb-4">Resources</h6>
                                <ul className="list-unstyled d-flex flex-column gap-3 text-medium-contrast small">
                                    <li><Link to="/blog" className="text-decoration-none text-medium-contrast hover-text-white">Blog</Link></li>
                                    <li><Link to="/guide" className="text-decoration-none text-medium-contrast hover-text-white">User Guide</Link></li>
                                    <li><Link to="/faq" className="text-decoration-none text-medium-contrast hover-text-white">FAQ</Link></li>
                                </ul>
                            </Col>
                             <Col lg={4}>
                                <h6 className="text-high-contrast fw-bold mb-4">Legal</h6>
                                <ul className="list-unstyled d-flex flex-column gap-3 text-medium-contrast small">
                                    <li><Link to="/termsandconditions" className="text-decoration-none text-medium-contrast hover-text-white">Terms of Conditons</Link></li>
                                    <li><Link to="/privacypolicy" className="text-decoration-none text-medium-contrast hover-text-white">Privacy Policy</Link></li>
                                </ul>
                            </Col>
                        </Row>
                        <div className="pt-5 mt-5 border-top border-white border-opacity-5 text-center text-medium-contrast small">
                            <p className="mb-0">&copy; {new Date().getFullYear()} Trrader. All rights reserved. Built by Trrader, for Trrader.</p>
                        </div>
                    </Container>
                </footer>
                
                {/* Image Zoom Modal */}
                {selectedImage && (
                    <div 
                        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-4 animate-fade-in-up" 
                        style={{ zIndex: 9999, background: "rgba(11, 14, 23, 0.95)", backdropFilter: "blur(20px)" }}
                        onClick={() => setSelectedImage(null)}
                    >
                        <div className="position-relative" style={{ maxWidth: "90%", maxHeight: "90%" }}>
                            <img 
                                src={selectedImage} 
                                alt="Zoomed Feature" 
                                className="img-fluid rounded-4 shadow-lg border border-white border-opacity-10" 
                                style={{ maxHeight: "90vh", userSelect: "none", boxShadow: "0 0 100px rgba(79, 70, 229, 0.3)" }} 
                            />
                            <div className="position-absolute top-0 end-0 m-3 text-white cursor-pointer p-2 bg-dark bg-opacity-75 rounded-circle d-flex align-items-center justify-content-center hover-scale transition-all border border-white border-opacity-10" style={{ width: "40px", height: "40px" }}>
                                <i className="mdi mdi-close fs-4"></i>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </React.Fragment>
    );
};

export default withRouter(Landing);

Landing.propTypes = {
    history: PropTypes.object,
};