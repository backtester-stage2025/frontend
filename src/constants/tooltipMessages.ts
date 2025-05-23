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
        },
        brokerTitle: "Broker",
        brokerInfo: "The broker you are using to buy and sell stocks. This decides the fee every time you buy or sell.",
        transactionBufferInfo: "This percentage defines the size that the trade has to be compared to your held stocks." +
            " This is useful when a lot of trades would be made for small orders, causing high transaction fees."
    },
    stockMetrics: {
        returnsInfo: "The average percentage daily and annual return of the stock over the simulation period.",
        riskInfo: "The average percentage daily and annual risk of the stock over the simulation period.",
        drawdownsInfo: "The average and maximum percentage drawdown of the stock over the simulation period." +
            " This is the difference between the peak and lowest price.",
        distributionInfo: "The skewness of the stock returns over the simulation period." +
            " A positive skewness indicates a higher probability of positive returns," +
            " while a negative skewness indicates a higher probability of negative returns."
    }
}