import classnames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardSubtitle,
  CardText,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Toast,
  ToastBody,
  ToastHeader,
  UncontrolledAlert
} from "reactstrap";

//Import Breadcrumb
import { useFormik } from "formik";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import logoVoiled from "../../assets/images/OnlyLogoVoiled.png";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import PremiumModal from "../../components/Common/PremiumModal";
import { DEFAULT_AVERAGE_SL_HIT_TRADE_IN_ONE_DAY, DEFAULT_AVERAGE_TARGET_HIT_TRADE_IN_ONE_DAY, DEFAULT_AVERAGE_TRADING_CHARGES_PER_TRADE, DEFAULT_DESIRED_NUMBER_OF_TRADING_SESSIONS, DEFAULT_MAX_DRAW_DOWN_PERCENTAGE, DEFAULT_MAX_SL_COUNT_ONE_DAY, DEFAULT_MAX_TRADE_AMOUNT_IN_ONE_DAY, DEFAULT_MAX_TRADE_IN_ONE_DAY, DEFAULT_NORMAL_TRADING_DAYS, DEFAULT_PERCENTAGE_OF_TRADING_CAPITAL_IN_ONE_TRADE, DEFAULT_TARGET_RATIO_MULTIPLIER, DEFAULT_TOTAL_TRADES_IN_ONE_DAY, DEFAULT_TRADING_CAPITAL, DEFAULT_ZERO_SL_HIT_TRADE_DAYS, DEFAULT_ZERO_TARGET_HIT_TRADE_DAYS } from "../../constants/calculator";
import { BANKNIFTY_LOT_SIZE, FINNIFTY_LOT_SIZE, IndexType, NIFTY50_LOT_SIZE } from "../../constants/NSE_index";
import { getFirebaseBackend } from "../../helpers/firebase_helper";
import LotSizeCards from "../CommonPages/LotSizeCards";
import CustomOptionPremiumStackedBar from "./CustomOptionPremiumStackedBar";
import DayWiseCapitalDrawDown from "./DayWiseCapitalDrawDown";
const TargetCalculator = (props) => {
  const navigate = useNavigate()
  document.title = "Target Calculator";

  const premiumOnlyInputs = ['maxSLCountOneDay', 'maxDrawDownPercentage', 'targetRatioMultiplier','maxTradeInOneDay','averageTargetHitTradeInOneDay', 'averageSLHitTradeInOneDay', 'zeroSLHitTradeDays', 'zeroTargetHitTradeDays', 'normalTradingDays','averageTradingChargesPerTrade','totalTradesInOneDay','maxTradeAmountInOneDay']
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [purchasePremiumModal, setPurchasePremiumModal] = useState(false);
  const [configNameModal, setConfigNameModal] = useState(false);
  const [activeTab, setactiveTab] = useState("1");
  const [targetCalculatorConfigs, setTargetCalculatorConfigs] = useState([]);
  const [configName, setConfigName] = useState("");
  useEffect(() => {
    if (props.user) {
      setLoggedInUser(JSON.parse(JSON.stringify(props.user)))
    } else {
      setLoggedInUser(null)
      navigate('/logout');
    }
  }, [props.user])

  const fetchTargetCalculatorConfigs = async () => {
    const response = await getFirebaseBackend().fetchTargetCalculatorConfigFromFirestore();
    if (response.status) {
      setTargetCalculatorConfigs([...response.data]);
    }
  }
  const toggle2 = async (tab) => {
    if (activeTab !== tab) {
      if (tab == "2") {
        const response = await fetchTargetCalculatorConfigs();

      }
      setactiveTab(tab);
    }
  };



  const [invalidFormValueToast, setInvalidFormValueToast] = React.useState(false);
  const toggleInvalidFormValueToast = () => {
    setInvalidFormValueToast(!invalidFormValueToast);
    setTimeout(() => {
      setInvalidFormValueToast(false);
    }, 4000);
  }


  const resultContainerRef = useRef(null);
  const scrollTop = () => {
    setTimeout(() => {
        const tabContent = document.querySelector('.calculator-tab-content');
        if(tabContent) {
            window.scrollBy({ top: tabContent.offsetHeight + 100, behavior: 'smooth' });
        }
    }, 100);
  };
  // const bringResultContainerToTop = () => {
  //   resultContainerRef.current.scrollTop = -500;
  // };

  const [disableTheInputs, setDisableTheInputs] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(IndexType.BANKNIFTY);
  const [selectedIndexCalculatedRisk, setSelectedIndexCalculatedRisk] = useState({});

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

  const [calculatedMetadata, setCalculatedMetadata] = useState({
    maxSLCapacityDaily: 0,
    maxSLCapacityInOneTrade: 0,
    maxTradeAmountInOneDay: 0,
    numberOfTradingSessions: 0
  });

  const [calculatedRiskRows, setCalculatedRiskRows] = useState([]);

  const disableInputsHandler = () => {
    if (loggedInUser && !loggedInUser.isPremiumUser) {
      setPurchasePremiumModal(true);
      return;
    } else {
      setDisableTheInputs(!disableTheInputs);
    }
  }


  // Form validation
  const targetCalculatorForm = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      tradingCapital: DEFAULT_TRADING_CAPITAL,
      desiredNumberOfTradingSessions: DEFAULT_DESIRED_NUMBER_OF_TRADING_SESSIONS,
      percentageOfTradingCapitalInOneTrade: DEFAULT_PERCENTAGE_OF_TRADING_CAPITAL_IN_ONE_TRADE,
      maxSLCountOneDay: DEFAULT_MAX_SL_COUNT_ONE_DAY,
      maxDrawDownPercentage: DEFAULT_MAX_DRAW_DOWN_PERCENTAGE,
      targetRatioMultiplier: DEFAULT_TARGET_RATIO_MULTIPLIER,
      maxTradeInOneDay: DEFAULT_MAX_TRADE_IN_ONE_DAY,
      averageTargetHitTradeInOneDay: DEFAULT_AVERAGE_TARGET_HIT_TRADE_IN_ONE_DAY,
      averageSLHitTradeInOneDay: DEFAULT_AVERAGE_SL_HIT_TRADE_IN_ONE_DAY,
      zeroSLHitTradeDays: DEFAULT_ZERO_SL_HIT_TRADE_DAYS,
      zeroTargetHitTradeDays: DEFAULT_ZERO_TARGET_HIT_TRADE_DAYS,
      normalTradingDays: DEFAULT_NORMAL_TRADING_DAYS, // numberOfTradingSessions-(zeroSLHitTradeDays+zeroTargetHitTradeDays)
      averageTradingChargesPerTrade: DEFAULT_AVERAGE_TRADING_CHARGES_PER_TRADE, //Buy & Sell Charges
      totalTradesInOneDay: DEFAULT_TOTAL_TRADES_IN_ONE_DAY, // averageTargetHitTradeInOneDay+averageSLHitTradeInOneDay
      maxTradeAmountInOneDay: DEFAULT_MAX_TRADE_AMOUNT_IN_ONE_DAY, // tradingCapital/numberOfTradingSessions
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
      averageTargetHitTradeInOneDay: Yup.number().required("Please provide Average Target Hit Trade In One Day"),
      averageSLHitTradeInOneDay: Yup.number().required("Please provide Average SL Hit Trade In One Day"),
      zeroSLHitTradeDays: Yup.number()
        .required("Please provide Zero SL Hit Trade In One Day")
        .min(0, "Zero SL Hit Trade In One Day should be at least 0")
        .max(20, "Zero SL Hit Trade In One Day can be at most 20 ")
        .default(0),
      zeroTargetHitTradeDays: Yup.number().required("Please provide Zero Target Hit Trade In One Day")
        .min(0, "Zero Target Hit Trade In One Day should be at least 0")
        .max(4, "Zero Target Hit Trade In One Day can be at most 4")
        .default(0),
      averageTradingChargesPerTrade: Yup.number().required("Please provide Average Trading Charges Per Trade (Buy & Sell)")
        .default(50),
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

      const backend = getFirebaseBackend();
      const trialStatus = await backend.checkAndIncrementTrialCount("TargetCalculator");
      if (!trialStatus.allowed) {
            setLoading(false);
            setPurchasePremiumModal(true);
            return;
      }

      setSelectedIndex(null);
      await new Promise(r => setTimeout(r, 1500));
      validatePremiumInputs(formValues);
      calculateRisk(formValues);
      scrollTop()
    },
  });

  const validatePremiumInputs = (formValues) => {
    if (loggedInUser && !loggedInUser.isPremiumUser) {
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
      targetCalculatorForm.setFieldValue('percentageOfTradingCapitalInOneTrade', 0);
    } else if (name == 'percentageOfTradingCapitalInOneTrade') {
      targetCalculatorForm.setFieldValue('desiredNumberOfTradingSessions', 0);
    }
    // riskCalculatorForm.setFieldValue(name, value);
  }

  const calculateRisk = (targetCalculatorFormValues) => {
    // Calculate Risk Metadata
    const metadataResult = calculateRiskMetadata(targetCalculatorFormValues);
    setCalculatedMetadata({ ...metadataResult });
    // setCalculatedMetadata({ maxSLCapacityDaily, maxSLCapacityInOneTrade, maxTradeAmountInOneDay });
    let calculatedRiskRows = [];
    tradeIndexes.forEach((tradeIndex) => {
      const { lotSize, optionPremium, indexName } = tradeIndex;
      let calculatedRiskOfIndexResult = calculateRiskofIndex(targetCalculatorFormValues, lotSize, optionPremium, indexName, metadataResult.maxSLCapacityInOneTrade, metadataResult);
      calculatedRiskRows.push(calculatedRiskOfIndexResult);
    });

    setCalculatedRiskRows(calculatedRiskRows);
    setSelectedIndex(IndexType.BANKNIFTY);
    setLoading(false)
    // bringResultContainerToTop()
    // const section = document.getElementById('scrollView');
    // console.log(section,'---section---')
    // section.scrollIntoView( { behavior: 'smooth', block: 'start' } );

  }

  const calculateRiskofIndex = (targetCalculatorFormValues, lotSize, optionPremium, indexName, maxSLCapacityInOneTrade, calculatedMetadata) => {
    let calculatedLotSize = lotSize;
    targetCalculatorFormValues.optionPremium = optionPremium;
    let SLAmountInOptionPremium = calculateSLAmountInOptionPremium(targetCalculatorFormValues);
    let TargetAmountInOptionPremium = calculateTargetAmountInOptionPremium(targetCalculatorFormValues, SLAmountInOptionPremium);
    let optionPremiumTargetPrice = calculateOptionPremiumTargetPrice(targetCalculatorFormValues, SLAmountInOptionPremium);
    let optionPremiumExitPrice = calculateOptionPremiumExitPrice(targetCalculatorFormValues, SLAmountInOptionPremium);
    let totalTradableLots = calculateTotalTradableLots(targetCalculatorFormValues, maxSLCapacityInOneTrade, calculatedLotSize);
    let totalTradableQuantity = calculateTotalTradableQuantity(totalTradableLots, calculatedLotSize);
    let singleTradeAmount = calculateTotalTradeCapital(targetCalculatorFormValues, totalTradableQuantity);
    let totalSLofTrade = calculateTotalSLofTrade(totalTradableQuantity, SLAmountInOptionPremium);
    let totalTargetofTrade = calculateTotalTargetofTrade(optionPremiumTargetPrice, totalTradableQuantity, singleTradeAmount);
    let capitalLeftAfterTradingSessions = calculateCapitalLeftAfterTradingSessions(targetCalculatorFormValues, totalSLofTrade);
    // let drawDownMetricsResult = calculateDrawDownMetrics(targetCalculatorFormValues)

    // console.log('---targetCalculatorFormValues---', targetCalculatorFormValues);
    // console.log('---calculatedMetadata---', calculatedMetadata);
    // console.log('---totalTargetofTrade---', totalTargetofTrade);


    // console.log("capitalDayWiseLabels", capitalDayWiseLabels);
    // console.log("remainingCapitalDayWise", remainingCapitalDayWise);
    const profitInSuccessfulDays = targetCalculatorFormValues.averageTargetHitTradeInOneDay * targetCalculatorFormValues.zeroSLHitTradeDays * totalTargetofTrade;
    const lossInUnsuccessfulDays = targetCalculatorFormValues.averageSLHitTradeInOneDay * targetCalculatorFormValues.zeroTargetHitTradeDays * totalSLofTrade;
    const totalTradesInOneDay = targetCalculatorFormValues.averageTargetHitTradeInOneDay + targetCalculatorFormValues.averageSLHitTradeInOneDay;
    const normalTradingDays = calculatedMetadata.numberOfTradingSessions - (targetCalculatorFormValues.zeroSLHitTradeDays + targetCalculatorFormValues.zeroTargetHitTradeDays);
    let totalTradingCharges = 0;
    if (totalTradableQuantity > 0) {
      totalTradingCharges = targetCalculatorFormValues.averageTradingChargesPerTrade * totalTradesInOneDay * calculatedMetadata.numberOfTradingSessions;
    }
    // console.log(totalTargetofTrade*targetCalculatorFormValues.averageTargetHitTradeInOneDay);
    // console.log(totalSLofTrade*targetCalculatorFormValues.averageSLHitTradeInOneDay);
    // console.log(profitInSuccessfulDays-lossInUnsuccessfulDays)
    const profitAfterAllTradingSessions = (((totalTargetofTrade * targetCalculatorFormValues.averageTargetHitTradeInOneDay) - totalSLofTrade * targetCalculatorFormValues.averageSLHitTradeInOneDay) * normalTradingDays) + (profitInSuccessfulDays - lossInUnsuccessfulDays)
    const targetAfterTradingCharges = profitAfterAllTradingSessions - totalTradingCharges;
    const finalTargetCapitalAfterTradingCharges = targetCalculatorFormValues.tradingCapital + targetAfterTradingCharges;
    const finalCapitalAfterTradingChargesIfMaxSLHit = capitalLeftAfterTradingSessions - totalTradingCharges;

    let targetCapitalDayWise = []
    let capitalDayWiseLabels = []
    let averageProfitInOneDay = (totalTargetofTrade * targetCalculatorFormValues.averageTargetHitTradeInOneDay) - (totalSLofTrade * targetCalculatorFormValues.averageSLHitTradeInOneDay);

    let currentCapital = targetCalculatorFormValues.tradingCapital;
    let maxTradingSessions = calculatedMetadata.numberOfTradingSessions;
    for (let i = 1; i <= maxTradingSessions; i++) {
      capitalDayWiseLabels.push(`Day ${i}`);
      targetCapitalDayWise.push(currentCapital + averageProfitInOneDay);
      currentCapital = targetCapitalDayWise[targetCapitalDayWise.length - 1];
    }
    let series = [
      {
        name: 'Capital',
        type: 'column',
        data: [...targetCapitalDayWise]
      }
    ]
    let labels = [...capitalDayWiseLabels]
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
      profitInSuccessfulDays,
      lossInUnsuccessfulDays,
      profitAfterAllTradingSessions,
      totalTradingCharges,
      targetAfterTradingCharges,
      finalTargetCapitalAfterTradingCharges,
      finalCapitalAfterTradingChargesIfMaxSLHit,
      normalTradingDays,
      totalTradesInOneDay,
      drawDownMetrics: {
        labels,
        series
      }

    }

  }


  const calculateRiskMetadata = (targetCalculatorFormValues) => {
    const maxSLCapacityDaily = targetCalculatorFormValues.desiredNumberOfTradingSessions ? Math.floor((targetCalculatorFormValues.tradingCapital - (targetCalculatorFormValues.tradingCapital / targetCalculatorFormValues.desiredNumberOfTradingSessions)) / targetCalculatorFormValues.desiredNumberOfTradingSessions) : Math.floor((targetCalculatorFormValues.tradingCapital * targetCalculatorFormValues.percentageOfTradingCapitalInOneTrade / 100) * (targetCalculatorFormValues.maxDrawDownPercentage / 100) * targetCalculatorFormValues.maxSLCountOneDay);
    const maxSLCapacityInOneTrade = Math.floor(maxSLCapacityDaily / targetCalculatorFormValues.maxSLCountOneDay);
    const numberOfTradingSessions = targetCalculatorFormValues.desiredNumberOfTradingSessions ? targetCalculatorFormValues.desiredNumberOfTradingSessions : Math.floor(((targetCalculatorFormValues.tradingCapital - (targetCalculatorFormValues.tradingCapital * (targetCalculatorFormValues.percentageOfTradingCapitalInOneTrade / 100))) / maxSLCapacityInOneTrade) / targetCalculatorFormValues.maxSLCountOneDay) + 1; //1 is added to consider the buffer amount left after trading sessions
    const maxTradeAmountInOneDay = Math.floor(100 * (maxSLCapacityInOneTrade / targetCalculatorFormValues.maxDrawDownPercentage))

    // console.log("targetCalculatorFormValues", targetCalculatorFormValues);
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



  const calculateSLAmountInOptionPremium = (targetCalculatorFormValues,) => {
    return Math.floor(targetCalculatorFormValues.optionPremium * (targetCalculatorFormValues.maxDrawDownPercentage / 100));
  }

  const calculateTargetAmountInOptionPremium = (targetCalculatorFormValues, SLAmountInOptionPremium) => {
    return Math.floor(SLAmountInOptionPremium * targetCalculatorFormValues.targetRatioMultiplier);
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
  const calculateTotalTargetofTrade = (optionPremiumTargetPrice, totalTradableQuantity, singleTradeAmount) => {
    return (optionPremiumTargetPrice * totalTradableQuantity) - singleTradeAmount;
  }
  const calculateCapitalLeftAfterTradingSessions = (targetCalculatorFormValues, totalSLofTrade) => {
    return targetCalculatorFormValues.tradingCapital - (totalSLofTrade * calculatedMetadata.numberOfTradingSessions * targetCalculatorFormValues.maxSLCountOneDay);
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
      updatedOptionPremium = parseInt(event.target.value);
    }
    let updatedCalculateRiskRows = [];
    setCalculatedRiskRows([]);
    // setStackedBarChartData({});
    calculatedRiskRows.forEach((riskRow) => {
      if (riskRow.indexName == indexName) {
        riskRow.optionPremium = parseInt(updatedOptionPremium);

        const calculatedRiskOfIndexResult = calculateRiskofIndex(targetCalculatorForm.values, riskRow.lotSize, riskRow.optionPremium, riskRow.indexName, calculatedMetadata.maxSLCapacityInOneTrade, calculatedMetadata);
        // calculateAndSetStackedBarChartData(calculatedRiskOfIndexResult)
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
    targetCalculatorForm.setValues(config.parsedConfig);
    targetCalculatorForm.setTouched({});
    targetCalculatorForm.setErrors({});
    targetCalculatorForm.submitForm();
    toggle2("1");
  }

  const saveConfiguration = async () => {

    // if (loggedInUser && !loggedInUser.isPremiumUser) {
    //   setPurchasePremiumModal(true);
    //   return
    // }

    if (!configName) {
      alert("Please provide a name for the configuration");
      return;
    }
    setLoading(true);
    const response = await getFirebaseBackend().addOrUpdateTargetCalculatorConfigToFirestore(targetCalculatorForm.values, configName);
    if (response.status) {
      setConfigNameModal(false);
      setConfigName("");
    }else{
      alert(response.message)
      setLoading(false);
      return
    }
    setLoading(false);
    toggle2("2");
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
      <div className="page-content landing-header-main">
        <Container fluid={true}>
          <Breadcrumbs title="F&O Calculator" breadcrumbItem="Target Calculator" />
        </Container>
        <Row>
          <Col lg={12}>
            <Card>
              {/* <CardHeader className="configuration-header">
                            <h5 className="card-title mb-0 text-white">Target Configuration</h5>
              </CardHeader> */}
              <Nav pills className="navtab-bg nav-justified" style={{ borderBottom: '1px solid #ccc' }}>
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
                    Target Configuration
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
              <TabContent activeTab={activeTab} className="p-3 text-muted calculator-tab-content">
                <TabPane tabId="1">
                  <Row>
                    <Col sm="12">
                      <CardBody style={{ background: "rgb(241 241 241 / 7%)" }}>
                        {/* <CardTitle>Risk Calculator</CardTitle> */}
                        <br />
                        <CardSubtitle className="mb-3">
                          This tool will help you <strong>calculate the target amount</strong> you can <strong style={{ color: "green" }}>target in a trade</strong> based on your capital, percentage of risk per trade, and target hit ratio.
                        </CardSubtitle>
                        <br />
                        <Form
                          onSubmit={(e) => {
                            e.preventDefault();
                            targetCalculatorForm.handleSubmit();
                            return false;
                          }}
                          onChange={handleOnChange}
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
                                        onChange={targetCalculatorForm.handleChange}
                                        onBlur={targetCalculatorForm.handleBlur}
                                        value={targetCalculatorForm.values.desiredNumberOfTradingSessions || ""}
                                        invalid={
                                          targetCalculatorForm.touched.desiredNumberOfTradingSessions &&
                                            targetCalculatorForm.errors.desiredNumberOfTradingSessions
                                            ? true
                                            : false
                                        }
                                      />
                                      {targetCalculatorForm.touched.desiredNumberOfTradingSessions &&
                                        targetCalculatorForm.errors.desiredNumberOfTradingSessions ? (
                                        <FormFeedback type="invalid">
                                          {targetCalculatorForm.errors.desiredNumberOfTradingSessions}
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
                                        onChange={targetCalculatorForm.handleChange}
                                        onBlur={targetCalculatorForm.handleBlur}
                                        value={targetCalculatorForm.values.percentageOfTradingCapitalInOneTrade || ""}
                                        invalid={
                                          targetCalculatorForm.touched.percentageOfTradingCapitalInOneTrade &&
                                            targetCalculatorForm.errors.percentageOfTradingCapitalInOneTrade
                                            ? true
                                            : false
                                        }
                                      />
                                      {targetCalculatorForm.touched.percentageOfTradingCapitalInOneTrade &&
                                        targetCalculatorForm.errors.percentageOfTradingCapitalInOneTrade ? (
                                        <FormFeedback type="invalid">
                                          {targetCalculatorForm.errors.percentageOfTradingCapitalInOneTrade}
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
                                      type="number"
                                      className="calculator-form-input"
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
                                <Col xl="6">
                                  <div className="mb-3">
                                    <Label className="form-label calculator-form-input-label">Maximum SL Percentage(%) of 1 Trade</Label>
                                    <Input
                                      name="maxDrawDownPercentage"
                                      label="maxDrawDownPercentage"
                                      placeholder="Maximum SL(Drawdown) percentage of Used Capital i.e 1-30% of Used Capital"
                                      type="number"
                                      className="calculator-form-input"
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

                                <Col xl="6">
                                  <div className="mb-3">
                                    <Label className="form-label calculator-form-input-label">Target ratio 1: ?</Label>
                                    <Input
                                      name="targetRatioMultiplier"
                                      label="targetRatioMultiplier"
                                      placeholder="Enter Target multiplier with respect to Loss i.e 1,2,3... etc."
                                      type="number"
                                      className="calculator-form-input"
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
                                <Col xl="6">
                                  <div className="mb-3">
                                    <Label className="form-label calculator-form-input-label">Trading Charge of One Trade (Buy & Sell)</Label>
                                    <Input
                                      name="averageTradingChargesPerTrade"
                                      label="averageTradingChargesPerTrade"
                                      placeholder="Please provide Average Trading Charge of One Trade (Buy & Sell)"
                                      type="number"
                                      className="calculator-form-input"
                                      onChange={targetCalculatorForm.handleChange}
                                      onBlur={targetCalculatorForm.handleBlur}
                                      value={targetCalculatorForm.values.averageTradingChargesPerTrade}
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

                                <Col xl="6">
                                  <div className="mb-3">
                                    <Label className="form-label calculator-form-input-label">Average SL Hit Trade in One Day</Label>
                                    <Input
                                      name="averageSLHitTradeInOneDay"
                                      label="averageSLHitTradeInOneDay"
                                      placeholder="Please provide Average SL Hit Trade In One Day"
                                      type="number"
                                      className="calculator-form-input"
                                      onChange={targetCalculatorForm.handleChange}
                                      onBlur={targetCalculatorForm.handleBlur}
                                      value={targetCalculatorForm.values.averageSLHitTradeInOneDay}
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
                                <Col xl="6">
                                  <div className="mb-3">
                                    <Label className="form-label calculator-form-input-label">Average Target Hit Trade in One Day</Label>
                                    <Input
                                      name="averageTargetHitTradeInOneDay"
                                      label="averageTargetHitTradeInOneDay"
                                      placeholder="Please provide Average Target Hit Trade In One Day"
                                      type="number"
                                      className="calculator-form-input"
                                      onChange={targetCalculatorForm.handleChange}
                                      onBlur={targetCalculatorForm.handleBlur}
                                      value={targetCalculatorForm.values.averageTargetHitTradeInOneDay}
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

                                <Col xl="6">
                                  <div className="mb-3">
                                    <Label className="form-label calculator-form-input-label">Zero Stop Loss Days</Label>
                                    <Input
                                      name="zeroSLHitTradeDays"
                                      label="zeroSLHitTradeDays"
                                      placeholder="Please provide Zero SL Hit Trade Days"
                                      type="number"
                                      className="calculator-form-input"
                                      onChange={targetCalculatorForm.handleChange}
                                      onBlur={targetCalculatorForm.handleBlur}
                                      value={targetCalculatorForm.values.zeroSLHitTradeDays}
                                      invalid={
                                        targetCalculatorForm.touched.zeroSLHitTradeDays &&
                                          targetCalculatorForm.errors.zeroSLHitTradeDays
                                          ? true
                                          : false
                                      }
                                    />
                                    {targetCalculatorForm.touched.zeroSLHitTradeDays &&
                                      targetCalculatorForm.errors.zeroSLHitTradeDays ? (
                                      <FormFeedback type="invalid">
                                        {targetCalculatorForm.errors.zeroSLHitTradeDays}
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                                <Col xl="6">
                                  <div className="mb-3">
                                    <Label className="form-label calculator-form-input-label">Zero Target Hit Trade Days</Label>
                                    <Input
                                      name="zeroTargetHitTradeDays"
                                      label="zeroTargetHitTradeDays"
                                      placeholder="Please provide Zero Target Hit Trade Days"
                                      type="number"
                                      className="calculator-form-input"
                                      onChange={targetCalculatorForm.handleChange}
                                      onBlur={targetCalculatorForm.handleBlur}
                                      value={targetCalculatorForm.values.zeroTargetHitTradeDays}
                                      invalid={
                                        targetCalculatorForm.touched.zeroTargetHitTradeDays &&
                                          targetCalculatorForm.errors.zeroTargetHitTradeDays
                                          ? true
                                          : false
                                      }
                                    />
                                    {targetCalculatorForm.touched.zeroTargetHitTradeDays &&
                                      targetCalculatorForm.errors.zeroTargetHitTradeDays ? (
                                      <FormFeedback type="invalid">
                                        {targetCalculatorForm.errors.zeroTargetHitTradeDays}
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
                                <Button type="submit" className="btn-lg primary-button" style={{ fontSize: "1.1em", borderRadius: "4px", minWidth: "120px" }}>
                                  Calculate
                                </Button>{" "}
                                <Button type="reset" color="secondary" className="" style={{ fontSize: "1.1em", borderRadius: "4px", minWidth: "120px" }} onClick={handleResetClick}>
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
                        {targetCalculatorConfigs && targetCalculatorConfigs.length > 0 && <table className="table mb-0">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Config Name</th>
                              <th>Created On</th>
                            </tr>
                          </thead>
                          <tbody>
                            {targetCalculatorConfigs.map(function (config, index) {
                              return (
                                <tr onClick={() => loadSavedConfiguration(config)} className="row-hover">
                                  <th scope="row">{index + 1}</th>
                                  <td>{config.configName}</td>
                                  <td>{config.createdOn.toLocaleString()}</td>
                                  <Button className="btn-sm row-button" color="secondary">Click to load</Button>
                                </tr>)
                            })}
                          </tbody>
                        </table>}
                        {!targetCalculatorConfigs || targetCalculatorConfigs.length == 0 && <div className="text-center" style={{ minHeight: "200px", alignItems: "center", display: "flex", justifyContent: "center" }}>No saved configurations found</div>}
                      </div>
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </Card>
          </Col>
        </Row>
        <br />
        {loading && <div class="full-page-loading"></div>}
        <Row>

          <Col md={12} className="result-container" ref={resultContainerRef} >
            {!loading && activeTab === "1" && calculatedRiskRows && calculatedRiskRows.length > 0 && (
              <Card xl="2" style={{ margin: 0 }}>
                <div className="text-left extra-card-header">
                  <span>Calculated Profit</span>
                  <Button onClick={() => {
                    setConfigNameModal(true)
                  }} 
                  style={{ float: "right" }}> Save Configuration</Button>


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
                          <span>Change the <strong>Option Premium Price</strong>, to find the best Target Combination.
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
                      {selectedIndexCalculatedRisk.drawDownMetrics && <DayWiseCapitalDrawDown drawDownMetrics={selectedIndexCalculatedRisk.drawDownMetrics} title={`Average Target Capital Day Wise at <strong>&#8377; ${selectedIndexCalculatedRisk.optionPremium}</strong>  Option Premium`} calculatedMetadata={[
                        {
                          title: `Starting Trading Capital`,
                          count: `&#8377; ${targetCalculatorForm.values.tradingCapital} `,
                          color: "info",
                        },
                        {
                          title: `Capital after ${calculatedMetadata.numberOfTradingSessions} Trading Sessions`,
                          count: `&#8377; ${selectedIndexCalculatedRisk.finalTargetCapitalAfterTradingCharges}`,
                          color: "primary",
                        },
                        {
                          title: "Daily Max SL Capacity",
                          count: `&#8377; ${calculatedMetadata.maxSLCapacityDaily}`,
                          percentage: (calculatedMetadata.maxSLCapacityDaily / targetCalculatorForm.values.tradingCapital * 100).toFixed(2),
                          color: "danger",
                        },
                        {
                          title: "Max Daily Trade Amount",
                          count: `&#8377; ${calculatedMetadata.maxTradeAmountInOneDay}`,
                          color: "warning",
                        }

                      ]} />}
                    </Col>
                  </Row>
                  <Row>

                    <Col xl="12">
                      <Row>
                        <Col xl="3">
                          <Card className={`metrics-card ${selectedIndexCalculatedRisk.totalTradableLots > 0 ? 'metrics-card-raw-info' : 'metrics-card-danger'} calculated-risk-card`} xl="2">
                            <CardBody>
                              <p className="mb-4 card-info-header">Tradable Lots in 1 Trade</p>

                              <CardText className="metric-number">
                                {selectedIndexCalculatedRisk.totalTradableLots} <span className="sub-metric-number">{`Lot${selectedIndexCalculatedRisk.totalTradableLots > 1 ? 's' : ''}`}</span>
                              </CardText>
                              <p className="sub-max-sl-text text-black" style={{ fontSize: "1.1em" }}>Tradable Quantity: <strong>{selectedIndexCalculatedRisk.totalTradableQuantity}</strong></p>
                            </CardBody>
                          </Card>
                        </Col>
                        <Col xl="3">
                          <Card color="" className="metrics-card metrics-card-raw-info" xl="2">
                            <CardBody>
                              <p className="mb-3 card-info-header">Actual Trading Days</p>
                              <CardText className="metric-number">
                                {selectedIndexCalculatedRisk.normalTradingDays} <span className="sub-metric-number"> {`Day${selectedIndexCalculatedRisk.normalTradingDays > 1 ? 's' : ''}`}</span>
                              </CardText>
                              <p className="sub-max-sl-text text-black" style={{ fontSize: "1.1em" }}>Max Trades in 1 Day: <strong>{selectedIndexCalculatedRisk.totalTradesInOneDay}</strong></p>
                            </CardBody>
                          </Card>
                        </Col>
                        <Col xl="3">
                          <Card color="" className="metrics-card metrics-card-raw-info" xl="2">

                            <CardBody>
                              <p className="mb-4 card-info-header">Target in 1 Trade</p>
                              <CardText className="metric-number">

                                <i className="mdi mdi-target lg" style={{ fontSize: "32px", color: "#0bb197" }}></i> &nbsp;

                                &#8377; {selectedIndexCalculatedRisk.totalTargetofTrade}

                              </CardText>
                              <p className="sub-max-sl-text text-black" style={{ fontSize: "1.1em" }}>SL in 1 Trade: <strong>&#8377; {selectedIndexCalculatedRisk.totalSLofTrade}</strong></p>
                            </CardBody>
                          </Card>
                        </Col>
                        {/* <Col xl="3">
                        <Card color="" className="card metrics-card metrics-card-raw-info" xl="2">

                          <CardBody>
                          <p className="mb-4 card-info-header">Total Tradable Quantity</p>

                              <CardText className="metric-number">
                                  {selectedIndexCalculatedRisk.totalTradableQuantity} <span className="sub-metric-number">Qty</span>

                              </CardText>
                          </CardBody>
                          </Card>
                        </Col> */}
                        <Col xl="3">
                          <Card color="" className="card metrics-card metrics-card-raw-info" xl="2">

                            <CardBody>
                              <p className="mb-4 card-info-header">Single Trade Amount</p>

                              <CardText className="metric-number">
                                &#8377; {selectedIndexCalculatedRisk.singleTradeAmount}

                              </CardText>
                            </CardBody>
                          </Card>
                        </Col>
                        <Col xl="3">
                          <Card color="" className="metrics-card metrics-card-raw-info" xl="2">
                            <CardBody>
                              <p className="mb-4 card-info-header">Profit after all Trading Sessions</p>
                              <CardText className="metric-number">
                                &#8377; {selectedIndexCalculatedRisk.profitAfterAllTradingSessions}
                              </CardText>
                            </CardBody>
                          </Card>
                        </Col>
                        <Col xl="3">
                          <Card color="" className="metrics-card metrics-card-warning" xl="2">
                            <CardBody>
                              <p className="mb-4 card-info-header">Total Trading Charges</p>
                              <CardText className="metric-number">
                                &#8377; {selectedIndexCalculatedRisk.totalTradingCharges}
                              </CardText>
                            </CardBody>
                          </Card>
                        </Col>
                        <Col xl="3">
                          <Card color="" className="metrics-card metrics-card-raw-info" xl="2">
                            <CardBody>
                              <p className="mb-4 card-info-header">Target After Trading Charges</p>
                              <CardText className="metric-number">
                                &#8377; {selectedIndexCalculatedRisk.targetAfterTradingCharges}
                              </CardText>
                            </CardBody>
                          </Card>
                        </Col>
                        <Col xl="3">
                          {/* //TODO: change the color of the card based on the Target. Blue if target > tradingCapital, yellow if (target > 50% of tradingCapital && target < tradingCapital) and red if target < 50% of tradingCapital */}
                          <Card color="" className="card metrics-card metrics-card-primary" xl="2" style={{ color: "white" }}>
                            <CardBody>
                              <p className="mb-4 card-info-header">Final Capital after Trading Charges</p>
                              <CardText className="metric-number white" >
                                &#8377; {selectedIndexCalculatedRisk.finalTargetCapitalAfterTradingCharges}
                              </CardText>
                            </CardBody>
                          </Card>
                        </Col>


                        {/* <Col xl="3">
                          <Card color="" className="card calculated-risk-card" xl="2">
                            <h6 className="card-header">SL of 1 Trade</h6>
                            <CardBody>
                              <CardText>
                                <i className="mdi mdi-trending-down" style={{ fontSize: "32px", color: "red" }}></i> &nbsp;
                                <h4 style={{ marginTop: "-37px", marginRight: "0px", textAlign: "center" }}>
                                  &#8377; {selectedIndexCalculatedRisk.totalSLofTrade}</h4>

                              </CardText>
                            </CardBody>
                          </Card>
                        </Col> */}

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
                        </Col>
                        <Col xl="3">
                          <Card color="" className="card calculated-risk-card" xl="2">
                            <h6 className="card-header">SL in Option Premium</h6>

                            <CardBody>

                              <CardText>
                                &#8377; {selectedIndexCalculatedRisk.SLAmountInOptionPremium}

                              </CardText>
                            </CardBody>
                          </Card>


                        </Col>
                        <Col xl="3">
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
                          </Col>
                        <Col xl="3">
                          <Card color="" className="card calculated-risk-card" xl="2">
                            <h6 className="card-header">Option Premium Target Exit Price</h6>

                            <CardBody>

                              <CardText>
                                &#8377; {selectedIndexCalculatedRisk.optionPremiumTargetPrice}

                              </CardText>
                            </CardBody>
                          </Card>
                        </Col>
                        <Col xl="3">
                          <Card color="" className="card calculated-risk-card" xl="2">
                            <h6 className="card-header">Option Premium Exit Price</h6>

                            <CardBody>

                              <CardText>
                                &#8377; {selectedIndexCalculatedRisk.optionPremiumExitPrice}

                              </CardText>
                            </CardBody>
                          </Card>
                        </Col> */}



                        {/* <Col xl="3">
                          <Card color="" className="card metrics-card metrics-card-raw-info" xl="2">
                            <CardBody>
                            <p className="mb-4 card-info-header">Total Trades in One Day</p>
                              <CardText className="metric-number">
                                {selectedIndexCalculatedRisk.totalTradesInOneDay}
                              </CardText>
                            </CardBody>
                          </Card>
                        </Col> */}
                        {targetCalculatorForm.values.zeroSLHitTradeDays > 0 && <Col xl="3">
                          <Card color="" className="card metrics-card metrics-card-success" xl="2">

                            <CardBody>
                              <p className="mb-4 card-info-header">Profit in Successful Days</p>

                              <CardText className="metric-number">
                                &#8377; {selectedIndexCalculatedRisk.profitInSuccessfulDays}

                              </CardText>
                            </CardBody>
                          </Card>
                        </Col>}
                        {targetCalculatorForm.values.zeroTargetHitTradeDays > 0 && <Col xl="3">
                          <Card color="" className="card metrics-card metrics-card-danger" xl="2">

                            <CardBody>
                              <p className="mb-4 card-info-header">Loss in Failure Days</p>

                              <CardText className="metric-number">
                                &#8377; {selectedIndexCalculatedRisk.lossInUnsuccessfulDays}

                              </CardText>
                            </CardBody>
                          </Card>
                        </Col>}




                        {/* <Col xl="3">
                          <Card color="" className="metrics-card metrics-card-raw-info" xl="2">

                            <CardBody>
                            <p className="mb-2 card-info-header">
                              <h6 style={{ marginBottom: 0, color:"#4747A1" }}>
                                Final Capital after Trading Sessions
                              </h6>
                              <span style={{ fontWeight: "normal", fontSize: "0.8em" }}>(If Max SL count hit everyday)</span>
                            </p>
                              <CardText className="metric-number">
                                &#8377; {selectedIndexCalculatedRisk.finalCapitalAfterTradingChargesIfMaxSLHit}
                              </CardText>
                            </CardBody>
                          </Card>
                        </Col> */}


                        {/* <Col xl="3">
                                          <Card color="" className="card calculated-risk-card" xl="2">
                                            <h6 className="card-header">Max Trading Amount in One Day</h6>
                                            <CardBody>
                                              <CardText>
                                               {selectedIndexCalculatedRisk.maxTradeAmountInOneDay}
                                              </CardText>
                                            </CardBody>
                                            </Card>
                                          </Col> */}

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
      <PremiumModal 
        isOpen={purchasePremiumModal} 
        toggle={() => setPurchasePremiumModal(false)} 
      />
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
          <Input value={configName} placeholder="Configuration Name" onChange={e =>
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
    // <React.Fragment>
    //   <div className="page-content">
    //     <Container fluid={true}>
    //       <Breadcrumbs title="F&O Calculator" breadcrumbItem="Target Calculator" />
    //        <h4 style={{textAlign:"center", paddingTop:"100px"}}>Coming soon...</h4>
    //     </Container>
    //   </div>
    // </React.Fragment>
  );
};

const mapStateToProps = state => {
  return { ...state.login };
};

export default connect(mapStateToProps, {})(TargetCalculator);