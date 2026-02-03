const SidebarData = [
    // {
    //     label: "Menu",
    //     isMainMenu: true,
    // },
    // {
    //     label: "Dashboard",
    //     icon: "mdi mdi-home-variant-outline",
    //     url: "/dashboard",
    //     isHasArrow: true,
    //     // issubMenubadge: true,
    //     // bgcolor: "bg-primary",
    //     // badgeValue: "3"
    // },
    // {
    //     label: "Calendar",
    //     icon: "mdi mdi-calendar-outline",
    //     isHasArrow: true,
    //     url: "/#",
    // },
    // {
    //     label: "Backtest Algos",
    //     icon: "mdi mdi-email-outline",
    //     subItem: [
    //         { sublabel: "Hammer Patter", link: "/#" },
    //         { sublabel: "Shooting Star", link: "/#" },
    //     ],
    // },
    {
        label: "F&O Calculator",
        isMainMenu: true,
        
    },
    {
        label: "Drawdown Calculator",
        icon: "mdi mdi-calculator-variant",
        url: "/drawdown-calculator",
        isHasArrow: true,
    },
    {
        label: "RiskReward Calculator",
        icon: "mdi mdi-target",
        url: "/riskreward-calculator",
        isHasArrow: true,
    },
    {
        label: "Plans",
        isMainMenu: true,
    },
    {
        label: "Pricing",
        url: "/pricing",
        isHasArrow: true,
        icon:"bx bx-rupee"
    },
    // {
    //     label: "Capital Calculator",
    //     url: "/capitalcalculator",
    //     isHasArrow: true,
    //     icon:"bx bx-rupee"
    // },
    // {
    //     label: "Settings",
    //     isMainMenu: true,
    // }
    ,
    // {
    //     label: "Referral Link",
    //     icon: "mdi mdi-link-variant",
    //     url: "/referrallink",
    //     isHasArrow: true,
    // },
    // {
    //     label: "Backtest Algos",
    //     isMainMenu: true,
    // },
    // {
    //     label: "Price Action",
    //     icon: "mdi mdi-email-outline",
    //     subItem: [
    //         { sublabel: "Hammer", link: "/#" },
    //         { sublabel: "Shooting Star", link: "/#" },
    //     ],
    // },
    // {
    //     label: "Technical Indicators",
    //     icon: "mdi mdi-email-outline",
    //     subItem: [
    //         { sublabel: "RSI", link: "/#" },
    //         { sublabel: "MACD", link: "/#" },
    //     ],
    // },
    // {
    //     label: "Chart Patterns",
    //     icon: "ri-bar-chart-line",
    //     subItem:[
    //         { sublabel: "Head and Shoulders", link: "/#" },
    //         { sublabel: "Double Bottom", link: "/#" }
    //     ]
    // },

    // {
    //     label: "Authentication",
    //     icon: "mdi mdi-account-circle-outline",
    //     subItem: [
    //         { sublabel: "Login", link: "/#" },
    //         { sublabel: "Register", link: "/#" },
    //         { sublabel: "Recover Password", link: "/#" },
    //         { sublabel: "Lock Screen", link: "/#" },
    //     ],
    // },
    {
        label: "Important Links",
        icon: "mdi mdi-format-page-break",
        subItem: [
            { sublabel: "Terms & Conditions", link: "/termsandconditions" },
            { sublabel: "FAQ", link: "/faq" },
            { sublabel: "Privacy & Policy", link: "/privacypolicy" },
        ],
    },
    // {
    //     label: "Components",
    //     isMainMenu: true,
    // },
    // {
    //     label: "UI Elements",
    //     icon: "mdi mdi-briefcase-variant-outline",
    //     subItem: [
    //         { sublabel: "Alerts", link: "/#" },
    //         { sublabel: "Badge", link: "/#" },
    //         { sublabel: "Breadcrumb", link: "/#" },
    //         { sublabel: "Buttons", link: "/#" },
    //         { sublabel: "Cards", link: "/#" },
    //         { sublabel: "Carousel", link: "/#" },
    //         { sublabel: "Dropdowns", link: "/#" },
    //         { sublabel: "Grid", link: "/#" },
    //         { sublabel: "Images", link: "/#" },
    //         { sublabel: "Lightbox", link: "/#" },
    //         { sublabel: "Modals", link: "/#" },
    //         { sublabel: "Offcanvas", link: "/#" },
    //         { sublabel: "Range Slider", link: "/#" },
    //         { sublabel: "Session Timeout", link: "/#" },
    //         { sublabel: "Pagination", link: "/#" },
    //         { sublabel: "Progress Bars", link: "/#" },
    //         { sublabel: "Placeholders", link: "/#" },
    //         { sublabel: "Tabs & Accordions", link: "/#" },
    //         { sublabel: "Typography", link: "/#" },
    //         { sublabel: "Toasts", link: "/#" },
    //         { sublabel: "Video", link: "/#" },
    //         { sublabel: "Popovers & Tooltips", link: "/#" },
    //         { sublabel: "Rating", link: "/#" },
    //     ],
    // },
    // {
    //     label: "Forms",
    //     icon: "ri-eraser-fill",
    //     issubMenubadge: true,
    //     bgcolor: "bg-danger",
    //     badgeValue: "8",
    //     subItem: [
    //         { sublabel: "Form Elements", link: "/#" },
    //         { sublabel: "Form Validation", link: "/#" },
    //         { sublabel: "Form Advanced Plugins", link: "/#" },
    //         { sublabel: "Form Editor", link: "/#" },
    //         { sublabel: "Form File Upload", link: "/#" },
    //         { sublabel: "Form X-editable", link: "/#" },
    //         { sublabel: "Form Wizard", link: "/#" },
    //         { sublabel: "Form Mask", link: "/#" },
    //     ],
    // },
    // {
    //     label: "Tables",
    //     icon: "ri-table-2",
    //     subItem: [
    //         { sublabel: "Basic Tables", link: "/#" },
    //         { sublabel: "Data Tables", link: "/#" },
    //         { sublabel: "Responsive Table", link: "/#" },
    //         { sublabel: "Editable Table", link: "/#" },
    //     ],
    // },
    // {
    //     label: "Charts",
    //     icon: "ri-bar-chart-line",
    //     subItem: [
    //         { sublabel: "Apex Charts", link: "/#" },
    //         { sublabel: "Chartjs Charts", link: "/#" },
    //         { sublabel: "Re Charts", link: "/#" },
    //         { sublabel: "Knob Charts", link: "/#" },
    //         { sublabel: "Sparkline Charts", link: "/#" },
    //     ],
    // },
    // {
    //     label: "Icons",
    //     icon: "ri-brush-line",
    //     subItem: [
    //         { sublabel: "Box Icons", link: "/#" },
    //         { sublabel: "Material Design", link: "/#" },
    //         { sublabel: "Dripicons", link: "/#" },
    //         { sublabel: "Font Awesome", link: "/#" },
    //     ],
    // },
    // {
    //     label: "Maps",
    //     icon: "ri-map-pin-line",
    //     subItem: [
    //         { sublabel: "Google Maps", link: "/#" },
    //         { sublabel: "Vector Maps", link: "/#" },
    //     ],
    // },
    // {
    //     label: "Multi Level",
    //     icon: "ri-share-line",
    //     subItem: [
    //         { sublabel: "Level 1.1", link: "/#" },
    //         {
    //             sublabel: "Level 1.2", link: "/#",
    //             subMenu: [
    //                 { title: "Level 2.1" },
    //                 { title: "Level 2.2" },
    //             ],
    //         },
    //     ],
    // },
]
export default SidebarData;