import React, { useEffect, useState } from "react";
import ReactHtmlParser from 'react-html-parser';
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
import { IndexType, BANKNIFTY_LOT_SIZE, FINNIFTY_LOT_SIZE, NIFTY50_LOT_SIZE } from "../../constants/NSE_index";
const TargetCalculator = () => {
  document.title = "Target Calculator";

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
  const targetCalculatorForm = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      tradingCapital: 10000,
      numberOfTradingSessions: 10,
      maxSLCountOneDay: 2,
      maxDrawDownPercentage: 15,
      targetRatioMultiplier: 2,
      maxTradeInOneDay: 4,
      averageTargetHitTradeInOneDay: 2,
      averageSLHitTradeInOneDay: 2,
      zeroSLHitTradeInOneDay: 0,
      zeroTargetHitTradeInOneDay: 0,
      normalTradingDays: 10, // numberOfTradingSessions-(zeroSLHitTradeInOneDay+zeroTargetHitTradeInOneDay)
      averageTradingChargesPerTrade: 50, //Buy & Sell Charges
      totalTradesInOneDay: 4, // averageTargetHitTradeInOneDay+averageSLHitTradeInOneDay
      maxTradeAmountInOneDay: 1000, // tradingCapital/numberOfTradingSessions
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
      averageTargetHitTradeInOneDay: Yup.number().required("Please provide Average Target Hit Trade In One Day"),
      averageSLHitTradeInOneDay: Yup.number().required("Please provide Average SL Hit Trade In One Day"),
      zeroSLHitTradeInOneDay: Yup.number().required("Please provide Zero SL Hit Trade In One Day")
        .min(0, "Zero SL Hit Trade In One Day should be at least 0")
        .max(20, "Zero SL Hit Trade In One Day can be at most 20 "),
      zeroTargetHitTradeInOneDay: Yup.number().required("Please provide Zero Target Hit Trade In One Day")
        .min(0, "Zero Target Hit Trade In One Day should be at least 0")
        .max(4, "Zero Target Hit Trade In One Day can be at most 4"),
      averageTradingChargesPerTrade: Yup.number().required("Please provide Average Trading Charges Per Trade (Buy & Sell)")
        .default(50),

    }),
    onSubmit: async (values) => {
      setLoading(true)
      setSelectedIndex(null);
      await new Promise(r => setTimeout(r, 1500));
      calculateRisk(values);
    },
  });

  const calculateRisk = (targetCalculatorFormValues) => {
    // Calculate Risk Metadata
    const { maxSLCapacityDaily, maxSLCapacityInOneTrade } = calculateRiskMetadata(targetCalculatorFormValues);
    setCalculateMetadata({ maxSLCapacityDaily, maxSLCapacityInOneTrade });
    let calculatedRiskRows = [];
    tradeIndexes.forEach((tradeIndex) => {
      const { lotSize, optionPremium, indexName } = tradeIndex;
      let calculatedRiskOfIndexResult = calculateRiskofIndex(targetCalculatorFormValues, lotSize, optionPremium, indexName, maxSLCapacityInOneTrade);
      calculatedRiskRows.push(calculatedRiskOfIndexResult);
    });

    setCalculatedRiskRows(calculatedRiskRows);
    setSelectedIndex(IndexType.BANKNIFTY);
    setLoading(false)

  }

  const calculateRiskofIndex = (targetCalculatorFormValues, lotSize, optionPremium, indexName, maxSLCapacityInOneTrade) => {
    let calculatedLotSize = lotSize;
    targetCalculatorFormValues.optionPremium = optionPremium;
    let SLAmountInOptionPremium = calculateSLAmountInOptionPremium(targetCalculatorFormValues);
    let optionPremiumTargetPrice = calculateOptionPremiumTargetPrice(targetCalculatorFormValues, SLAmountInOptionPremium);
    let optionPremiumExitPrice = calculateOptionPremiumExitPrice(targetCalculatorFormValues, SLAmountInOptionPremium);
    let totalTradableLots = calculateTotalTradableLots(targetCalculatorFormValues, maxSLCapacityInOneTrade, calculatedLotSize);
    let totalTradableQuantity = calculateTotalTradableQuantity(totalTradableLots, calculatedLotSize);
    let totalTradeCapital = calculateTotalTradeCapital(targetCalculatorFormValues, totalTradableQuantity);
    let totalSLofTrade = calculateTotalSLofTrade(totalTradableQuantity, SLAmountInOptionPremium);
    let totalTargetofTrade = calculateTotalTargetofTrade(optionPremiumTargetPrice, totalTradableQuantity, totalTradeCapital);
    let capitalLeftAfterTradingSessions = calculateCapitalLeftAfterTradingSessions(targetCalculatorFormValues, totalSLofTrade);
    // let drawDownMetricsResult = calculateDrawDownMetrics(targetCalculatorFormValues)


    let remainingCapitalDayWise = []
    let capitalDayWiseLabels = []
    let currentCapital = targetCalculatorFormValues.tradingCapital;
    let maxTradingSessions = targetCalculatorFormValues.numberOfTradingSessions;
    for (let i = 1; i <= maxTradingSessions; i++) {
      capitalDayWiseLabels.push(`Day ${i}`);
      remainingCapitalDayWise.push(currentCapital - (totalSLofTrade * targetCalculatorFormValues.maxSLCountOneDay));
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
    const profitInSuccessfulDays = 0 //TODO:
    const lossInUnsuccessfulDays = 0 //TODO:
    const profitAfterAllTradingSessions = 0 //TODO:
    const totalTradingCharges = 0 //TODO:
    const targetAfterTradingCharges = 0 //TODO:
    const finalTargetCapitalAfterTradingCharges = 0 //TODO:
    const finalCapitalAfterTradingChargesIfMaxSLHit = 0 //TODO:
    const normalTradingDays = 0 //TODO:
    const totalTradesInOneDay = 0 //TODO:
    const maxTradeAmountInOneDay = 2 //TODO:
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
      profitInSuccessfulDays,
      lossInUnsuccessfulDays,
      profitAfterAllTradingSessions,
      totalTradingCharges,
      targetAfterTradingCharges,
      finalTargetCapitalAfterTradingCharges,
      finalCapitalAfterTradingChargesIfMaxSLHit,
      normalTradingDays,
      totalTradesInOneDay,
      maxTradeAmountInOneDay,
      drawDownMetrics: {
        labels,
        series
      }

    }

  }


  const calculateRiskMetadata = (targetCalculatorFormValues) => {
    const maxSLCapacityDaily = Math.floor(targetCalculatorFormValues.tradingCapital / targetCalculatorFormValues.numberOfTradingSessions);
    const maxSLCapacityInOneTrade = Math.floor(maxSLCapacityDaily / targetCalculatorFormValues.maxSLCountOneDay);
    return {
      maxSLCapacityDaily,
      maxSLCapacityInOneTrade
    }
  }
  const calculateSLAmountInOptionPremium = (targetCalculatorFormValues,) => {
    return Math.floor(targetCalculatorFormValues.optionPremium * (targetCalculatorFormValues.maxDrawDownPercentage / 100));
  }
  const calculateOptionPremiumTargetPrice = (targetCalculatorFormValues, SLAmountInOptionPremium) => {
    return Math.floor(targetCalculatorFormValues.optionPremium + (SLAmountInOptionPremium * targetCalculatorFormValues.targetRatioMultiplier));
  }
  const calculateOptionPremiumExitPrice = (targetCalculatorFormValues, SLAmountInOptionPremium) => {
    return Math.floor(targetCalculatorFormValues.optionPremium - SLAmountInOptionPremium);

  }
  const calculateTotalTradableLots = (targetCalculatorFormValues, maxSLCapacityInOneTrade, lotSize) => {
    return Math.floor((maxSLCapacityInOneTrade / (targetCalculatorFormValues.optionPremium * (targetCalculatorFormValues.maxDrawDownPercentage / 100))) / lotSize);
  }
  const calculateTotalTradableQuantity = (totalTradableLots, lotSize) => {
    return totalTradableLots * lotSize;
  }
  const calculateTotalTradeCapital = (targetCalculatorFormValues, totalTradableQuantity) => {
    return totalTradableQuantity * targetCalculatorFormValues.optionPremium;
  }
  const calculateTotalSLofTrade = (totalTradableQuantity, SLAmountInOptionPremium) => {
    return totalTradableQuantity * SLAmountInOptionPremium;

  }
  const calculateTotalTargetofTrade = (optionPremiumTargetPrice, totalTradableQuantity, totalTradeCapital) => {
    return (optionPremiumTargetPrice * totalTradableQuantity) - totalTradeCapital;
  }
  const calculateCapitalLeftAfterTradingSessions = (targetCalculatorFormValues, totalSLofTrade) => {
    return targetCalculatorFormValues.tradingCapital - (totalSLofTrade * targetCalculatorFormValues.numberOfTradingSessions * targetCalculatorFormValues.maxSLCountOneDay);
  }


  const handleResetClick = () => {
    targetCalculatorForm.resetForm(); // Reset the form's values and errors
  };
  const optionPremiumChangeHandler = async (event, indexName) => {
    let updatedOptionPremium = event.target.value;
    if (!event.target.value) {
      updatedOptionPremium = 0;
    } else if (event.target.value < 0) {
      updatedOptionPremium = 0;
    } else if (event.target.value) {
      console.log(parseInt(event.target.value));
      updatedOptionPremium = parseInt(event.target.value);
    }
    let updatedCalculateRiskRows = [];
    setCalculatedRiskRows([]);
    calculatedRiskRows.forEach((riskRow) => {
      if (riskRow.indexName == indexName) {
        riskRow.optionPremium = parseInt(updatedOptionPremium);

        const calculatedRiskOfIndexResult = calculateRiskofIndex(targetCalculatorForm.values, riskRow.lotSize, riskRow.optionPremium, riskRow.indexName, calculateMetadata.maxSLCapacityInOneTrade);
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
          <Breadcrumbs title="Calculator" breadcrumbItem="Target Calculator" />
        </Container>
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody style={{ background: "rgb(241 241 241 / 7%)" }}>
                {/* <CardTitle>Risk Calculator</CardTitle> */}
                <br />
                <CardSubtitle className="mb-3">
                  This tool will help you calculate the approximate amount of money you can risk in a trade based on your account size, percentage risk per trade, and stop loss.
                </CardSubtitle>
                <br />
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    targetCalculatorForm.handleSubmit();
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
                              onChange={targetCalculatorForm.handleChange}
                              onBlur={targetCalculatorForm.handleBlur}
                              value={targetCalculatorForm.values.tradingCapital || ""}
                              invalid={
                                targetCalculatorForm.touched.tradingCapital &&
                                  targetCalculatorForm.errors.tradingCapital
                                  ? true
                                  : false
                              }
                            />
                            {targetCalculatorForm.touched.tradingCapital &&
                              targetCalculatorForm.errors.tradingCapital ? (
                              <FormFeedback type="invalid">
                                {targetCalculatorForm.errors.tradingCapital}
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
                              onChange={targetCalculatorForm.handleChange}
                              onBlur={targetCalculatorForm.handleBlur}
                              value={targetCalculatorForm.values.numberOfTradingSessions || ""}
                              invalid={
                                targetCalculatorForm.touched.numberOfTradingSessions &&
                                  targetCalculatorForm.errors.numberOfTradingSessions
                                  ? true
                                  : false
                              }
                            />
                            {targetCalculatorForm.touched.numberOfTradingSessions &&
                              targetCalculatorForm.errors.numberOfTradingSessions ? (
                              <FormFeedback type="invalid">
                                {targetCalculatorForm.errors.numberOfTradingSessions}
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
                              onChange={targetCalculatorForm.handleChange}
                              onBlur={targetCalculatorForm.handleBlur}
                              value={targetCalculatorForm.values.maxSLCountOneDay || ""}
                              invalid={
                                targetCalculatorForm.touched.maxSLCountOneDay &&
                                  targetCalculatorForm.errors.maxSLCountOneDay
                                  ? true
                                  : false
                              }
                            />
                            {targetCalculatorForm.touched.maxSLCountOneDay &&
                              targetCalculatorForm.errors.maxSLCountOneDay ? (
                              <FormFeedback type="invalid">
                                {targetCalculatorForm.errors.maxSLCountOneDay}
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
                              onChange={targetCalculatorForm.handleChange}
                              onBlur={targetCalculatorForm.handleBlur}
                              value={targetCalculatorForm.values.maxDrawDownPercentage || ""}
                              invalid={
                                targetCalculatorForm.touched.maxDrawDownPercentage &&
                                  targetCalculatorForm.errors.maxDrawDownPercentage
                                  ? true
                                  : false
                              }
                            />
                            {targetCalculatorForm.touched.maxDrawDownPercentage &&
                              targetCalculatorForm.errors.maxDrawDownPercentage ? (
                              <FormFeedback type="invalid">
                                {targetCalculatorForm.errors.maxDrawDownPercentage}
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
                              onChange={targetCalculatorForm.handleChange}
                              onBlur={targetCalculatorForm.handleBlur}
                              value={targetCalculatorForm.values.targetRatioMultiplier || ""}
                              invalid={
                                targetCalculatorForm.touched.targetRatioMultiplier &&
                                  targetCalculatorForm.errors.targetRatioMultiplier
                                  ? true
                                  : false
                              }
                            />
                            {targetCalculatorForm.touched.targetRatioMultiplier &&
                              targetCalculatorForm.errors.targetRatioMultiplier ? (
                              <FormFeedback type="invalid">
                                {targetCalculatorForm.errors.targetRatioMultiplier}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </Col>
                        <Col md="6">
                          <div className="mb-3">
                            <Label className="form-label">Average Trading Charge of One Trade (Buy & Sell)</Label>
                            <Input
                              name="averageTradingChargesPerTrade"
                              label="averageTradingChargesPerTrade"
                              placeholder="Please provide Average Trading Charge of One Trade (Buy & Sell)"
                              type="number"
                              onChange={targetCalculatorForm.handleChange}
                              onBlur={targetCalculatorForm.handleBlur}
                              value={targetCalculatorForm.values.averageTradingChargesPerTrade || ""}
                              invalid={
                                targetCalculatorForm.touched.averageTradingChargesPerTrade &&
                                  targetCalculatorForm.errors.averageTradingChargesPerTrade
                                  ? true
                                  : false
                              }
                            />
                            {targetCalculatorForm.touched.averageTradingChargesPerTrade &&
                              targetCalculatorForm.errors.averageTradingChargesPerTrade ? (
                              <FormFeedback type="invalid">
                                {targetCalculatorForm.errors.averageTradingChargesPerTrade}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </Col>

                      </Row>
                      <Row>
                        <Col md="6">
                          <div className="mb-3">
                            <Label className="form-label">Average SL Hit Trade in One Day</Label>
                            <Input
                              name="averageSLHitTradeInOneDay"
                              label="averageSLHitTradeInOneDay"
                              placeholder="Please provide Average SL Hit Trade In One Day"
                              type="number"
                              onChange={targetCalculatorForm.handleChange}
                              onBlur={targetCalculatorForm.handleBlur}
                              value={targetCalculatorForm.values.averageSLHitTradeInOneDay || ""}
                              invalid={
                                targetCalculatorForm.touched.averageSLHitTradeInOneDay &&
                                  targetCalculatorForm.errors.averageSLHitTradeInOneDay
                                  ? true
                                  : false
                              }
                            />
                            {targetCalculatorForm.touched.averageSLHitTradeInOneDay &&
                              targetCalculatorForm.errors.averageSLHitTradeInOneDay ? (
                              <FormFeedback type="invalid">
                                {targetCalculatorForm.errors.averageSLHitTradeInOneDay}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </Col>
                        <Col md="6">
                          <div className="mb-3">
                            <Label className="form-label">Average Target Hit Trade in One Day</Label>
                            <Input
                              name="averageTargetHitTradeInOneDay"
                              label="averageTargetHitTradeInOneDay"
                              placeholder="Please provide Average Target Hit Trade In One Day"
                              type="number"
                              onChange={targetCalculatorForm.handleChange}
                              onBlur={targetCalculatorForm.handleBlur}
                              value={targetCalculatorForm.values.averageTargetHitTradeInOneDay || ""}
                              invalid={
                                targetCalculatorForm.touched.averageTargetHitTradeInOneDay &&
                                  targetCalculatorForm.errors.averageTargetHitTradeInOneDay
                                  ? true
                                  : false
                              }
                            />
                            {targetCalculatorForm.touched.averageTargetHitTradeInOneDay &&
                              targetCalculatorForm.errors.averageTargetHitTradeInOneDay ? (
                              <FormFeedback type="invalid">
                                {targetCalculatorForm.errors.averageTargetHitTradeInOneDay}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="6">
                          <div className="mb-3">
                            <Label className="form-label">Zero SL Trade in One Day</Label>
                            <Input
                              name="zeroSLHitTradeInOneDay"
                              label="zeroSLHitTradeInOneDay"
                              placeholder="Please provide Zero SL Hit Trade In One Day"
                              type="number"
                              onChange={targetCalculatorForm.handleChange}
                              onBlur={targetCalculatorForm.handleBlur}
                              value={targetCalculatorForm.values.zeroSLHitTradeInOneDay || ""}
                              invalid={
                                targetCalculatorForm.touched.zeroSLHitTradeInOneDay &&
                                  targetCalculatorForm.errors.zeroSLHitTradeInOneDay
                                  ? true
                                  : false
                              }
                            />
                            {targetCalculatorForm.touched.zeroSLHitTradeInOneDay &&
                              targetCalculatorForm.errors.zeroSLHitTradeInOneDay ? (
                              <FormFeedback type="invalid">
                                {targetCalculatorForm.errors.zeroSLHitTradeInOneDay}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </Col>
                        <Col md="6">
                          <div className="mb-3">
                            <Label className="form-label">Zero Target Hit Trade in One Day</Label>
                            <Input
                              name="zeroTargetHitTradeInOneDay"
                              label="zeroTargetHitTradeInOneDay"
                              placeholder="Please provide Zero Target Hit Trade In One Day"
                              type="number"
                              onChange={targetCalculatorForm.handleChange}
                              onBlur={targetCalculatorForm.handleBlur}
                              value={targetCalculatorForm.values.zeroTargetHitTradeInOneDay || ""}
                              invalid={
                                targetCalculatorForm.touched.zeroTargetHitTradeInOneDay &&
                                  targetCalculatorForm.errors.zeroTargetHitTradeInOneDay
                                  ? true
                                  : false
                              }
                            />
                            {targetCalculatorForm.touched.zeroTargetHitTradeInOneDay &&
                              targetCalculatorForm.errors.zeroTargetHitTradeInOneDay ? (
                              <FormFeedback type="invalid">
                                {targetCalculatorForm.errors.zeroTargetHitTradeInOneDay}
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
                          <Button type="submit" color="info" className="btn-lg" style={{ padding: "10px 28px", borderRadius: "4px", background: "#12d6df", outline: 0, border: 0 }}>
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
            <Col md={12} style={{ boxShadow: "rgb(179 179 184 / 78%) -3px -3px 5px", padding: "0", width: "100%" }} >
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
                    <Col md="2" style={{ marginBottom: "30px" }}>
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
                    <Col md="3">
                      <div className="mb-3">
                        <div style={{ minHeight: "50px" }}>
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
                    <Col md="6" className="text-left" style={{ display: "flex", alignItems: "center", marginTop: "40px", marginLeft: "50px" }}>
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
                      {selectedIndexCalculatedRisk.drawDownMetrics && <DayWiseCapitalDrawDown drawDownMetrics={selectedIndexCalculatedRisk.drawDownMetrics} title={`Day Wise Capital Drawdown at <strong>&#8377; ${selectedIndexCalculatedRisk.optionPremium}</strong>  Option Premium`} calculatedMetadata={[
                        {
                          title: `Starting Trading Capital`,
                          count: `&#8377; ${targetCalculatorForm.values.tradingCapital} `,
                          color: "info",
                        },
                        {
                          title: `Capital left after ${targetCalculatorForm.values.numberOfTradingSessions} Trading Sessions`,
                          count: `&#8377; ${selectedIndexCalculatedRisk.capitalLeftAfterTradingSessions}`,
                          color: "primary",
                        },
                        {
                          title: "Tradable Lots in 1 Trade",
                          count: `${selectedIndexCalculatedRisk.totalTradableLots}`,
                          color: `${selectedIndexCalculatedRisk.totalTradableLots > 0 ? 'primary' : ''}`,
                          makeDanger: `${selectedIndexCalculatedRisk.totalTradableLots > 0 ? false : true}`,
                        },
                        {
                          title: "Daily Max SL Capacity",
                          count: `&#8377; ${calculateMetadata.maxSLCapacityDaily}`,
                          percentage: (calculateMetadata.maxSLCapacityDaily / targetCalculatorForm.values.tradingCapital * 100).toFixed(2),
                          color: "danger",
                        },
                        {
                          title: "Max SL in One Trade",
                          count: `&#8377; ${calculateMetadata.maxSLCapacityInOneTrade}`,
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
                          <Card color="" className={`${selectedIndexCalculatedRisk.totalTradableLots > 0 ? 'card-primary' : 'card-danger'} calculated-risk-card`} md="2">
                            <h6 className="card-header">Tradable Lots in 1 Trade</h6>

                            <CardBody>

                              <CardText>
                                {selectedIndexCalculatedRisk.totalTradableLots}

                              </CardText>
                            </CardBody>
                          </Card>
                        </Col>
                        <Col md="3">

                          <Card color="" className="card calculated-risk-card" md="2">
                            <h6 className="card-header">SL of 1 Trade</h6>

                            <CardBody>

                              <CardText>
                                <i className="mdi mdi-trending-down" style={{ fontSize: "32px", color: "red" }}></i> &nbsp;
                                <h4 style={{ marginTop: "-37px", marginRight: "0px", textAlign: "center" }}>
                                  &#8377; {selectedIndexCalculatedRisk.totalSLofTrade}</h4>

                              </CardText>
                            </CardBody>
                          </Card>
                        </Col>
                        <Col md="3">
                          <Card color="" className="card calculated-risk-card" md="2">
                            <h6 className="card-header">Target in 1 Trade</h6>

                            <CardBody>
                              <CardText>

                                <i className="mdi mdi-target lg" style={{ fontSize: "32px", color: "#0bb197" }}></i> &nbsp;

                                <h4 style={{
                                  marginTop: "-37px",
                                  marginRight: "0px", textAlign: "center"
                                }}>&#8377; {selectedIndexCalculatedRisk.totalTargetofTrade}</h4>

                              </CardText>
                            </CardBody>
                          </Card>
                        </Col>
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
                                &#8377; {selectedIndexCalculatedRisk.optionPremium}

                              </CardText>
                            </CardBody>
                          </Card>
                        </Col>
                        <Col md="3">
                          <Card color="" className="card calculated-risk-card" md="2">
                            <h6 className="card-header">SL in Option Premium</h6>

                            <CardBody>

                              <CardText>
                                &#8377; {selectedIndexCalculatedRisk.SLAmountInOptionPremium}

                              </CardText>
                            </CardBody>
                          </Card>


                        </Col>
                        <Col md="3">
                          <Card color="" className="card calculated-risk-card" md="2">
                            <h6 className="card-header">Target in Option Premium</h6>

                            <CardBody>

                              <CardText>
                                &#8377; {selectedIndexCalculatedRisk.optionPremiumTargetPrice}

                              </CardText>
                            </CardBody>
                          </Card>


                        </Col>
                        <Col md="3">
                          <Card color="" className="card calculated-risk-card" md="2">
                            <h6 className="card-header">Option Premium Exit Price</h6>

                            <CardBody>

                              <CardText>
                                &#8377; {selectedIndexCalculatedRisk.optionPremiumExitPrice}

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
                                &#8377; {selectedIndexCalculatedRisk.totalTradeCapital}

                              </CardText>
                            </CardBody>
                          </Card>
                        </Col>
                        <Col md="3">
                          <Card color="" className="card calculated-risk-card" md="2">
                            <h6 className="card-header">Profit in Successful Days</h6>

                            <CardBody>

                              <CardText>
                                &#8377; {selectedIndexCalculatedRisk.profitInSuccessfulDays}

                              </CardText>
                            </CardBody>
                          </Card>
                        </Col>
                        <Col md="3">
                          <Card color="" className="card calculated-risk-card" md="2">
                            <h6 className="card-header">Loss in UnSuccessful Days</h6>

                            <CardBody>

                              <CardText>
                                &#8377; {selectedIndexCalculatedRisk.lossInUnsuccessfulDays}

                              </CardText>
                            </CardBody>
                            </Card>
                          </Col>
                          <Col md="3">
                            <Card color="" className="card calculated-risk-card" md="2">
                              <h6 className="card-header">Profit after all Trading Sessions</h6>
                              <CardBody>
                                <CardText>
                                  &#8377; {selectedIndexCalculatedRisk.profitAfterAllTradingSessions}
                                </CardText>
                              </CardBody>
                              </Card>
                            </Col>
                            <Col md="3">
                              <Card color="" className="card calculated-risk-card" md="2">
                                <h6 className="card-header">Total Trading Charges</h6>
                                <CardBody>
                                  <CardText>
                                    &#8377; {selectedIndexCalculatedRisk.totalTradingCharges}
                                  </CardText>
                                </CardBody>
                                </Card>
                              </Col>
                              <Col md="3">
                                <Card color="" className="card calculated-risk-card" md="2">
                                  <h6 className="card-header">Target After Trading Charges</h6>
                                  <CardBody>
                                    <CardText>
                                      &#8377; {selectedIndexCalculatedRisk.targetAfterTradingCharges}
                                    </CardText>
                                  </CardBody>
                                  </Card>
                                </Col>
                                <Col md="3">
                                  <Card color="" className="card calculated-risk-card" md="2">
                                    <h6 className="card-header">Final Target Capital after Trading Charges</h6>
                                    <CardBody>
                                      <CardText>
                                        &#8377; {selectedIndexCalculatedRisk.finalTargetCapitalAfterTradingCharges}
                                      </CardText>
                                    </CardBody>
                                    </Card>
                                  </Col>
                                  <Col md="3">
                                    <Card color="" className="card calculated-risk-card" md="2">
                                      <h6 className="card-header">Final Capital after Trading Sessions <br /><span style={{fontWeight:"normal", fontSize:"0.8em"}}>(If Max SL count hit everyday)</span> </h6>
                                      
                                      <CardBody>
                                        <CardText>
                                          &#8377; {selectedIndexCalculatedRisk.finalCapitalAfterTradingChargesIfMaxSLHit}
                                        </CardText>
                                      </CardBody>
                                      </Card>
                                    </Col>
                                    <Col md="3">
                                      <Card color="" className="card calculated-risk-card" md="2">
                                        <h6 className="card-header">Normal Trading Days</h6>
                                        <CardBody>
                                          <CardText>
                                            {selectedIndexCalculatedRisk.normalTradingDays}
                                          </CardText>
                                        </CardBody>
                                        </Card>
                                      </Col>
                                      <Col md="3">
                                        <Card color="" className="card calculated-risk-card" md="2">
                                          <h6 className="card-header">Total Trades in One Day</h6>
                                          <CardBody>
                                            <CardText>
                                              {selectedIndexCalculatedRisk.totalTradesInOneDay}
                                            </CardText>
                                          </CardBody>
                                          </Card>
                                        </Col>
                                        <Col md="3">
                                          <Card color="" className="card calculated-risk-card" md="2">
                                            <h6 className="card-header">Max Trading Amount in One Day</h6>
                                            <CardBody>
                                              <CardText>
                                               {selectedIndexCalculatedRisk.maxTradeAmountInOneDay}
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

export default TargetCalculator;