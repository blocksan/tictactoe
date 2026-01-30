
export const PRICING_PLANS = ["Free", "Monthly", "Yearly"];
export const PricingData = [
        {
            title: "Free",
            caption: "Precision planning for every trader",
            icon: "bx bx-rocket",
            price: "0",
            pricingPlan: PRICING_PLANS[0],
            actualPrice: 0,
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
            actualPrice: 99,
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
            actualPrice: 599,
            pricingPlan: PRICING_PLANS[2],
            isChild: [
                { id: "1", features: "All Professional Features" },
                { id: "2", features: "50% Annual Cost Savings" },
                { id: "3", features: "Advanced Support Access" },
                { id: "4", features: "Priority Feature Access" },
            ],
        },  
    ];


export const TOAST_DELAY = 3000;

const defaultHolidays = [
    "2026-01-26", "2026-03-07", "2026-03-25", "2026-04-10", 
    "2026-04-14", "2026-05-01", "2026-08-15", "2026-10-02", 
    "2026-10-20", "2026-11-08", "2026-12-25"
];

const envHolidays = process.env.REACT_APP_MARKET_HOLIDAYS 
    ? process.env.REACT_APP_MARKET_HOLIDAYS.split(',').map(d => d.trim()) 
    : [];

export const TRADING_HOLIDAYS = envHolidays.length > 0 ? envHolidays : defaultHolidays;