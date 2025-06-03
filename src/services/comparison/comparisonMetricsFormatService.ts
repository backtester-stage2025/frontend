import {IndicatorDetails, SimulationRequest} from "../../model/request/SimulationRequest.ts";
import {IndicatorType} from "../../model/request/IndicatorType.ts";
import {SimulationTypes} from "../../model/request/SimulationTypes.ts";
import {SimulationResult} from "../../model/simulation/SimulationResult.ts";
import {formatCurrency} from "../formatService.ts";
import {countDaysSimulated} from "./dayCountService.ts";

export function extractRequestDetails(result: SimulationResult): Record<string, string> {
    const {
        startDate, endDate, brokerName, stockNames, startCapital, indicators,
        tradingWeekdays
    } = result.stockSimulationRequest;

    return {
        "Strategy": positionAdjustment(result.stockSimulationRequest),
        "Indicators used": indicatorDescriptions(indicators),
        "Stocks Used": stockNames.join("\n"),
        "Start Capital": formatCurrency(startCapital, result.currencyType),
        "Trading Week Days": tradingWeekdays.join("\n"),
        "Broker Name": brokerName,
        "Start Date": startDate.toString(),
        "End Date": endDate.toString()
    }
}

export function extractResults(result: SimulationResult): Record<string, string> {
    const {startCapital} = result.stockSimulationRequest;
    const portfolios = result.userPortfolios;
    const finalValue = portfolios[portfolios.length - 1]?.totalPortfolioValue || 0;
    const profitMargin = ((finalValue - startCapital) / startCapital) * 100;

    const avgGrowth = portfolios.length > 1
        ? ((finalValue / startCapital) ** (1 / (portfolios.length - 1)) - 1) * 100
        : 0;

    let transactionCount = 0;
    let totalFees = 0;
    portfolios.forEach(p => {
        transactionCount += p.sharesBought.filter(tr => tr.totalSharesBought != 0).length;
        totalFees += p.sharesBought.reduce((sum, tx) => sum + tx.transactionFee, 0);
    });

    const days = countDaysSimulated(result);

    return {
        "Simulation Length": `${days} days`,
        "Final Portfolio Value": formatCurrency(finalValue, result.currencyType),
        "Profit Margin": `${profitMargin.toFixed(2)}%`,
        "Avg Daily Growth": `${avgGrowth.toFixed(2)}%`,
        "Total Transactions": transactionCount.toString(),
        "Total Transaction Fees": formatCurrency(totalFees, result.currencyType)
    };
}

function indicatorDescription(details: IndicatorDetails) {
    switch (details.indicator) {
        case IndicatorType.MOVING_AVERAGE_CROSSOVER:
            return `Moving average crossover\n(${details.movingAverageShortDays} and ${details.movingAverageLongDays} days)`;
        case IndicatorType.BREAKOUT:
            return `Breakout rule\n(${details.breakoutDays} days)`;
        case  IndicatorType.MACD:
            return `MACD\n(${details.macdShortDays} and ${details.macdLongDays} days)`;
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
        case  SimulationTypes.STATIC:
            return `Static (${request.riskTolerance}% risk)`;
    }
}