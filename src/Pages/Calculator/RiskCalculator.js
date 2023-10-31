import React, { useEffect, useRef, useState } from "react"
import classnames from "classnames";
import {
    Row,
    Col,
    Card,
    CardBody,
    FormGroup,
    Button,
    CardTitle,
    CardSubtitle,
    Label,
    Input,
    Container,
    FormFeedback,
    Form,
    CardText,
    CardHeader,
    UncontrolledAlert,
    Progress,
    Toast,
    ToastHeader,
    ToastBody,
    Modal,
    NavItem,
    NavLink,
    Nav,
    TabPane,
    TabContent
} from "reactstrap";

//Import Breadcrumb
import logoVoiled from "../../assets/images/OnlyLogoVoiled.png";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import * as Yup from "yup";
import { useFormik } from "formik";
import calculator from "../../assets/images/calculator.gif";
import DayWiseCapitalDrawDown from "./DayWiseCapitalDrawDown";
import { IndexType, BANKNIFTY_LOT_SIZE, FINNIFTY_LOT_SIZE, NIFTY50_LOT_SIZE } from "../../constants/NSE_index";
import CustomOptionPremiumStackedBar from "./CustomOptionPremiumStackedBar";
import LotSizeCards from "../CommonPages/LotSizeCards";
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getFirebaseBackend } from "../../helpers/firebase_helper";

const DEFAULT_MAX_SL_COUNT_ONE_DAY = 2;
const DEFAULT_MAX_DRAW_DOWN_PERCENTAGE = 15;
const DEFAULT_TARGET_RATIO_MULTIPLIER = 2;

