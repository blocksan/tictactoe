import React, { useState } from "react";

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
    Progress
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import * as Yup from "yup";
import { useFormik } from "formik";
import calculator from "../../assets/images/calculator.gif";
const IndexType = {
    BANKNIFTY: "BANKNIFTY",
    FINNIFTY: "FINNIFTY",
    NIFTY50: "NIFTY50",
}
const BANKNIFTY_LOT_SIZE = 15;
const FINNIFTY_LOT_SIZE = 40;
const NIFTY50_LOT_SIZE = 50;
const RiskCalculator = () => {
    document.title = "Risk Calculator";

    const [loading, setLoading] = useState(false);

    const [tradeIndexes, setTradeIndexes] = useState([{
        indexName: IndexType.BANKNIFTY,
        lotSize: BANKNIFTY_LOT_SIZE,
        optionPremium: 30,
    },
    {
        indexName: IndexType.FINNIFTY,
        lotSize: FINNIFTY_LOT_SIZE,
        optionPremium: 20,
    },
    {
        indexName: IndexType.NIFTY50,
        lotSize: NIFTY50_LOT_SIZE,
        optionPremium: 30,
    }
    ])

    const [calculateMetadata, setCalculateMetadata] = useState({
        maxSLCapacityDaily: 0,
        maxSLCapacityInOneTrade: 0,
    });

    const [calculatedRiskRows, setCalculatedRiskRows] = useState([]);

    // Form validation
    const riskCalculatorForm = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            tradingCapital: 10000,
            numberOfTradingSessions: 10,
            maxSLCountOneDay: 2,
            maxDrawDownPercentage: 15,
            targetRatioMultiplier: 2,
        },
        validationSchema: Yup.object().shape({
            tradingCapital: Yup.number().required("Please provide your Trading Capital"),
            numberOfTradingSessions: Yup.number()
                .typeError('Trading Sessions must be a number')
                .required("Please provide number of Trading Sessions")
                .min(1, "Trading Sessions should be at least 1")
                .max(60, "Trading Sessions be at most 60 "),
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

        }),
        onSubmit: async (values) => {
        setLoading(true)

            await new Promise(r => setTimeout(r, 2000));
            calculateRisk(values);
        },
    });

    const calculateRisk = (riskCalculatorFormValues) => {
        // Calculate Risk Metadata
        const { maxSLCapacityDaily, maxSLCapacityInOneTrade } = calculateRiskMetadata(riskCalculatorFormValues);
        setCalculateMetadata({ maxSLCapacityDaily, maxSLCapacityInOneTrade });
        let calculatedRiskRows = [];
        tradeIndexes.forEach((tradeIndex) => {
            const { lotSize, optionPremium, indexName } = tradeIndex;
            let calculatedRiskOfIndex = calculatedRiskofIndex(riskCalculatorFormValues, lotSize, optionPremium, indexName, maxSLCapacityInOneTrade);
            calculatedRiskRows.push(calculatedRiskOfIndex);
        });

        setCalculatedRiskRows(calculatedRiskRows);
        setLoading(false)

    }

    const calculatedRiskofIndex = (riskCalculatorFormValues, lotSize, optionPremium, indexName, maxSLCapacityInOneTrade) => {
        let calculatedLotSize = lotSize;
        riskCalculatorFormValues.optionPremium = optionPremium;
        let SLAmountInOptionPremium = calculateSLAmountInOptionPremium(riskCalculatorFormValues);
        let optionPremiumTargetPrice = calculateOptionPremiumTargetPrice(riskCalculatorFormValues, SLAmountInOptionPremium);
        let optionPremiumExitPrice = calculateOptionPremiumExitPrice(riskCalculatorFormValues, SLAmountInOptionPremium);
        let totalTradableLots = calculateTotalTradableLots(riskCalculatorFormValues, maxSLCapacityInOneTrade, calculatedLotSize);
        let totalTradableQuantity = calculateTotalTradableQuantity(totalTradableLots, calculatedLotSize);
        let totalTradeCapital = calculateTotalTradeCapital(riskCalculatorFormValues, totalTradableQuantity);
        let totalSLofTrade = calculateTotalSLofTrade(totalTradableQuantity, SLAmountInOptionPremium);
        let totalTargetofTrade = calculateTotalTargetofTrade(optionPremiumTargetPrice, totalTradableQuantity, totalTradeCapital);
        let capitalLeftAfterTradingSessions = calculateCapitalLeftAfterTradingSessions(riskCalculatorFormValues, totalSLofTrade);
        return {
            lotSize: calculatedLotSize,
            optionPremium: optionPremium,
            indexName: indexName,
            SLAmountInOptionPremium,
            optionPremiumTargetPrice,
            optionPremiumExitPrice,
            totalTradableLots,
            totalTradableQuantity,
            totalTradeCapital,
            totalSLofTrade,
            totalTargetofTrade,
            capitalLeftAfterTradingSessions,

        }

    }


    const calculateRiskMetadata = (riskCalculatorFormValues) => {
        const maxSLCapacityDaily = Math.floor(riskCalculatorFormValues.tradingCapital / riskCalculatorFormValues.numberOfTradingSessions);
        const maxSLCapacityInOneTrade = Math.floor(maxSLCapacityDaily / riskCalculatorFormValues.maxSLCountOneDay);
        return {
            maxSLCapacityDaily,
            maxSLCapacityInOneTrade
        }
    }
    const calculateSLAmountInOptionPremium = (riskCalculatorFormValues,) => {
        return Math.floor(riskCalculatorFormValues.optionPremium * (riskCalculatorFormValues.maxDrawDownPercentage / 100));
    }
    const calculateOptionPremiumTargetPrice = (riskCalculatorFormValues, SLAmountInOptionPremium) => {
        return Math.floor(riskCalculatorFormValues.optionPremium + (SLAmountInOptionPremium * riskCalculatorFormValues.targetRatioMultiplier));
    }
    const calculateOptionPremiumExitPrice = (riskCalculatorFormValues, SLAmountInOptionPremium) => {
        return Math.floor(riskCalculatorFormValues.optionPremium - SLAmountInOptionPremium);

    }
    const calculateTotalTradableLots = (riskCalculatorFormValues, maxSLCapacityInOneTrade, lotSize) => {
        return Math.floor((maxSLCapacityInOneTrade / (riskCalculatorFormValues.optionPremium * (riskCalculatorFormValues.maxDrawDownPercentage / 100))) / lotSize);
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
    const calculateTotalTargetofTrade = (optionPremiumTargetPrice, totalTradableQuantity, totalTradeCapital) => {
        return (optionPremiumTargetPrice * totalTradableQuantity) - totalTradeCapital;
    }
    const calculateCapitalLeftAfterTradingSessions = (riskCalculatorFormValues, totalSLofTrade) => {
        return riskCalculatorFormValues.tradingCapital - (totalSLofTrade * riskCalculatorFormValues.numberOfTradingSessions * riskCalculatorFormValues.maxSLCountOneDay);
    }


    const handleResetClick = () => {
        riskCalculatorForm.resetForm(); // Reset the form's values and errors
    };
    const optionPremiumChangeHandler = async (event, indexName) => {
        const updatedOptionPremium = event.target.value;
        let updatedCalculateRiskRows = [];
        setCalculatedRiskRows([]);
        calculatedRiskRows.forEach((riskRow) => {
            if (riskRow.indexName == indexName) {
                console.log("inside the trade")
                riskRow.optionPremium = parseInt(updatedOptionPremium);

                const calculatedRisk = calculatedRiskofIndex(riskCalculatorForm.values, riskRow.lotSize, riskRow.optionPremium, riskRow.indexName, calculateMetadata.maxSLCapacityInOneTrade);
                updatedCalculateRiskRows.push(calculatedRisk);
            } else {
                updatedCalculateRiskRows.push(riskRow);
            }
        })
        setCalculatedRiskRows(updatedCalculateRiskRows);
    }

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


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Trrader" breadcrumbItem="Risk Calculator" />
                </Container>
                <Row>
                    <Col lg={12}>
                        <Card>
                            <CardBody>
                                {/* <CardTitle>Risk Calculator</CardTitle> */}
                                <br />
                                <CardSubtitle className="mb-3">
                                    This tool will help you calculate the approximate amount of money you can risk in a trade based on your account size, percentage risk per trade, and stop loss.
                                </CardSubtitle>
                                <br />
                                <Row>
                                    <Col md="6">
                                        <Form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                riskCalculatorForm.handleSubmit();
                                                return false;
                                            }}
                                        >
                                            <Row>
                                                <Col md="6">
                                                    <div className="mb-3">
                                                        <Label className="form-label">Trading Capital</Label>
                                                        <Input
                                                            name="tradingCapital"
                                                            label="tradingCapital"
                                                            placeholder="Please provide your Trading Capital"
                                                            type="number"
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
                                                <Col md="6">
                                                    <div className="mb-3">
                                                        <Label className="form-label">Trading Sessions</Label>
                                                        <Input
                                                            name="numberOfTradingSessions"
                                                            label="numberOfTradingSessions"
                                                            placeholder="Number of Trading Sessions you want to take"
                                                            type="number"
                                                            onChange={riskCalculatorForm.handleChange}
                                                            onBlur={riskCalculatorForm.handleBlur}
                                                            value={riskCalculatorForm.values.numberOfTradingSessions || ""}
                                                            invalid={
                                                                riskCalculatorForm.touched.numberOfTradingSessions &&
                                                                    riskCalculatorForm.errors.numberOfTradingSessions
                                                                    ? true
                                                                    : false
                                                            }
                                                        />
                                                        {riskCalculatorForm.touched.numberOfTradingSessions &&
                                                            riskCalculatorForm.errors.numberOfTradingSessions ? (
                                                            <FormFeedback type="invalid">
                                                                {riskCalculatorForm.errors.numberOfTradingSessions}
                                                            </FormFeedback>
                                                        ) : null}
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="6">
                                                    <div className="mb-3">
                                                        <Label className="form-label">Max SL Count</Label>
                                                        <Input
                                                            name="maxSLCountOneDay"
                                                            label="maxSLCountOneDay"
                                                            placeholder="Maximum number of Stop Loss you want to take in a day (1-3)"
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
                                                <Col md="6">
                                                    <div className="mb-3">
                                                        <Label className="form-label">Maximum SL(Drawdown) Percentage</Label>
                                                        <Input
                                                            name="maxDrawDownPercentage"
                                                            label="maxDrawDownPercentage"
                                                            placeholder="Maximum SL(Drawdown) percentage of Used Capital i.e 1-30% of Used Capital"
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
                                            </Row>
                                            <Row>
                                                <Col md="6">
                                                    <div className="mb-3">
                                                        <Label className="form-label">Target ratio 1: ?</Label>
                                                        <Input
                                                            name="targetRatioMultiplier"
                                                            label="targetRatioMultiplier"
                                                            placeholder="Enter Target multiplier with respect to Loss i.e 1,2,3... etc."
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
                                            <Row>
                                                <Col>
                                                    <div className="d-flex flex-wrap gap-2 justify-content-center">
                                                        <Button type="submit" color="info" className="btn-lg" style={{padding:"10px 25px", borderRadius:"4px"}}>
                                                            Calculate
                                                        </Button>{" "}
                                                        <Button type="reset" color="secondary" className="" onClick={handleResetClick}>
                                                            Reset Calculator
                                                        </Button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </Col>
                                    <Col md="6">
                                        <Row>
                                            <Col md="6">
                                                <Card md="2">
                                                    <h6 className="card-header">BANKNIFTY - Lot Size </h6>

                                                    <CardBody className="text-center">

                                                        <CardText style={{fontSize:'2em'}}>
                                                            {BANKNIFTY_LOT_SIZE}
                                                        </CardText>
                                                    </CardBody>
                                                </Card>


                                            </Col>
                                            <Col md="6">
                                            <Card md="2">
                                                    <h6 className="card-header">FINNIFTY - Lot Size</h6>

                                                    <CardBody className="text-center">

                                                        <CardText style={{fontSize:'2em'}}>
                                                            {FINNIFTY_LOT_SIZE}
                                                        </CardText>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="6" className="offset-md-3">
                                            <Card color="gray" className="" md="2">
                                                    <h6 className="card-header">NIFTY 50 - Lot Size</h6>

                                                    <CardBody className="text-center">

                                                        <CardText style={{fontSize:'2em'}}>
                                                            {NIFTY50_LOT_SIZE}
                                                        </CardText>
                                                    </CardBody>
                                                </Card>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <br />
                {loading && (
                    <div className="text-center">
                    <img src={calculator} width={160}/>
                    </div>
                )

                }
                {!loading && calculatedRiskRows && calculatedRiskRows.length > 0 && (
                    <>
                        <div className="text-center" style={{
                            height:"60px",
                            fontSize:"2em",
                            borderTop:"1px solid black",
                            paddingTop:"10px",
                            marginBottom:"20px"
                        }}>Calculated Risk</div>
                        <Row>
                            <Col lg={12}>
                                <Row>
                                    <Col>
                                        <Card outline color="primary" className="border card-border-primary">
                                            <CardHeader className="bg-transparent">
                                                <h5 className="my-0 text-primary">
                                                    Daily Max SL Capacity
                                                </h5>
                                            </CardHeader>
                                            <CardBody>
                                                <CardTitle className="mt-0">Rs. {calculateMetadata.maxSLCapacityDaily}</CardTitle>

                                            </CardBody>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card outline color="primary" className="border card-border-primary">
                                            <CardHeader className="bg-transparent">
                                                <h5 className="my-0 text-primary">
                                                    Max SL in One Trade
                                                </h5>
                                            </CardHeader>
                                            <CardBody>
                                                <CardTitle className="mt-0">Rs. {calculateMetadata.maxSLCapacityInOneTrade}</CardTitle>

                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg={12}>
                                {calculatedRiskRows.map((riskRow) =>
                                    <Card key={riskRow.indexName}>
                                        <CardBody>
                                            <CardHeader className="text-center">

                                            <CardTitle style={{fontSize:"1.5em"}}> <strong>{riskRow.indexName}</strong></CardTitle>
                                            </CardHeader>
                                            <CardSubtitle className="mb-3">

                                            </CardSubtitle>
                                            <Row>
                                                <Col md="3">
                                                    <div className="mb-3">
                                                        <span>Change the <strong>Option Premium Price</strong>, to find the best Target Combination</span>
                                                        <br />
                                                        <br/>
                                                        <Label className="form-label">Option Premium Price</Label>
                                                        <Input
                                                            name="optionPremium"
                                                            label="optionPremium"
                                                            placeholder={riskRow.optionPremium}
                                                            type="number"
                                                            onChange={(e) => optionPremiumChangeHandler(e, riskRow.indexName)}
                                                        />
                                                    </div>
                                                    <div >
                                                        {
                                                            riskRow.totalTradableLots > 0 && riskRow.totalTradableLots <= 10 && (
                                                                <UncontrolledAlert color="light" role="alert" className="card border p-0 mb-0">
                                                                    <div className="card-header bg-soft-success">
                                                                        <div className="d-flex">
                                                                            <div className="flex-grow-1">
                                                                                <h5 className="font-size-16 text-success my-1">
                                                                                    Awesome
                                                                                </h5>
                                                                            </div>
                                                                            <div className="flex-shrink-0">

                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <CardBody>
                                                                        <div className="text-center">
                                                                            <div className="mb-4">
                                                                                <i className="mdi mdi-checkbox-marked-circle-outline display-4 text-success"></i>
                                                                            </div>
                                                                            <h4 className="alert-heading">Well done!</h4>
                                                                            <p className="mb-0">
                                                                                You can trade with {riskRow.totalTradableLots} {riskRow.totalTradableLots === 1 ? 'lot' : 'lots'} with <strong>much</strong> confidence.
                                                                            </p>
                                                                        </div>
                                                                    </CardBody>
                                                                </UncontrolledAlert>
                                                            )

                                                        }
                                                        {
                                                            riskRow.totalTradableLots > 10 && riskRow.totalTradableLots < 20 && (
                                                                <UncontrolledAlert color="light" role="alert" className="card border p-0 mb-0">
                                                                    <div className="card-header bg-soft-success">
                                                                        <div className="d-flex">
                                                                            <div className="flex-grow-1">
                                                                                <h5 className="font-size-16 text-success my-1">
                                                                                    Awesome
                                                                                </h5>
                                                                            </div>
                                                                            <div className="flex-shrink-0">

                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <CardBody>
                                                                        <div className="text-center">
                                                                            <div className="mb-4">
                                                                                <i className="mdi mdi-checkbox-marked-circle-outline display-4 text-success"></i>
                                                                            </div>
                                                                            <h4 className="alert-heading">Well done!</h4>
                                                                            <p className="mb-0">
                                                                                You can trade with {riskRow.totalTradableLots} lots with <strong>moderate</strong> confidence.
                                                                            </p>
                                                                        </div>
                                                                    </CardBody>
                                                                </UncontrolledAlert>
                                                            )
                                                        }
                                                        {
                                                            riskRow.totalTradableLots > 20 && (
                                                                <UncontrolledAlert color="light" role="alert" className="card border mt-4 mt-lg-0 p-0 mb-0">
                                                                    <div className="card-header bg-soft-warning">
                                                                        <div className="d-flex">
                                                                            <div className="flex-grow-1">
                                                                                <h5 className="font-size-16 text-warning my-1">
                                                                                    Careful
                                                                                </h5>
                                                                            </div>
                                                                            <div className="flex-shrink-0">

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <CardBody>
                                                                        <div className="text-center">
                                                                            <div className="mb-4">
                                                                                <i className="mdi mdi-alert-outline display-4 text-warning"></i>
                                                                            </div>
                                                                            <h4 className="alert-heading">
                                                                                Please be careful!

                                                                            </h4>
                                                                            <p className="mb-0">
                                                                                You can trade with {riskRow.totalTradableLots} lots but be very <strong>careful</strong>.
                                                                            </p>

                                                                        </div>
                                                                    </CardBody>
                                                                </UncontrolledAlert>
                                                            )

                                                        }

                                                        {
                                                            riskRow.totalTradableLots < 1 && (
                                                                <UncontrolledAlert color="light" role="alert" className="card border mt-4 mt-lg-0 p-0 mb-0">

                                                                    <div className="card-header bg-soft-danger">
                                                                        <div className="d-flex">
                                                                            <div className="flex-grow-1">
                                                                                <h5 className="font-size-16 text-danger my-1">
                                                                                    No Trade
                                                                                </h5>
                                                                            </div>
                                                                            <div className="flex-shrink-0">

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <CardBody>
                                                                        <div className="text-center">
                                                                            <div className="mb-4">
                                                                                <i className="mdi mdi-close display-4 text-danger"></i>
                                                                            </div>
                                                                            <h4 className="alert-heading">
                                                                                Sorry !!!
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




                                                    </div>
                                                </Col>
                                                <Col md="9">
                                                    <Row>
                                                        <Col md="3">
                                                            <Card color="info" className="card-info" md="2">
                                                                <h6 className="card-header">Lot Size</h6>

                                                                <CardBody>

                                                                    <CardText>
                                                                        {riskRow.lotSize}

                                                                    </CardText>
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                        <Col md="3">
                                                            <Card color="info" className="card-info" md="2">
                                                                <h6 className="card-header">Option Premium</h6>

                                                                <CardBody>

                                                                    <CardText>
                                                                        {riskRow.optionPremium}

                                                                    </CardText>
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                        <Col md="3">
                                                            <Card color="info" className="card-info" md="2">
                                                                <h6 className="card-header">SL in Option Premium</h6>

                                                                <CardBody>

                                                                    <CardText>
                                                                        {riskRow.SLAmountInOptionPremium}

                                                                    </CardText>
                                                                </CardBody>
                                                            </Card>


                                                        </Col>
                                                        <Col md="3">
                                                            <Card color="info" className="card-info" md="2">
                                                                <h6 className="card-header">Target in Option Premium</h6>

                                                                <CardBody>

                                                                    <CardText>
                                                                        {riskRow.optionPremiumTargetPrice}

                                                                    </CardText>
                                                                </CardBody>
                                                            </Card>


                                                        </Col>
                                                        <Col md="3">
                                                            <Card color="info" className="card-info" md="2">
                                                                <h6 className="card-header">Option Premium Exit Price</h6>

                                                                <CardBody>

                                                                    <CardText>
                                                                        {riskRow.optionPremiumExitPrice}

                                                                    </CardText>
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                        <Col md="3">
                                                            <Card color="info" className="card-info" md="2">
                                                                <h6 className="card-header">Total Tradable Lots</h6>

                                                                <CardBody>

                                                                    <CardText>
                                                                        {riskRow.totalTradableLots}

                                                                    </CardText>
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                        <Col md="3">
                                                            <Card color="info" className="card-info" md="2">
                                                                <h6 className="card-header">Total Tradable Quantity</h6>

                                                                <CardBody>

                                                                    <CardText>
                                                                        {riskRow.totalTradableQuantity}

                                                                    </CardText>
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                        <Col md="3">
                                                            <Card color="info" className="card-info" md="2">
                                                                <h6 className="card-header">Total Trade Capital</h6>

                                                                <CardBody>

                                                                    <CardText>
                                                                        {riskRow.totalTradeCapital}

                                                                    </CardText>
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                        <Col md="3">
                                                            <Card color="info" className="card-info" md="2">
                                                                <h6 className="card-header">Total SL of Trade</h6>

                                                                <CardBody>

                                                                    <CardText>
                                                                        {riskRow.totalSLofTrade}

                                                                    </CardText>
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                        <Col md="3">
                                                            <Card color="info" className="card-info" md="2">
                                                                <h6 className="card-header">Total Target of Trade</h6>

                                                                <CardBody>

                                                                    <CardText>
                                                                        {riskRow.totalTargetofTrade}

                                                                    </CardText>
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                        <Col md="3">
                                                            <Card color="info" className="card-info" md="2">
                                                                <h6 className="card-header">Capital Left After Trading Sessions</h6>

                                                                <CardBody>

                                                                    <CardText>
                                                                        {riskRow.capitalLeftAfterTradingSessions}

                                                                    </CardText>
                                                                </CardBody>
                                                            </Card>
                                                        </Col>
                                                    </Row>

                                                </Col>
                                            </Row>
                                        </CardBody>
                                    </Card>
                                )}
                            </Col>
                        </Row>
                    </>
                )}
                
            </div>
        </React.Fragment>
    );
};

export default RiskCalculator;