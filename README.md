# Trrader.in - F&O Risk & Target Management Tool

**Trrader.in** is a specialized trading workstation designed for F&O (Futures & Options) traders to rigorously manage risk, size positions correctly, and visualize portfolio growth. Unlike generic charting platforms, Trrader focuses on the mathematical backbone of profitable trading: **Capital Preservation and Risk Management**.

## 🎯 What This Application Does

This application solves the biggest problem for traders: **Random Position Sizing and Poor Risk Management**. 

It provides a suite of calculators and visualizers that allow traders to:
-   **Calculate Exact Risk**: Determine precisely how many lots to trade based on capital, stop-loss per trade, and daily drawdown limits.
-   **Project Capital Growth**: Visualize how your capital grows over 10, 20, or 60 trading sessions based on your win rate and risk-reward ratio.
-   **Manage Drawdowns**: Simulate "worst-case scenarios" to ensure you can survive a losing streak without blowing up your account.
-   **Save Configurations**: Store varying risk profiles (e.g., "High Risk Setup", "Conservative Setup") for quick access during live markets.

## 🚀 Key Features

### 1. 🛡️ Risk Calculator
The core tool for protecting your capital.
-   **Smart Position Sizing**: Input your `Trading Capital`, `Max Loss per Trade`, and `Max Daily Drawdown` to get the exact quantity (lots) to trade.
-   **Drawdown Visualizer**: A `DayWiseCapitalDrawDown` chart that shows how your capital withstands a series of losses.
-   **Index Support**: Native support for **NIFTY50**, **BANKNIFTY**, and **FINNIFTY** with automatic lot size calculations.
-   **Safety Brakes**: Set limits on `Max SL Count` per day (e.g., stop trading after 2 losses).

### 2. 🎯 Target Calculator
A tool to visualize the power of compounding and Discipline.
-   **Growth Projections**: Estimate potential capital appreciation based on Average Target Ratio (e.g., 1:2, 1:3).
-   **Scenario Analysis**: Adjust variables like `Win Rate` vs `Loss Rate` to see realistic outcomes over `N` trading days.
-   **Profit/Loss Metrics**: See calculated metrics for `Total Tradable Lots`, `Single Trade Amount`, and `Projected Final Capital`.

### 3. ⚙️ Smart Configuration
-   **Cloud Sync**: Save your calculator settings (Risk parameters, Capital allocation) to the cloud (Firebase).
-   **Freemium Model**: Tiered access for Basic vs Premium/Trial users.
-   **One-Click Load**: Instantly load saved configurations to switch strategies in seconds.

## 🛠 Tech Stack

-   **Frontend**: React 18, React Router 6
-   **Logic & State**: Redux, Formik (Complex Validation), Yup
-   **Visualizations**: ApexCharts (Column, stacked bar charts)
-   **Styling**: Bootstrap 5, SaaS (SCSS)
-   **Backend / Auth**: Firebase (Authentication & Firestore)

## 📂 Project Structure

```bash
src/
├── Pages/
│   ├── Calculator/         # Core Logic for Risk & Target Tools
│   │   ├── RiskCalculator.js
│   │   ├── TargetCalculator.js
│   │   └── DayWiseCapitalDrawDown.js  # Visualization Component
│   ├── Authentication/     # Login, Register, Profile
│   └── Dashboard/          # Overview Stats
├── components/             # Reusable UI (Breadcrumbs, Inputs)
├── store/                  # Redux State Management
└── helpers/                # Firebase & Backend Helpers
```

## 🚦 Getting Started

1.  **Clone & Install**:
    ```bash
    git clone <repository-url>
    cd trrader
    yarn install
    ```

2.  **Run Locally**:
    ```bash
    yarn start
    ```
    Open [http://localhost:3000](http://localhost:3000)

## 🤝 Contributing

We are actively expanding functionality! Upcoming modules include:
-   **Backtest Algos**: Testing Price Action patterns (Hammer, Shooting Star).
-   **Technical Indicators**: RSI & MACD integration.

---
*Built for traders who treat trading as a business.*