const RiskCalculator = (props) => {
    const navigate = useNavigate()
    document.title = "Risk Calculator";
    const premiumOnlyInputs = ['maxSLCountOneDay', 'maxDrawDownPercentage', 'targetRatioMultiplier']
    const [loggedInUser, setLoggedInUser] = useState(null)
    const [purchasePremiumModal, setPurchasePremiumModal] = useState(false);
    const [configNameModal, setConfigNameModal] = useState(false);
    const [activeTab, setactiveTab] = useState("1");
    const [riskCalculatorConfigs, setRiskCalculatorConfigs] = useState([]);
    const [configName, setConfigName] = useState("");
    useEffect(() => {
        if (props.user) {
            setLoggedInUser(JSON.parse(JSON.stringify(props.user)))
        } else {
            setLoggedInUser(null)
            navigate('/logout');
        }
    }, [props.user])

    const toggle2 = async (tab) => {
        if (activeTab !== tab) {
          if(tab == "2"){
            const response = await fetchRiskCalculatorConfigs();
           
          }
          setactiveTab(tab);
        }
      };
    

    const fetchRiskCalculatorConfigs = async () => {
        const response = await getFirebaseBackend().fetchRiskCalculatorConfigFromFirestore();
        if(response.status){
            setRiskCalculatorConfigs([...response.data]);
        }
    }

    // useEffect(() => { 
    //     console.log("riskCalculatorConfigs", riskCalculatorConfigs)
    //  },[riskCalculatorConfigs]) 


    const [invalidFormValueToast, setInvalidFormValueToast] = React.useState(false);
    const toggleInvalidFormValueToast = () => {
        setInvalidFormValueToast(!invalidFormValueToast);
        setTimeout(() => {
            setInvalidFormValueToast(false);
        }, 4000);
    }
    const [disableTheInputs, setDisableTheInputs] = useState(true);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(IndexType.BANKNIFTY);
    const [selectedIndexCalculatedRisk, setSelectedIndexCalculatedRisk] = useState({});

    const resultContainerRef = useRef(null);
    const scrollTop = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth',
        });
    };

    const [tradeIndexes, setTradeIndexes] = useState([{
        indexName: IndexType.BANKNIFTY,
        lotSize: BANKNIFTY_LOT_SIZE,
        optionPremium: 50,
    },
    {
        indexName: IndexType.FINNIFTY,
        lotSize: FINNIFTY_LOT_SIZE,
        optionPremium: 30,
    },
    {
        indexName: IndexType.NIFTY50,
        lotSize: NIFTY50_LOT_SIZE,
        optionPremium: 40,
    }
    ])

    const disableInputsHandler = () => {
        if (loggedInUser && !loggedInUser.isPremiumOrTrial) {
            setPurchasePremiumModal(true);
            return;
        } else {
            setDisableTheInputs(!disableTheInputs);
        }
    }


    const [calculateMetadata, setCalculateMetadata] = useState({
        maxSLCapacityDaily: 0,
        maxSLCapacityInOneTrade: 0,
        maxTradeAmountInOneDay: 0,
        numberOfTradingSessions: 0
    });

    const [calculatedRiskRows, setCalculatedRiskRows] = useState([]);

    // Form validation
    const riskCalculatorForm = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            tradingCapital: 10000,
            desiredNumberOfTradingSessions: 10,
            percentageOfTradingCapitalInOneTrade: 0,
            maxSLCountOneDay: DEFAULT_MAX_SL_COUNT_ONE_DAY,
            maxDrawDownPercentage: DEFAULT_MAX_DRAW_DOWN_PERCENTAGE,
            targetRatioMultiplier: DEFAULT_TARGET_RATIO_MULTIPLIER,
        },
        validationSchema: Yup.object().shape({
            tradingCapital: Yup.number().required("Please provide your Trading Capital"),
            desiredNumberOfTradingSessions: Yup.number()
                .typeError('Desired Trading Sessions must be a number')
                // .required("Please provide desired number of Trading Sessions")
                .min(0, "Desired Trading Sessions should be at least 0")
                .max(60, "Desired Trading Sessions be at most 60 "),
            maxSLCountOneDay: Yup.number()
                .typeError('Maximum number of Stop Loss must be a number')
                .required("Please provide Maximum number of Stop Loss you want to take in a day")
                .min(0, "Minimum number of Stop Loss should be at least 0")
                .max(3, "Maximum number of Stop Loss can be at most 3 "),
            maxDrawDownPercentage: Yup.number()
                .typeError('Maximum SL(Drawdown) must be a number')
                .required("Please Enter Your Maximum SL(Drawdown) Percentage")
                .min(1, "Minimum number of Maximum SL(Drawdown) should be at least 1")
                .max(30, "Maximum number of Maximum SL(Drawdown) can be at most 30 "),
            targetRatioMultiplier: Yup.number()
                .typeError('Target ratio must be a number')
                .required("Please Enter Your Target ratio")
                .min(1, "Minimum Target ratio should be at least 1")
                .max(30, "Maximum Target ratio can be at most 30 "),
            percentageOfTradingCapitalInOneTrade: Yup.number()
                .typeError('Percentage of Trading Capital must be a number')
                .min(0, "Minimum Percentage of Trading Capital should be at least 0")
                .max(100, "Maximum Percentage of Trading Capital can be at most 100 "),

        }),
        onSubmit: async (formValues) => {

            if (formValues.desiredNumberOfTradingSessions == 0 && formValues.percentageOfTradingCapitalInOneTrade == 0) {
                // alert("Please provide either number of Trading Sessions or Percentage of Trading Capital in 1 Trade")
                toggleInvalidFormValueToast();
                return;
            }

            setLoading(true)
            setSelectedIndex(null);
            await new Promise(r => setTimeout(r, 1500));
            validatePremiumInputs(formValues);
            calculateRisk(formValues);
            scrollTop()
        },

    });

    const validatePremiumInputs = (formValues) => {
        if (loggedInUser && !loggedInUser.isPremiumOrTrial) {
            for (let i = 0; i < premiumOnlyInputs.length; i++) {
                if (premiumOnlyInputs[i] === 'maxSLCountOneDay' && formValues.maxSLCountOneDay != DEFAULT_MAX_SL_COUNT_ONE_DAY) {
                    formValues.maxSLCountOneDay = DEFAULT_MAX_SL_COUNT_ONE_DAY
                } else if (premiumOnlyInputs[i] === 'maxDrawDownPercentage' && formValues.maxDrawDownPercentage != DEFAULT_MAX_DRAW_DOWN_PERCENTAGE) {
                    formValues.maxDrawDownPercentage = DEFAULT_MAX_DRAW_DOWN_PERCENTAGE
                } else if (premiumOnlyInputs[i] === 'targetRatioMultiplier' && formValues.targetRatioMultiplier != DEFAULT_TARGET_RATIO_MULTIPLIER) {
                    formValues.targetRatioMultiplier = DEFAULT_TARGET_RATIO_MULTIPLIER
                }
            }
        }
    }

    const handleOnChange = (event) => {
        const { name, value } = event.target;
        if (name == 'desiredNumberOfTradingSessions') {
            riskCalculatorForm.setFieldValue('percentageOfTradingCapitalInOneTrade', 0);
        } else if (name == 'percentageOfTradingCapitalInOneTrade') {
            riskCalculatorForm.setFieldValue('desiredNumberOfTradingSessions', 0);
        }
        // riskCalculatorForm.setFieldValue(name, value);
    }

    const calculateRisk = (riskCalculatorFormValues) => {
        // Calculate Risk Metadata
        const metadataResult = calculateRiskMetadata(riskCalculatorFormValues);
        setCalculateMetadata({ ...metadataResult });
        let calculatedRiskRows = [];
        tradeIndexes.forEach((tradeIndex) => {
            const { lotSize, optionPremium, indexName } = tradeIndex;
            let calculatedRiskOfIndexResult = calculateRiskofIndex(riskCalculatorFormValues, lotSize, optionPremium, indexName, metadataResult.maxSLCapacityInOneTrade, metadataResult);
            calculatedRiskRows.push(calculatedRiskOfIndexResult);
        });

        setCalculatedRiskRows(calculatedRiskRows);
        setSelectedIndex(IndexType.BANKNIFTY);
        setLoading(false)

    }

    const calculateRiskofIndex = (riskCalculatorFormValues, lotSize, optionPremium, indexName, maxSLCapacityInOneTrade, calculateMetadata) => {
        let calculatedLotSize = lotSize;
        riskCalculatorFormValues.optionPremium = optionPremium;
        let SLAmountInOptionPremium = calculateSLAmountInOptionPremium(riskCalculatorFormValues);
        let TargetAmountInOptionPremium = calculateTargetAmountInOptionPremium(riskCalculatorFormValues, SLAmountInOptionPremium);
        let optionPremiumTargetPrice = calculateOptionPremiumTargetPrice(riskCalculatorFormValues, SLAmountInOptionPremium);
        let optionPremiumExitPrice = calculateOptionPremiumExitPrice(riskCalculatorFormValues, SLAmountInOptionPremium);
        let totalTradableLots = calculateTotalTradableLots(riskCalculatorFormValues, maxSLCapacityInOneTrade, calculatedLotSize);
        let totalTradableQuantity = calculateTotalTradableQuantity(totalTradableLots, calculatedLotSize);
        let singleTradeAmount = calculateTotalTradeCapital(riskCalculatorFormValues, totalTradableQuantity);
        let totalSLofTrade = calculateTotalSLofTrade(totalTradableQuantity, SLAmountInOptionPremium);
        let totalTargetofTrade = calculateTotalTargetofTrade(optionPremiumTargetPrice, totalTradableQuantity, singleTradeAmount);
        let capitalLeftAfterTradingSessions = calculateCapitalLeftAfterTradingSessions(riskCalculatorFormValues, totalSLofTrade);
        // let drawDownMetricsResult = calculateDrawDownMetrics(riskCalculatorFormValues)


        let remainingCapitalDayWise = []
        let capitalDayWiseLabels = []
        let currentCapital = riskCalculatorFormValues.tradingCapital;
        let maxTradingSessions = calculateMetadata.numberOfTradingSessions;
        for (let i = 1; i <= maxTradingSessions; i++) {
            capitalDayWiseLabels.push(`Day ${i}`);
            remainingCapitalDayWise.push(currentCapital - (totalSLofTrade * riskCalculatorFormValues.maxSLCountOneDay));
            currentCapital = remainingCapitalDayWise[remainingCapitalDayWise.length - 1];
        }
        let series = [
            {
                name: 'Capital',
                type: 'column',
                data: [...remainingCapitalDayWise]
            }
        ]
        let labels = [...capitalDayWiseLabels]
        // console.log("capitalDayWiseLabels", capitalDayWiseLabels);
        // console.log("remainingCapitalDayWise", remainingCapitalDayWise);

        return {
            lotSize: calculatedLotSize,
            optionPremium: optionPremium,
            indexName: indexName,
            SLAmountInOptionPremium,
            TargetAmountInOptionPremium,
            optionPremiumTargetPrice,
            optionPremiumExitPrice,
            totalTradableLots,
            totalTradableQuantity,
            singleTradeAmount,
            totalSLofTrade,
            totalTargetofTrade,
            capitalLeftAfterTradingSessions,
            drawDownMetrics: {
                labels,
                series
            }

        }

    }


    const calculateRiskMetadata = (riskCalculatorFormValues) => {
        const maxSLCapacityDaily = riskCalculatorFormValues.desiredNumberOfTradingSessions ? Math.floor((riskCalculatorFormValues.tradingCapital - (riskCalculatorFormValues.tradingCapital / riskCalculatorFormValues.desiredNumberOfTradingSessions)) / riskCalculatorFormValues.desiredNumberOfTradingSessions) : Math.floor((riskCalculatorFormValues.tradingCapital * riskCalculatorFormValues.percentageOfTradingCapitalInOneTrade / 100) * (riskCalculatorFormValues.maxDrawDownPercentage / 100) * riskCalculatorFormValues.maxSLCountOneDay);
        const maxSLCapacityInOneTrade = Math.floor(maxSLCapacityDaily / riskCalculatorFormValues.maxSLCountOneDay);
        const numberOfTradingSessions = riskCalculatorFormValues.desiredNumberOfTradingSessions ? riskCalculatorFormValues.desiredNumberOfTradingSessions : Math.floor(((riskCalculatorFormValues.tradingCapital - (riskCalculatorFormValues.tradingCapital * (riskCalculatorFormValues.percentageOfTradingCapitalInOneTrade / 100))) / maxSLCapacityInOneTrade) / riskCalculatorFormValues.maxSLCountOneDay) + 1; //1 is added to consider the buffer amount left after trading sessions
        const maxTradeAmountInOneDay = Math.floor(100 * (maxSLCapacityInOneTrade / riskCalculatorFormValues.maxDrawDownPercentage))

        // console.log("riskCalculatorFormValues", riskCalculatorFormValues);
        // console.log("maxSLCapacityDaily", maxSLCapacityDaily);
        // console.log("maxSLCapacityInOneTrade", maxSLCapacityInOneTrade);
        // console.log("numberOfTradingSessions", numberOfTradingSessions);
        // console.log("maxTradeAmountInOneDay", maxTradeAmountInOneDay);
        return {
            maxSLCapacityDaily,
            maxSLCapacityInOneTrade,
            maxTradeAmountInOneDay,
            numberOfTradingSessions
        }
    }
    const calculateSLAmountInOptionPremium = (riskCalculatorFormValues,) => {
        return Math.floor(riskCalculatorFormValues.optionPremium * (riskCalculatorFormValues.maxDrawDownPercentage / 100));
    }
    const calculateTargetAmountInOptionPremium = (riskCalculatorFormValues, SLAmountInOptionPremium) => {
        return Math.floor(SLAmountInOptionPremium * riskCalculatorFormValues.targetRatioMultiplier);
    }
    const calculateOptionPremiumTargetPrice = (riskCalculatorFormValues, SLAmountInOptionPremium) => {
        return Math.floor(riskCalculatorFormValues.optionPremium + (SLAmountInOptionPremium * riskCalculatorFormValues.targetRatioMultiplier));
    }
    const calculateOptionPremiumExitPrice = (riskCalculatorFormValues, SLAmountInOptionPremium) => {
        return Math.floor(riskCalculatorFormValues.optionPremium - SLAmountInOptionPremium);

    }
    const calculateTotalTradableLots = (riskCalculatorFormValues, maxSLCapacityInOneTrade, lotSize) => {
        return riskCalculatorFormValues.optionPremium ? Math.floor((maxSLCapacityInOneTrade / (riskCalculatorFormValues.optionPremium * (riskCalculatorFormValues.maxDrawDownPercentage / 100))) / lotSize) : 0;
    }
    const calculateTotalTradableQuantity = (totalTradableLots, lotSize) => {
        return totalTradableLots * lotSize;
    }
    const calculateTotalTradeCapital = (riskCalculatorFormValues, totalTradableQuantity) => {
        return totalTradableQuantity * riskCalculatorFormValues.optionPremium;
    }
    const calculateTotalSLofTrade = (totalTradableQuantity, SLAmountInOptionPremium) => {
        return totalTradableQuantity * SLAmountInOptionPremium;

    }
    const calculateTotalTargetofTrade = (optionPremiumTargetPrice, totalTradableQuantity, singleTradeAmount) => {
        return (optionPremiumTargetPrice * totalTradableQuantity) - singleTradeAmount;
    }
    const calculateCapitalLeftAfterTradingSessions = (riskCalculatorFormValues, totalSLofTrade) => {
        return riskCalculatorFormValues.tradingCapital - (totalSLofTrade * calculateMetadata.numberOfTradingSessions * riskCalculatorFormValues.maxSLCountOneDay);
    }


    const handleResetClick = () => {
        riskCalculatorForm.resetForm(); // Reset the form's values and errors
    };
    const optionPremiumChangeHandler = async (event, indexName) => {
        let updatedOptionPremium = event.target.value;
        if (event.target.value === '') {
            updatedOptionPremium = '';
            // console.log("event.target.value", event.target.value)
            // return

        } else if (event.target.value < 0) {
            updatedOptionPremium = 0;
        } else if (event.target.value) {
            updatedOptionPremium = parseInt(event.target.value);
        }
        let updatedCalculateRiskRows = [];
        setCalculatedRiskRows([]);
        calculatedRiskRows.forEach((riskRow) => {
            if (riskRow.indexName == indexName) {

                riskRow.optionPremium = updatedOptionPremium != '' ? parseInt(updatedOptionPremium) : 0

                const calculatedRiskOfIndexResult = calculateRiskofIndex(riskCalculatorForm.values, riskRow.lotSize, riskRow.optionPremium, riskRow.indexName, calculateMetadata.maxSLCapacityInOneTrade, calculateMetadata);

                if (riskRow.optionPremium == '') {
                    calculatedRiskOfIndexResult.optionPremium = ''
                }
                updatedCalculateRiskRows.push(calculatedRiskOfIndexResult);
            } else {
                updatedCalculateRiskRows.push(riskRow);
            }
        })
        setCalculatedRiskRows(updatedCalculateRiskRows);
    }
    const tradeIndexChangeHandler = async (event) => {
        setSelectedIndex(event.target.value);
        // console.log("event.target.value", event.target.value)
    }

    useEffect(() => {
        if (selectedIndex && selectedIndex != null && calculatedRiskRows.length > 0) {
            calculatedRiskRows.forEach((riskRow) => {
                if (riskRow.indexName == selectedIndex) {
                    setSelectedIndexCalculatedRisk(riskRow);
                }
            })
        }
    }, [selectedIndex, calculatedRiskRows]);

    const loadSavedConfiguration = (config) => {
        riskCalculatorForm.setValues(config.parsedConfig);
        riskCalculatorForm.setTouched({});
        riskCalculatorForm.setErrors({});
        riskCalculatorForm.submitForm();
        toggle2("1");
    }
    // useEffect(() => {  
    //     const firebaseApp = getFirebaseApp();
    //     const firebaseAuth = getAuth(firebaseApp);
    //     console.log("firebaseAuth", firebaseAuth.currentUser)
    //  },[])


    // const updateProgressBar = async () => {
    //     // setInterval(() => {
    //         let progressBarValue = 0
    //         setProgressBarValue(0)
    //         setLoading(true);
    //         await new Promise(r => setTimeout(r, 2000));
    //         for(let i=0; i<100; i++){
    //             if(progressBarValue < 100){
    //                 progressBarValue +=1
    //                 setProgressBarValue(progressBarValue);
    //                 setLoading(true);
    //             }else if(progressBarValue == 100){
    //             setLoading(false);
    //             }
    //         }
    //     // },500)
    // }

    const saveConfiguration = async () => {

        if (loggedInUser && !loggedInUser.isPremiumOrTrial) {
            setPurchasePremiumModal(true);
            return
        }

        if (!configName) {
            alert("Please provide a name for the configuration");
            return;
        }
      setLoading(true);
      const response = await getFirebaseBackend().addOrUpdateRiskCalculatorConfigToFirestore(riskCalculatorForm.values, configName);
        if(response.status){
            setConfigNameModal(false);
            setConfigName("");
        }
        setLoading(false);
        toggle2("2");
    }
    return (
        <React.Fragment>
            <div className="page-content landing-header-main">
                <Container fluid={true}>
                    <Breadcrumbs title="F&O Calculator" breadcrumbItem="Risk Calculator" />
                </Container>
                <Row>
                    <Col xl={12}>
                        <Card>
                        <Nav pills className="navtab-bg nav-justified" style={{borderBottom:'1px solid #ccc'}}>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: activeTab === "1",
                        })}
                        onClick={() => {
                          toggle2("1");
                        }}
                      >
                        <i className="mdi mdi-calculator-variant me-1 align-middle"> </i>{" "}
                        Risk Configuration
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: activeTab === "2",
                        })}
                        onClick={() => {
                          toggle2("2");
                        }}
                      >
                        <i className="mdi mdi-cog me-1 align-middle"></i>{" "}
                        Saved Configurations
                      </NavLink>
                    </NavItem>
                    
                  </Nav>
                            {/* <CardHeader className="configuration-header">
                                <h5 className="card-title mb-0 text-white"></h5>
                            </CardHeader> */}
                    <TabContent activeTab={activeTab} className="p-3 text-muted">
                    <TabPane tabId="1">
                      <Row>
                        <Col sm="12">
                        <CardBody style={{ background: "rgb(241 241 241 / 7%)" }}>
                                {/* <CardTitle>Risk Calculator</CardTitle> */}
                                <br />
                                <CardSubtitle className="mb-3">
                                    This tool will help you <strong>calculate the approximate amount</strong> you can <strong style={{ color: "Red" }}>risk in a trade</strong>  based on your capital, stop loss per trade, and money management.
                                </CardSubtitle>
                                <br />
                                <Form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        riskCalculatorForm.handleSubmit();
                                        return false;
                                    }}
                                    onChange={handleOnChange}
                                    className="calculator-form"
                                >
                                    <Row>
                                        <Col xl="6">
                                            <Row>
                                                <Col xl="6">
                                                    <div className="mb-3">
                                                        <Label className="form-label calculator-form-input-label">Trading Capital</Label>
                                                        <Input
                                                            name="tradingCapital"
                                                            label="tradingCapital"
                                                            placeholder="Please provide your Trading Capital"
                                                            type="number"
                                                            className="calculator-form-input"
                                                            onChange={riskCalculatorForm.handleChange}
                                                            onBlur={riskCalculatorForm.handleBlur}
                                                            value={riskCalculatorForm.values.tradingCapital || ""}
                                                            invalid={
                                                                riskCalculatorForm.touched.tradingCapital &&
                                                                    riskCalculatorForm.errors.tradingCapital
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                        {riskCalculatorForm.touched.tradingCapital &&
                                                            riskCalculatorForm.errors.tradingCapital ? (
                                                            <FormFeedback type="invalid">
                                                                {riskCalculatorForm.errors.tradingCapital}
                                                            </FormFeedback>
                                                        ) : null}
                                                    </div>
                                                </Col>
                                                <Col xl="12">
                                                    <Row className="grouped-row">
                                                        <Col xl="5">
                                                            <Label className="form-label calculator-form-input-label">Desired No. of Trading Days</Label>
                                                            <Input
                                                                name="desiredNumberOfTradingSessions"
                                                                label="desiredNumberOfTradingSessions"
                                                                className="calculator-form-input"
                                                                placeholder=""
                                                                type="number"
                                                                onChange={riskCalculatorForm.handleChange}
                                                                onBlur={riskCalculatorForm.handleBlur}
                                                                value={riskCalculatorForm.values.desiredNumberOfTradingSessions || ""}
                                                                invalid={
                                                                    riskCalculatorForm.touched.desiredNumberOfTradingSessions &&
                                                                        riskCalculatorForm.errors.desiredNumberOfTradingSessions
                                                                        ? true
                                                                        : false
                                                                }
                                                            />
                                                            {riskCalculatorForm.touched.desiredNumberOfTradingSessions &&
                                                                riskCalculatorForm.errors.desiredNumberOfTradingSessions ? (
                                                                <FormFeedback type="invalid">
                                                                    {riskCalculatorForm.errors.desiredNumberOfTradingSessions}
                                                                </FormFeedback>
                                                            ) : null}
                                                        </Col>
                                                        <Col className="md-2" style={{
                                                            justifyContent: "center",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            fontWeight: "bold",
                                                            height: "50px",
                                                            marginTop: "25px"
                                                        }} >Or</Col>
                                                        <Col xl="5">
                                                            <Label className="form-label calculator-form-input-label">% of Trading Capital in 1 Trade</Label>
                                                            <Input
                                                                name="percentageOfTradingCapitalInOneTrade"
                                                                label="percentageOfTradingCapitalInOneTrade"
                                                                className="calculator-form-input"
                                                                placeholder=""
                                                                type="number"
                                                                onChange={riskCalculatorForm.handleChange}
                                                                onBlur={riskCalculatorForm.handleBlur}
                                                                value={riskCalculatorForm.values.percentageOfTradingCapitalInOneTrade || ""}
                                                                invalid={
                                                                    riskCalculatorForm.touched.percentageOfTradingCapitalInOneTrade &&
                                                                        riskCalculatorForm.errors.percentageOfTradingCapitalInOneTrade
                                                                        ? true
                                                                        : false
                                                                }
                                                            />
                                                            {riskCalculatorForm.touched.percentageOfTradingCapitalInOneTrade &&
                                                                riskCalculatorForm.errors.percentageOfTradingCapitalInOneTrade ? (
                                                                <FormFeedback type="invalid">
                                                                    {riskCalculatorForm.errors.percentageOfTradingCapitalInOneTrade}
                                                                </FormFeedback>
                                                            ) : null}
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <br />
                                            <span className={`${disableTheInputs ? 'show-click-link' : 'hide-click-link'}`}><strong className="underline-click" onClick={disableInputsHandler}>Click to edit</strong> the advance configuration</span>
                                            <Row className={`${disableTheInputs ? 'disable-the-inputs' : 'enable-the-inputs'}`}>
                                                <Col xl="6">
                                                    <div className="mb-3">
                                                        <Label className="form-label calculator-form-input-label">Max SL Count</Label>
                                                        <Input
                                                            name="maxSLCountOneDay"
                                                            label="maxSLCountOneDay"
                                                            placeholder="Maximum number of Stop Loss you want to take in a day (1-3)"
                                                            className="calculator-form-input"
                                                            type="number"
                                                            onChange={riskCalculatorForm.handleChange}
                                                            onBlur={riskCalculatorForm.handleBlur}
                                                            value={riskCalculatorForm.values.maxSLCountOneDay || ""}
                                                            invalid={
                                                                riskCalculatorForm.touched.maxSLCountOneDay &&
                                                                    riskCalculatorForm.errors.maxSLCountOneDay
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                        {riskCalculatorForm.touched.maxSLCountOneDay &&
                                                            riskCalculatorForm.errors.maxSLCountOneDay ? (
                                                            <FormFeedback type="invalid">
                                                                {riskCalculatorForm.errors.maxSLCountOneDay}
                                                            </FormFeedback>
                                                        ) : null}
                                                    </div>
                                                </Col>
                                                <Col xl="6">
                                                    <div className="mb-3">
                                                        <Label className="form-label calculator-form-input-label">Maximum SL Percentage(%) of 1 Trade</Label>
                                                        <Input
                                                            name="maxDrawDownPercentage"
                                                            label="maxDrawDownPercentage"
                                                            placeholder="Maximum SL(Drawdown) percentage of Used Capital i.e 1-30% of Used Capital"
                                                            className="calculator-form-input"
                                                            type="number"
                                                            onChange={riskCalculatorForm.handleChange}
                                                            onBlur={riskCalculatorForm.handleBlur}
                                                            value={riskCalculatorForm.values.maxDrawDownPercentage || ""}
                                                            invalid={
                                                                riskCalculatorForm.touched.maxDrawDownPercentage &&
                                                                    riskCalculatorForm.errors.maxDrawDownPercentage
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                        {riskCalculatorForm.touched.maxDrawDownPercentage &&
                                                            riskCalculatorForm.errors.maxDrawDownPercentage ? (
                                                            <FormFeedback type="invalid">
                                                                {riskCalculatorForm.errors.maxDrawDownPercentage}
                                                            </FormFeedback>
                                                        ) : null}
                                                    </div>
                                                </Col>
                                                <Col xl="6">
                                                    <div className="mb-3">
                                                        <Label className="form-label calculator-form-input-label">Target ratio 1: ?</Label>
                                                        <Input
                                                            name="targetRatioMultiplier"
                                                            label="targetRatioMultiplier"
                                                            placeholder="Enter Target multiplier with respect to Loss i.e 1,2,3... etc."
                                                            className="calculator-form-input"
                                                            type="number"
                                                            onChange={riskCalculatorForm.handleChange}
                                                            onBlur={riskCalculatorForm.handleBlur}
                                                            value={riskCalculatorForm.values.targetRatioMultiplier || ""}
                                                            invalid={
                                                                riskCalculatorForm.touched.targetRatioMultiplier &&
                                                                    riskCalculatorForm.errors.targetRatioMultiplier
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                        {riskCalculatorForm.touched.targetRatioMultiplier &&
                                                            riskCalculatorForm.errors.targetRatioMultiplier ? (
                                                            <FormFeedback type="invalid">
                                                                {riskCalculatorForm.errors.targetRatioMultiplier}
                                                            </FormFeedback>
                                                        ) : null}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col xl="5" className="offset-xl-1">
                                            <LotSizeCards></LotSizeCards>
                                        </Col>
                                        <Col>
                                            <div className="d-flex flex-wrap gap-2 justify-content-center">
                                                <Button type="submit" className="btn-lg primary-button cta-button">
                                                    {loading && <i class="fas fa-circle-notch fa-spin"></i>}&nbsp;
                                                    Calculate
                                                </Button>{" "}
                                                <Button type="reset" className="btn btn-outline-primary waves-effect cta-button reset-button" onClick={handleResetClick}>
                                                    Reset
                                                </Button>
                                            </div>
                                            <div
                                                className="position-fixed top-0 left-0 end-0 p-3"
                                                style={{ zIndex: "1005" }}
                                            >
                                                <Toast isOpen={invalidFormValueToast}>
                                                    <ToastHeader toggle={setInvalidFormValueToast}>
                                                        <img
                                                            src={logoVoiled}
                                                            alt=""
                                                            className="me-2"
                                                            height="18"
                                                        />
                                                        Trrader.in
                                                    </ToastHeader>
                                                    <ToastBody color="warning">
                                                        Please provide either number of Trading Sessions or Percentage of Trading Capital in 1 Trade
                                                    </ToastBody>
                                                </Toast>
                                            </div>
                                        </Col>
                                    </Row>
                                </Form>
                            </CardBody>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="2">
                      <Row>
                        <Col sm="12">
                        <div className="table-responsive">
                    {riskCalculatorConfigs && riskCalculatorConfigs.length > 0 && <table className="table mb-0">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Config Name</th>
                          <th>Created On</th>
                        </tr>
                      </thead>
                      <tbody>
                        {riskCalculatorConfigs && riskCalculatorConfigs.map(function(config, index){ return (
                        <tr onClick={() => loadSavedConfiguration(config)} className="row-hover">
                          <th scope="row">{index+1}</th>
                          <td>{config.configName}</td>
                          <td>{config.createdOn.toLocaleString()}</td>
                          <Button className="btn-sm row-button" color="secondary">Click to load</Button>
                        </tr>)
                    })}
                      </tbody>
                    </table>}

                    {!riskCalculatorConfigs || riskCalculatorConfigs.length == 0 && <div className="text-center" style={{minHeight:"200px", alignItems:"center", display:"flex", justifyContent:"center"}}>No saved configurations found</div>}
                  </div>
                        </Col>
                      </Row>
                    </TabPane>
                  </TabContent>
                            
                        </Card>
                    </Col>
                </Row>
                <br />
                {/* {loading && (
                    <div className="text-center">
                        <img src={calculator} width={160} />
                    </div>
                )
                } */}

{loading && <div class="full-page-loading"></div>}
                <Row>
                    <Col md={12} className="result-container" ref={resultContainerRef}>
                        {!loading && activeTab === "1" && calculatedRiskRows && calculatedRiskRows.length > 0 && (
                            <Card xl="2" style={{ margin: 0 }}>

                                <div className="text-left extra-card-header">
                                    <span>Calculated Risk</span>
                                    <Button onClick={()=> {
                                        setConfigNameModal(true)
                                    } } style={{float:"right"}}> Save Configuration</Button>
                                
                                
                                </div>


                                <CardHeader>
                                    <Row>
                                        <Col xl="2" style={{ marginBottom: "30px" }}>
                                            <div style={{ minHeight: "50px" }}>

                                                <label
                                                    className=""
                                                    htmlFor="inlineFormSelectPref"
                                                    style={{ lineHeight: "40px" }}
                                                >
                                                    Select Index
                                                </label>
                                            </div>
                                            {/* <br /> */}
                                            <select
                                                className="form-select"
                                                style={{ cursor: "pointer" }}
                                                id="inlineFormSelectPref"
                                                onChange={tradeIndexChangeHandler}
                                            >
                                                {tradeIndexes.map((tradeIndex) => <option defaultValue={tradeIndex.indexName}>{tradeIndex.indexName}</option>)}
                                            </select>

                                        </Col>
                                        <Col xl="3">
                                            <div className="mb-3">
                                                <div style={{ minHeight: "50px" }}>
                                                    <span>Change the <strong>Option Premium Price</strong>, to find the best Risk Combination
                                                    </span>
                                                </div>
                                                <Input
                                                    name="optionPremium"
                                                    label="optionPremium"
                                                    placeholder={selectedIndexCalculatedRisk.optionPremium}
                                                    value={selectedIndexCalculatedRisk.optionPremium}
                                                    type="number"
                                                    onChange={(e) => optionPremiumChangeHandler(e, selectedIndexCalculatedRisk.indexName)}
                                                />
                                            </div>
                                        </Col>
                                        <Col xl="6" className="text-left" style={{ display: "flex", alignItems: "center", marginTop: "40px", marginLeft: "50px" }}>
                                            <h3>{selectedIndex}</h3>
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col xl="3">
                                            <Row>
                                                <Col xl="12" className="mt-0">
                                                    {
                                                        selectedIndexCalculatedRisk.totalTradableLots > 0 && selectedIndexCalculatedRisk.totalTradableLots <= 10 && (
                                                            <UncontrolledAlert color="light" role="alert" className="card border p-0 mb-0">
                                                                <CardBody>
                                                                    <div className="text-center">
                                                                        <h4 className="alert-heading"> <i className="mdi mdi-checkbox-marked-circle-outline display-4 text-success"></i>Well done!</h4>
                                                                        <p className="mb-0">
                                                                            You can trade with {selectedIndexCalculatedRisk.totalTradableLots} {selectedIndexCalculatedRisk.totalTradableLots === 1 ? 'lot' : 'lots'} with <strong>much</strong> confidence.
                                                                        </p>
                                                                    </div>
                                                                </CardBody>
                                                            </UncontrolledAlert>
                                                        )

                                                    }
                                                    {
                                                        selectedIndexCalculatedRisk.totalTradableLots > 10 && selectedIndexCalculatedRisk.totalTradableLots < 20 && (
                                                            <UncontrolledAlert color="light" role="alert" className="card border p-0 mb-0">
                                                                <CardBody>
                                                                    <div className="text-center">
                                                                        <h4 className="alert-heading"><i className="mdi mdi-checkbox-marked-circle-outline display-4 text-success"></i>Well done!</h4>
                                                                        <p className="mb-0">
                                                                            You can trade with {selectedIndexCalculatedRisk.totalTradableLots} lots with <strong>moderate</strong> confidence.
                                                                        </p>
                                                                    </div>
                                                                </CardBody>
                                                            </UncontrolledAlert>
                                                        )
                                                    }
                                                    {
                                                        selectedIndexCalculatedRisk.totalTradableLots >= 20 && (
                                                            <UncontrolledAlert color="light" role="alert" className="card border mt-4 mt-lg-0 p-0 mb-0">
                                                                <CardBody>
                                                                    <div className="text-center">
                                                                        <h4 className="alert-heading">
                                                                            <i className="mdi mdi-alert-outline display-4 text-warning"></i> Please be careful!

                                                                        </h4>
                                                                        <p className="mb-0">
                                                                            You can trade with {selectedIndexCalculatedRisk.totalTradableLots} lots but be very <strong>careful</strong>.
                                                                        </p>

                                                                    </div>
                                                                </CardBody>
                                                            </UncontrolledAlert>
                                                        )

                                                    }

                                                    {
                                                        selectedIndexCalculatedRisk.totalTradableLots < 1 && (
                                                            <UncontrolledAlert color="light" role="alert" className="card border mt-4 mt-lg-0 p-0 mb-0">
                                                                <CardBody>
                                                                    <div className="text-center">
                                                                        {/* <div className="mb-4">
                                    
                                    </div> */}
                                                                        <h4 className="alert-heading">
                                                                            <i className="mdi mdi-close display-4 text-danger"></i> Sorry !!!
                                                                        </h4>
                                                                        <p className="mb-0">
                                                                            You can <strong>NOT</strong> trade with the entered Option Premium Price.
                                                                        </p>
                                                                        {/* <p className="mb-0">
                                                Sorry ! Product not available
                                            </p> */}
                                                                    </div>
                                                                </CardBody>
                                                            </UncontrolledAlert>
                                                        )

                                                    }
                                                </Col>
                                                <Col xl="12" className="mt-4">
                                                    <Card className="metrics-card metrics-card-white-info option-premium-stacked-container" xl="2">
                                                        <CardBody>
                                                            <p className="mb-4 card-info-header">Option Premium</p>

                                                            <CustomOptionPremiumStackedBar chartData={{
                                                                SLAmountInOptionPremium: selectedIndexCalculatedRisk.SLAmountInOptionPremium,
                                                                TargetAmountInOptionPremium: selectedIndexCalculatedRisk.TargetAmountInOptionPremium,
                                                                EntryAmountInOptionPremium: selectedIndexCalculatedRisk.optionPremium,
                                                                optionPremiumTargetPrice: selectedIndexCalculatedRisk.optionPremiumTargetPrice,
                                                                optionPremiumExitPrice: selectedIndexCalculatedRisk.optionPremiumExitPrice,
                                                            }} />

                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col xl="9">
                                            {selectedIndexCalculatedRisk.drawDownMetrics && <DayWiseCapitalDrawDown drawDownMetrics={selectedIndexCalculatedRisk.drawDownMetrics} title={`Day Wise Capital Drawdown at <strong>&#8377; ${selectedIndexCalculatedRisk.optionPremium}</strong>  Option Premium`} calculatedMetadata={[
                                                {
                                                    title: `Starting Trading Capital`,
                                                    count: `&#8377; ${riskCalculatorForm.values.tradingCapital} `,
                                                    color: "info",
                                                },
                                                {
                                                    title: `Capital left after ${calculateMetadata.numberOfTradingSessions} Trading Sessions`,
                                                    count: `&#8377; ${selectedIndexCalculatedRisk.capitalLeftAfterTradingSessions}`,
                                                    color: "primary",
                                                },
                                                {
                                                    title: "Daily Max SL Capacity",
                                                    count: `&#8377; ${calculateMetadata.maxSLCapacityDaily}`,
                                                    percentage: (calculateMetadata.maxSLCapacityDaily / riskCalculatorForm.values.tradingCapital * 100).toFixed(2),
                                                    color: "danger",
                                                },
                                                {
                                                    title: "Max Daily Trade Amount",
                                                    count: `&#8377; ${calculateMetadata.maxTradeAmountInOneDay}`,
                                                    color: "warning",
                                                }

                                            ]} />}
                                        </Col>
                                    </Row>
                                    <Row>

                                        <Col xl="12">
                                            <Row>
                                                <Col xl="3">
                                                    <Card className={`metrics-card ${selectedIndexCalculatedRisk.totalTradableLots > 0 ? 'metrics-card-success' : 'metrics-card-danger'} calculated-risk-card`} xl="2">

                                                        <CardBody>
                                                            <p className="mb-4 card-info-header">Tradable Lots in 1 Trade</p>

                                                            <CardText className="metric-number">
                                                                {selectedIndexCalculatedRisk.totalTradableLots} <span className="sub-metric-number">{`Lot${selectedIndexCalculatedRisk.totalTradableLots > 1 ? 's' : ''}`}</span>
                                                            </CardText>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                                <Col xl="3">
                                                    <Card color="" className="card metrics-card metrics-card-raw-info" xl="2">

                                                        <CardBody>
                                                            <p className="mb-4 card-info-header">Total Tradable Quantity</p>

                                                            <CardText className="metric-number">
                                                                {selectedIndexCalculatedRisk.totalTradableQuantity} <span className="sub-metric-number">Qty</span>

                                                            </CardText>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                                <Col xl="3">

                                                    <Card className="card metrics-card metrics-card-raw-info" xl="2">

                                                        <CardBody>
                                                            <p className="mb-4 card-info-header">SL of 1 Trade</p>

                                                            <CardText className="metric-number">
                                                                <i className="mdi mdi-trending-down" style={{ fontSize: "32px", color: "red" }}></i> &nbsp;
                                                                {/* <h4 style={{ marginTop: "-37px", marginRight: "0px", textAlign: "center" }}> */}
                                                                &#8377; {selectedIndexCalculatedRisk.totalSLofTrade}
                                                                {/* </h4> */}

                                                            </CardText>
                                                            <p className="sub-max-sl-text text-black">Allowed SL in 1 Trade: <strong>{calculateMetadata.maxSLCapacityInOneTrade}</strong></p>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                                <Col xl="3">
                                                    <Card className="card metrics-card metrics-card-raw-info" xl="2">

                                                        <CardBody>
                                                            <p className="mb-4 card-info-header">Target in 1 Trade</p>
                                                            <CardText className="metric-number">

                                                                <i className="mdi mdi-target lg" style={{ fontSize: "32px", color: "#0bb197" }}></i> &nbsp;

                                                                &#8377; {selectedIndexCalculatedRisk.totalTargetofTrade}

                                                            </CardText>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                                {/* <Col xl="3">
                                                    <Card color="" className="card calculated-risk-card" xl="2">
                                                        <h6 className="card-header">Lot Size</h6>

                                                        <CardBody>

                                                            <CardText>
                                                                {selectedIndexCalculatedRisk.lotSize}

                                                            </CardText>
                                                        </CardBody>
                                                    </Card>
                                                </Col> */}
                                                {/* <Col xl="3">
                                                    <Card color="" className="card calculated-risk-card" xl="2">
                                                        <h6 className="card-header">Option Premium</h6>

                                                        <CardBody>

                                                            <CardText>
                                                                &#8377; {selectedIndexCalculatedRisk.optionPremium}

                                                            </CardText>
                                                        </CardBody>
                                                    </Card>
                                                </Col> */}
                                                {/* <Col xl="3">
                                                    <Card color="" className="card calculated-risk-card" xl="2">
                                                        <h6 className="card-header">SL in Option Premium</h6>

                                                        <CardBody>

                                                            <CardText>
                                                                &#8377; {selectedIndexCalculatedRisk.SLAmountInOptionPremium}

                                                            </CardText>
                                                        </CardBody>
                                                    </Card>


                                                </Col> */}
                                                {/* <Col xl="3">
                                                    <Card color="" className="card calculated-risk-card" xl="2">
                                                        <h6 className="card-header">
                                                        Target in Option Premium
                                                        </h6>

                                                        <CardBody>

                                                        <CardText>
                                                            &#8377; {selectedIndexCalculatedRisk.TargetAmountInOptionPremium}

                                                        </CardText>
                                                        </CardBody>
                                                    </Card>
                                                </Col> */}
                                                {/* <Col xl="3">
                                                    <Card color="" className="card calculated-risk-card" xl="2">
                                                        <h6 className="card-header">Option Premium target price</h6>

                                                        <CardBody>

                                                            <CardText>
                                                                &#8377; {selectedIndexCalculatedRisk.optionPremiumTargetPrice}

                                                            </CardText>
                                                        </CardBody>
                                                    </Card>


                                                </Col> */}
                                                {/* <Col xl="3">
                                                    <Card color="" className="card calculated-risk-card" xl="2">
                                                        <h6 className="card-header">Option Premium Exit Price</h6>

                                                        <CardBody>

                                                            <CardText>
                                                                &#8377; {selectedIndexCalculatedRisk.optionPremiumExitPrice}

                                                            </CardText>
                                                        </CardBody>
                                                    </Card>
                                                </Col> */}


                                                <Col xl="3">
                                                    <Card className="card metrics-card metrics-card-raw-info" xl="2">

                                                        <CardBody>
                                                            <p className="mb-4 card-info-header">Single Trade Amount</p>
                                                            <CardText className="metric-number">
                                                                &#8377; {selectedIndexCalculatedRisk.singleTradeAmount}

                                                            </CardText>
                                                        </CardBody>
                                                    </Card>
                                                </Col>

                                                {/* <Col xl="3">
                                                                <Card color="" className="card calculated-risk-card" xl="2">
                                                                    <h6 className="card-header">Capital Left After Trading Sessions</h6>

                                                                    <CardBody>

                                                                        <CardText>
                                                                            {selectedIndexCalculatedRisk.capitalLeftAfterTradingSessions}

                                                                        </CardText>
                                                                    </CardBody>
                                                                </Card>
                                                            </Col> */}
                                            </Row>


                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        )}
                    </Col>
                </Row>

            </div>
            <Modal
                size="sm"
                centered
                isOpen={purchasePremiumModal}
                toggle={() => {
                    setPurchasePremiumModal(false);
                }}
            >
                <div className="modal-header">
                    <h5
                        className="modal-title mt-0"
                        id="mySmallModalLabel"
                    >
                        Ohh No !!!
                    </h5>
                    <button
                        onClick={() => {
                            setPurchasePremiumModal(false);
                        }}
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <p>
                        You are not a Premium Trrader.
                    </p>
                    <p>
                        Please purchase and become a <strong>Premium Trrader </strong> to access this feature at ONLY <strong style={{ color: "#4747A1" }}>less than ₹2 per day</strong>.
                    </p>
                </div>
                <div className="modal-footer">
                    <button
                        className="btn btn-light"
                        onClick={() => {
                            setPurchasePremiumModal(false);
                        }}
                    >
                        Cancel
                    </button>
                    <Link
                        to="/pricing"
                        className="btn btn-primary"
                        style={{
                            background: "#4747A1",
                            borderColor: "#4747A1",
                        }}
                    >
                        Check Plans
                    </Link>
                </div>

            </Modal>

            <Modal
                centered
                isOpen={configNameModal}
                toggle={() => {
                    setConfigNameModal(false);
                }}
            >
                <div className="modal-header">
                    <h5
                        className="modal-title mt-0"
                        id="mySmallModalLabel"
                    >
                        Save Configuration
                    </h5>
                    <button
                        onClick={() => {
                            setConfigNameModal(false);
                        }}
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <label htmlFor="configName">Configuration Name</label>
                    <Input value={configName} placeholder="Configuration Name" onChange={ e => 
                        setConfigName(e.target.value)
                    }></Input>
                </div>
                <div className="modal-footer">
                    <button
                        className="btn btn-light"
                        onClick={() => {
                            setConfigNameModal(false);
                        }}
                    >
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={saveConfiguration}>
                        Save Configuration
                    </button>
                    {/* <Link
                        to="/pricing"
                        className="btn btn-primary"
                        style={{
                            background: "#4747A1",
                            borderColor: "#4747A1",
                        }}
                    >
                        Check Plans
                    </Link> */}
                </div>

            </Modal>
        </React.Fragment>
    );
};

const mapStateToProps = state => {
    return { ...state.login };
};
export default connect(mapStateToProps, {})(RiskCalculator)


// export default RiskCalculator;