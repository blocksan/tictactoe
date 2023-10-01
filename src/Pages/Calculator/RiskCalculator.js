import React, { useEffect, useState } from "react";

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
import DayWiseCapitalDrawDown from "./DayWiseCapitalDrawDown";
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
    const [selectedIndex, setSelectedIndex] = useState(IndexType.BANKNIFTY);
    const [selectedIndexCalculatedRisk, setSelectedIndexCalculatedRisk] = useState({});

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
            setSelectedIndex(null);
            await new Promise(r => setTimeout(r, 1500));
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
            let calculatedRiskOfIndexResult = calculateRiskofIndex(riskCalculatorFormValues, lotSize, optionPremium, indexName, maxSLCapacityInOneTrade);
            calculatedRiskRows.push(calculatedRiskOfIndexResult);
        });

        setCalculatedRiskRows(calculatedRiskRows);
        setSelectedIndex(IndexType.BANKNIFTY);
        setLoading(false)

    }

    const calculateRiskofIndex = (riskCalculatorFormValues, lotSize, optionPremium, indexName, maxSLCapacityInOneTrade) => {
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
        // let drawDownMetricsResult = calculateDrawDownMetrics(riskCalculatorFormValues)
       

        let remainingCapitalDayWise = []
        let capitalDayWiseLabels = []
        let currentCapital = riskCalculatorFormValues.tradingCapital;
        let maxTradingSessions = riskCalculatorFormValues.numberOfTradingSessions;
        for (let i = 1; i <= maxTradingSessions; i++) {
            capitalDayWiseLabels.push(`Day ${i}`);
            remainingCapitalDayWise.push(currentCapital - (totalSLofTrade*riskCalculatorFormValues.maxSLCountOneDay) );
            currentCapital = remainingCapitalDayWise[remainingCapitalDayWise.length - 1];
        }
        let series = [
            {
                name: 'Capital',
                type: 'column',
                data:[...remainingCapitalDayWise]
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
            optionPremiumTargetPrice,
            optionPremiumExitPrice,
            totalTradableLots,
            totalTradableQuantity,
            totalTradeCapital,
            totalSLofTrade,
            totalTargetofTrade,
            capitalLeftAfterTradingSessions,
            drawDownMetrics:{
                labels,
                series
            }

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
        let updatedOptionPremium = event.target.value;
        if (!event.target.value){
            updatedOptionPremium = 0;
        }else if(event.target.value < 0){
            updatedOptionPremium = 0;
        }else if(event.target.value){
            console.log(parseInt(event.target.value));
            updatedOptionPremium = parseInt(event.target.value);
        }
        let updatedCalculateRiskRows = [];
        setCalculatedRiskRows([]);
        calculatedRiskRows.forEach((riskRow) => {
            if (riskRow.indexName == indexName) {
                riskRow.optionPremium = parseInt(updatedOptionPremium);

                const calculatedRiskOfIndexResult = calculateRiskofIndex(riskCalculatorForm.values, riskRow.lotSize, riskRow.optionPremium, riskRow.indexName, calculateMetadata.maxSLCapacityInOneTrade);
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
            <div className="page-content landing-header-main">
                <Container fluid={true}>
                    <Breadcrumbs title="Calculator" breadcrumbItem="Risk Calculator" />
                </Container>
                <Row>
                    <Col lg={12}>
                        <Card>
                            <CardBody style={{background:"rgb(241 241 241 / 41%)"}}>
                                {/* <CardTitle>Risk Calculator</CardTitle> */}
                                <br />
                                <CardSubtitle className="mb-3">
                                    This tool will help you calculate the approximate amount of money you can risk in a trade based on your account size, percentage risk per trade, and stop loss.
                                </CardSubtitle>
                                <br />
                                        <Form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                riskCalculatorForm.handleSubmit();
                                                return false;
                                            }}
                                            >
                                            <Row>
                                        <Col md="6">
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
                                                        <Label className="form-label">Trading Sessions(Days)</Label>
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
                                                        <Label className="form-label">Maximum SL(Drawdown) Percentage of Trade %</Label>
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
                                        </Col>
                                        <Col md="5" className="offset-md-1">
                                            <Row>
                                                <Col md="6">
                                                    <Card md="2">
                                                        <h6 className="card-header">BANKNIFTY - 1 Lot Size </h6>

                                                        <CardBody className="text-center">

                                                            <CardText style={{ fontSize: '2em' }}>
                                                                {BANKNIFTY_LOT_SIZE}
                                                            </CardText>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                                <Col md="6">
                                                    <Card md="2">
                                                        <h6 className="card-header">FINNIFTY - 1 Lot Size</h6>

                                                        <CardBody className="text-center">

                                                            <CardText style={{ fontSize: '2em' }}>
                                                                {FINNIFTY_LOT_SIZE}
                                                            </CardText>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md="6" className="offset-md-2">
                                                    <Card color="gray" className="" md="2">
                                                        <h6 className="card-header">NIFTY 50 - 1 Lot Size</h6>

                                                        <CardBody className="text-center">

                                                            <CardText style={{ fontSize: '2em' }}>
                                                                {NIFTY50_LOT_SIZE}
                                                            </CardText>
                                                        </CardBody>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </Col>
                                            <Row>
                                                <Col>
                                                    <div className="d-flex flex-wrap gap-2 justify-content-center">
                                                        <Button type="submit" color="info" className="btn-lg" style={{ padding: "10px 28px", borderRadius: "4px", background:"#12d6df", outline:0, border:0 }}>
                                                            Calculate
                                                        </Button>{" "}
                                                        <Button type="reset" color="secondary" className="" onClick={handleResetClick}>
                                                            Reset Calculator
                                                        </Button>
                                                    </div>
                                                </Col>
                                            </Row>
                                </Row>
                                        </Form>
                                    

                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <br />
                {loading && (
                    <div className="text-center">
                        <img src={calculator} width={160} />
                    </div>
                )

                

                }
                {!loading && calculatedRiskRows && calculatedRiskRows.length > 0 && (
                        <Row>
                            <Col md={12} style={{boxShadow:"rgb(179 179 184 / 78%) -3px -3px 5px", padding:"0",    width: "100%"}} >
                                <Card color="" className="card" md="2">

                                    <div className="text-left" style={{
                                        height: "60px",
                                        fontSize: "1.4em",
                                        fontWeight: "bold",
                                        paddingTop: "15px",
                                        paddingLeft: "20px",
                                    }}>Calculated Risk</div>
                                    
                                    
                                            <CardHeader>
                                                <Row>
                                                    <Col md="2" style={{marginBottom:"30px"}}>
                                                        <div style={{minHeight:"50px"}}>

                                                        <label
                                                            className=""
                                                            htmlFor="inlineFormSelectPref"
                                                            style={{lineHeight:"40px"}}
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
                                                            {/* <option defaultValue="1">One</option> */}
                                                            {/* <option defaultValue="2">Two</option> */}
                                                            {/* <option defaultValue="3">Three</option> */}
                                                        </select>

                                                    </Col>
                                                    <Col md="3">
                                                    <div className="mb-3">
                                                        <div style={{minHeight:"50px"}}>
                                                            <span>Change the <strong>Option Premium Price</strong>, <p> to find the best Target Combination
                                                            </p>
                                                            </span>
                                                        </div>
                                                            {/* <br /> */}
                                                            {/* <br /> */}
                                                            {/* <Label className="form-label">Option Premium Price</Label> */}
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
                                                    <Col md="6" className="text-left" style={{display:"flex", alignItems:"center",marginTop:"40px", marginLeft:"50px"}}>
                                                        <h3>{selectedIndex}</h3>
                                                    </Col>
                                                </Row>
                                            </CardHeader>
                                            <CardBody>
                                            <Row>
                                        <Col className="align-center offset-md-3">
                                        </Col>

                                    </Row>
                                    <Row>
                                        <Col md="12">
                                        {selectedIndexCalculatedRisk.drawDownMetrics && <DayWiseCapitalDrawDown drawDownMetrics = {selectedIndexCalculatedRisk.drawDownMetrics} calculatedMetadata={[
                                            {
                                                title: `Capital left after ${riskCalculatorForm.values.numberOfTradingSessions} Trading Sessions`,
                                                count: `${selectedIndexCalculatedRisk.capitalLeftAfterTradingSessions}`,
                                                color: "primary",
                                            },
                                            {
                                                title: "Tradable Lots in One Trade",
                                                count: selectedIndexCalculatedRisk.totalTradableLots,
                                                color: `${selectedIndexCalculatedRisk.totalTradableLots > 0 ?'primary':''}`,
                                                makeDanger:`${selectedIndexCalculatedRisk.totalTradableLots > 0 ?false:true}`,
                                            },
                                            {
                                                title: "Daily Max SL Capacity",
                                                count: calculateMetadata.maxSLCapacityDaily,
                                                percentage: (calculateMetadata.maxSLCapacityDaily/riskCalculatorForm.values.tradingCapital*100).toFixed(2),
                                                color: "danger",
                                            },
                                            {
                                                title: "Max SL in One Trade",
                                                count: calculateMetadata.maxSLCapacityInOneTrade,
                                                color: "warning",
                                            }
                                            
                                        ]} />}
                                        </Col>
                                    </Row>
                    <br />

                                                <Row>
                                                    <Col md="3">
                                                        
                                                        <div >
                                                            {
                                                                selectedIndexCalculatedRisk.totalTradableLots > 0 && selectedIndexCalculatedRisk.totalTradableLots <= 10 && (
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
                                                                                    You can trade with {selectedIndexCalculatedRisk.totalTradableLots} lots with <strong>moderate</strong> confidence.
                                                                                </p>
                                                                            </div>
                                                                        </CardBody>
                                                                    </UncontrolledAlert>
                                                                )
                                                            }
                                                            {
                                                                selectedIndexCalculatedRisk.totalTradableLots > 20 && (
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
                                                                <Card color="" className="card calculated-risk-card" md="2">
                                                                    <h6 className="card-header">Lot Size</h6>

                                                                    <CardBody>

                                                                        <CardText>
                                                                            {selectedIndexCalculatedRisk.lotSize}

                                                                        </CardText>
                                                                    </CardBody>
                                                                </Card>
                                                            </Col>
                                                            <Col md="3">
                                                                <Card color="" className="card calculated-risk-card" md="2">
                                                                    <h6 className="card-header">Option Premium</h6>

                                                                    <CardBody>

                                                                        <CardText>
                                                                            {selectedIndexCalculatedRisk.optionPremium}

                                                                        </CardText>
                                                                    </CardBody>
                                                                </Card>
                                                            </Col>
                                                            <Col md="3">
                                                                <Card color="" className="card calculated-risk-card" md="2">
                                                                    <h6 className="card-header">SL in Option Premium</h6>

                                                                    <CardBody>

                                                                        <CardText>
                                                                            {selectedIndexCalculatedRisk.SLAmountInOptionPremium}

                                                                        </CardText>
                                                                    </CardBody>
                                                                </Card>


                                                            </Col>
                                                            <Col md="3">
                                                                <Card color="" className="card calculated-risk-card" md="2">
                                                                    <h6 className="card-header">Target in Option Premium</h6>

                                                                    <CardBody>

                                                                        <CardText>
                                                                            {selectedIndexCalculatedRisk.optionPremiumTargetPrice}

                                                                        </CardText>
                                                                    </CardBody>
                                                                </Card>


                                                            </Col>
                                                            <Col md="3">
                                                                <Card color="" className="card calculated-risk-card" md="2">
                                                                    <h6 className="card-header">Option Premium Exit Price</h6>

                                                                    <CardBody>

                                                                        <CardText>
                                                                            {selectedIndexCalculatedRisk.optionPremiumExitPrice}

                                                                        </CardText>
                                                                    </CardBody>
                                                                </Card>
                                                            </Col>
                                                            <Col md="3">
                                                                <Card color="" className={`${selectedIndexCalculatedRisk.totalTradableLots > 0? 'card-primary':'card-danger'} calculated-risk-card` } md="2">
                                                                    <h6 className="card-header">Tradable Lots in One Trade</h6>

                                                                    <CardBody>

                                                                        <CardText>
                                                                            {selectedIndexCalculatedRisk.totalTradableLots}

                                                                        </CardText>
                                                                    </CardBody>
                                                                </Card>
                                                            </Col>
                                                            <Col md="3">
                                                                <Card color="" className="card calculated-risk-card" md="2">
                                                                    <h6 className="card-header">Total Tradable Quantity</h6>

                                                                    <CardBody>

                                                                        <CardText>
                                                                            {selectedIndexCalculatedRisk.totalTradableQuantity}

                                                                        </CardText>
                                                                    </CardBody>
                                                                </Card>
                                                            </Col>
                                                            <Col md="3">
                                                                <Card color="" className="card calculated-risk-card" md="2">
                                                                    <h6 className="card-header">Total Trade Capital</h6>

                                                                    <CardBody>

                                                                        <CardText>
                                                                            {selectedIndexCalculatedRisk.totalTradeCapital}

                                                                        </CardText>
                                                                    </CardBody>
                                                                </Card>
                                                            </Col>
                                                            <Col md="3">
                                                                <Card color="" className="card calculated-risk-card" md="2">
                                                                    <h6 className="card-header">Total SL of Trade</h6>

                                                                    <CardBody>

                                                                        <CardText>
                                                                            <i className="mdi mdi-trending-down" style={{fontSize: "32px", color:"red"}}></i> &nbsp;
                                                                            <h4 style={{    marginTop: "-37px",
    marginRight: "-80px"}}>
                                                                            {selectedIndexCalculatedRisk.totalSLofTrade}</h4>

                                                                        </CardText>
                                                                    </CardBody>
                                                                </Card>
                                                            </Col>
                                                            <Col md="3">
                                                                <Card color="" className="card calculated-risk-card" md="2">
                                                                    <h6 className="card-header">Target in One Trade</h6>

                                                                    <CardBody>
                                                                        <CardText>
                                                                            
                                                                        <i className="mdi mdi-target lg" style={{fontSize: "32px", color:"#0bb197"}}></i> &nbsp;
                                                                            
                                                                           <h4 style={{    marginTop: "-37px",
    marginRight: "-80px"}}> {selectedIndexCalculatedRisk.totalTargetofTrade}</h4>

                                                                        </CardText>
                                                                    </CardBody>
                                                                </Card>
                                                            </Col>
                                                            {/* <Col md="3">
                                                                <Card color="" className="card calculated-risk-card" md="2">
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
                                {/* </Col> */}

                            </Col>
                        </Row>
                )}

            </div>
        </React.Fragment>
    );
};

export default RiskCalculator;