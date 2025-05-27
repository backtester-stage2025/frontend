const simulationTypeInfo = "This type defines the main strategy of the simulation.<br/><br/>\n" +
    "<b>Buy and hold</b>: Buy as many stocks as you can and hold them until your indicators tell you to sell.<br/></br>" +
    "<b>Risk-based</b>: Instead of investing everything, buy and sell dynamically to keep value deviations below a set threshold.</br></br>" +
    "<b>Static</b>: To minimize transaction costs, don't buy and sell dynamically. Calculate the risk when buying and hold the stocks until it's time to sell.";

export const TOOLTIP_MESSAGES = {
    movingAverageControls: {
        shortMATitle: "Short Moving Average Period",
        shortMAInfo: "The average price of the stock for every day, calculated going back the selected number of days.",
        longMATitle: "Long Moving Average Period",
        longMAInfo: "The average price of the stock for every day, calculated going back the selected number of days.",
    },
    simulation: {
        simulationTypeTitle: "Simulation Type",
        simulationTypeInfo: simulationTypeInfo,
        riskToleranceTitle: "Risk Tolerance",
        riskToleranceInfo: "The risk tolerance is used to calculate the maximum number of shares to buy for a stock," +
            " ensuring the investment aligns with your acceptable risk level based on the stock's volatility.",
        indicator: {
            title: "Indicator Type",
            description: "Deciding factor in when to continue current strategy or sell all stocks.",
            link: "/infopages?section=indicator-types",
            breakoutDays: "The number of days used for calculating the breakout zones." +
                " When the zones are broken through, the simulation will sell all stocks.",
            maShortDays: "The number of days used for calculating the short moving average.",
            maLongDays: "The number of days used for calculating the long moving average."
        },
        brokerTitle: "Broker",
        brokerInfo: "The broker you are using to buy and sell stocks. This decides the fee every time you buy or sell.",
        transactionBufferInfo: "This percentage defines the size that the trade has to be compared to your held stocks." +
            " This is useful when a lot of trades would be made for small orders, causing high transaction fees." +
            " [0% for no buffer]"
    },
    stockMetrics: {
        returnsTitle: "Returns",
        returnsInfo: "The average percentage daily and annual return of the stock over the simulation period.",
        returnsLink: "/infopages?section=returns",
        riskTitle: "Risk",
        riskInfo: "The average percentage daily and annual risk of the stock over the simulation period.",
        riskLink: "/infopages?section=risk",
        drawdownsTitle: "Drawdown",
        drawdownsInfo: "The average and maximum percentage drawdown of the stock over the simulation period." +
            " This is the difference between the peak and lowest price.",
        drawdownsLink: "/infopages?section=drawdown",
        distributionTitle: "Skewness",
        distributionInfo: "The skewness of the stock returns over the simulation period." +
            " A positive skewness indicates a higher probability of positive returns," +
            " while a negative skewness indicates a higher probability of negative returns.",
        distributionLink: "/infopages?section=skewness"
    }
}