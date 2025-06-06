const simulationTypeInfo = "This type defines the main strategy of the simulation.<br/><br/>\n" +
    "<b>Buy and hold</b>: Buy as many stocks as you can and hold them until your indicators tell you to sell.<br/></br>" +
    "<b>Risk-based (dynamic)</b>: Instead of investing everything, buy and sell dynamically to keep value deviations below a set threshold.</br></br>" +
    "<b>Risk-based (static)</b>: To minimize transaction costs, don't buy and sell dynamically. Calculate the risk when buying and hold the stocks until it's time to sell.";

export const TOOLTIP_MESSAGES = {
    movingAverageControls: {
        shortMA: {
            title: "Short Moving Average Period",
            info: "The average price of the stock for every day, calculated going back the selected number of days."
        },
        longMA: {
            title: "Long Moving Average Period",
            info: "The average price of the stock for every day, calculated going back the selected number of days."
        }
    },
    simulation: {
        simulationType: {
            title: "Position adjustment",
            info: simulationTypeInfo,
            link: "/infopages?section=position-adjustment"
        },
        riskTolerance: {
            title: "Risk Tolerance",
            info: "The risk tolerance is used to calculate the maximum number of shares to buy for a stock," +
                " ensuring the investment aligns with your acceptable risk level based on the stock's volatility.",
            link: "/infopages?section=risk-based"
        },
        indicator: {
            title: "Indicator Type",
            info: "Deciding factor in when to continue current strategy or sell all stocks.",
            link: "/infopages?section=indicator-types",
            breakoutDays: "The number of days used for calculating the breakout zones." +
                " When the zones are broken through, the simulation will sell all stocks.",
            maShortDays: "The number of days used for calculating the short moving average.",
            maLongDays: "The number of days used for calculating the long moving average.",
            macdShortDays: "The number of days used for calculating the first ema for the MACD.",
            macdLongDays: "The number of days used for calculating the second ema for the MACD."
        },
        broker: {
            title: "Broker",
            info: "The broker you are using to buy and sell stocks. This decides the fee every time you buy or sell."
        },
        transactionBuffer: {
            info: "This percentage defines the size that the trade has to be compared to your held stocks." +
                " This is useful when a lot of trades would be made for small orders, causing high transaction fees." +
                " [0% for no buffer]"
        }
    },
    stockMetrics: {
        returns: {
            title: "Returns",
            info: "The average percentage daily and annual return of the stock over the simulation period.",
            link: "/infopages?section=returns"
        },
        risk: {
            title: "Risk",
            info: "The average percentage daily and annual risk of the stock over the simulation period.",
            link: "/infopages?section=risk"
        },
        drawdown: {
            title: "Drawdown",
            info: "The average and maximum percentage drawdown of the stock over the simulation period." +
                " This is the difference between the peak and lowest price.",
            link: "/infopages?section=drawdown"
        },
        distribution: {
            title: "Skewness",
            info: "The skewness of the stock returns over the simulation period." +
                " A positive skewness indicates a higher probability of positive returns," +
                " while a negative skewness indicates a higher probability of negative returns.",
            link: "/infopages?section=skewness"
        }
    },
    csvUpload: {
        exchange: {
            title: "Stock Exchange",
            info: "The stock exchange where the stock is listed. This is used to find the correct ticker symbol." +
                " (e.g. NASDAQ, NYSE)"
        },
        ticker: {
            title: "Stock Ticker Symbol",
            info: "The stock ticker symbol, which is a unique identifier for the stock on the exchange." +
                " (e.g. AAPL)"
        },
        companyName: {
            title: "Company Name",
            info: "The name of the company associated with the stock ticker." +
                " (e.g. Apple Inc.)"
        }
    }
}