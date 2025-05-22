export const TOOLTIP_MESSAGES = {
    movingAverageControls: {
        shortMATitle: "Short Moving Average Period",
        shortMAInfo: "The average price of the stock for every day, calculated going back the selected number of days.",
        longMATitle: "Long Moving Average Period",
        longMAInfo: "The average price of the stock for every day, calculated going back the selected number of days.",
    },
    simulation: {
        simulationTypeTitle: "Simulation Type",
        simulationTypeInfo: "This type defines the main strategy of the simulation.",
        riskToleranceTitle: "Risk Tolerance",
        riskToleranceInfo: "The percentage of your capital that you are willing to risk on a single trade.",
        indicator: {
            title: "Indicator Type",
            description: "Deciding factor in when to continue current strategy or sell all stocks.",
            breakoutDays: "The number of days used for calculating the breakout zones." +
                " When the zones are broken through, the simulation will sell all stocks.",
            maShortDays: "The number of days used for calculating the short moving average.",
            maLongDays: "The number of days used for calculating the long moving average."
        }
    }
}