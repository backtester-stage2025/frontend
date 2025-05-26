import {IndicatorDetails, SimulationRequest} from "../model/request/SimulationRequest.ts";
import {IndicatorType} from "../model/request/IndicatorType.ts";
import {SimulationTypes} from "../model/request/SimulationTypes.ts";
import {SimulationResult} from "../model/simulation/SimulationResult.ts";

export function extractMetrics(result: SimulationResult): Record<string, string> {
    const {startDate, endDate, brokerName, stockNames, startCapital} = result.stockSimulationRequest;
    const portfolios = result.userPortfolios;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((+end - +start) / (1000 * 60 * 60 * 24));
    const finalValue = portfolios[portfolios.length - 1]?.totalPortfolioValue || 0;
    const profitMargin = ((finalValue - startCapital) / startCapital) * 100;
    const indicators = result.stockSimulationRequest.indicators;

    const avgGrowth = portfolios.length > 1
        ? ((finalValue / startCapital) ** (1 / (portfolios.length - 1)) - 1) * 100
        : 0;

    let transactionCount = 0;
    let totalFees = 0;
    portfolios.forEach(p => {
        transactionCount += p.sharesBought.length;
        totalFees += p.sharesBought.reduce((sum, tx) => sum + tx.transactionFee, 0);
    });

    return {
        "Broker Name": brokerName,
        "Simulation Length": `${days} days`,
        "Stocks Used": stockNames.join("\n"),
        "Indicators used": indicatorDescriptions(indicators),
        "Position Adjustment": positionAdjustment(result.stockSimulationRequest),
        "Start Capital": `$${startCapital.toFixed(2)}`,
        "Final Portfolio Value": `$${finalValue.toFixed(2)}`,
        "Profit Margin": `${profitMargin.toFixed(2)}%`,
        "Avg Daily Growth": `${avgGrowth.toFixed(2)}%`,
        "Total Transactions": transactionCount.toString(),
        "Total Transaction Fees": `$${totalFees.toFixed(2)}`
    };
}

function indicatorDescription(details: IndicatorDetails) {
    switch (details.indicator) {
        case IndicatorType.MOVING_AVERAGE_CROSSOVER:
            return `Moving average crossover\n( ${details.movingAverageShortDays} and ${details.movingAverageLongDays} days)`;
        case IndicatorType.BREAKOUT:
            return `Breakout rule\n(${details.breakoutDays} days)`;
    }
}

function indicatorDescriptions(indicators: IndicatorDetails[]) {
    if (indicators.length === 0) {
        return "None";
    }
    return indicators.map(indicatorDescription).join("\n");
}

function positionAdjustment(request: SimulationRequest) {
    switch (request.simulationType) {
        case SimulationTypes.BUY_AND_HOLD:
            return "Buy and Hold";
        case  SimulationTypes.RISK_BASED:
            return `Risk based (${request.riskTolerance}% risk)`;
    }
}