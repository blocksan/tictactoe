import React from "react";
import {Row, Col} from 'reactstrap';

const CustomOptionPremiumStackedBar = (props) => {
    // console.log(props.chartData,'--props.chartData-')
    let SLAmountInOptionPremium = props.chartData && props.chartData.SLAmountInOptionPremium;
    let TargetAmountInOptionPremium = props.chartData && props.chartData.TargetAmountInOptionPremium;
    let EntryAmountInOptionPremium = props.chartData && props.chartData.EntryAmountInOptionPremium;
    let optionPremiumTargetPrice = props.chartData && props.chartData.optionPremiumTargetPrice;
    let optionPremiumExitPrice = props.chartData && props.chartData.optionPremiumExitPrice;

    const MAX_BAR_HEIGHT = 180;
    let premium_target_percentage = Math.round((EntryAmountInOptionPremium/optionPremiumTargetPrice)*100);
    let sl_premium_percentage = Math.round((optionPremiumExitPrice/EntryAmountInOptionPremium)*100);
    let target_premium_percentage = Math.round((optionPremiumTargetPrice/EntryAmountInOptionPremium)*100);
    let premium_body_height = Math.round(MAX_BAR_HEIGHT*premium_target_percentage/100);
    let premium_target_height = Math.round(premium_body_height*target_premium_percentage/100);
    let premium_sl_height = Math.round(premium_body_height*sl_premium_percentage/100);

    // console.log(premium_sl_height,'--premium_sl_height--')
    // console.log(premium_body_height,'--premium_body_height-')
    // console.log(premium_target_height,'--premium_target_height-')

    return (
        <div className="stacked-option-premium-container">
            {premium_body_height> 0 && <><div className="option-premium-candle-container">
                <div className="candle-left-align" style={{marginBottom:premium_sl_height}}>
                    <span className="span-label">SL</span>
                    <span className="span-number">{optionPremiumExitPrice}</span>
                </div>
                <div className="candle-right-align" style={{marginBottom:premium_body_height}}>
                    <span className="span-label">E</span>
                    <span className="span-number">{EntryAmountInOptionPremium}</span>
                </div>
                <div className="candle-top-align" style={{marginBottom:premium_target_height}}>
                    <span className="span-label">T</span>
                    <span className="span-number">{optionPremiumTargetPrice}</span>
                </div>
                <div className="candle-center-align option-premium-body" style={{height:premium_body_height}}>

                </div>
                <div className="candle-center-align option-premium-sl" style={{height:premium_body_height-premium_sl_height, marginBottom:premium_sl_height}}>

                </div>
                <div className="candle-center-align option-premium-target" style={{height:premium_target_height-premium_body_height, marginBottom:premium_target_height-(premium_target_height-premium_body_height)}}>

                </div>
            </div>
            <Row className="option-premium-label-container mt-2">
                <Col xs={12} md={6} className="col-xl-12 col-lg-4 premium-label"><div className="premium-square premium" ></div>&nbsp;Premium Price: &nbsp;<strong>{EntryAmountInOptionPremium}</strong></Col>
                <Col xs={12} md={6} className="col-xl-12 col-lg-4 premium-label"><div className="premium-square sl"></div>&nbsp;SL Points: &nbsp;<strong>{SLAmountInOptionPremium}</strong> </Col>
                <Col xs={12} md={6} className="col-xl-12 col-lg-4 premium-label"><div className="premium-square target"></div>&nbsp;Target Points: &nbsp;<strong>{TargetAmountInOptionPremium}</strong></Col>
            </Row>
            </>
            }
            {!premium_body_height && <div className="no-data-container text-center p-4" >
                    Not enough data to display
                </div>}
        </div>
        
    );
}

export default CustomOptionPremiumStackedBar;