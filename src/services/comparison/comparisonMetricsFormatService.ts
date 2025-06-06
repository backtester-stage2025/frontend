import {IndicatorDetails, SimulationRequest} from "../../model/request/SimulationRequest.ts";
import {IndicatorType} from "../../model/request/IndicatorType.ts";
import {SimulationTypes} from "../../model/request/SimulationTypes.ts";
import {SimulationResult} from "../../model/simulation/SimulationResult.ts";
import {formatCurrency} from "../formatService.ts";
import {countDaysSimulated} from "./dayCountService.ts";
import {getAverageDailyGrowth} from "../calculations/SimulationResultCalculations.ts";
import {Weekday, weekdayOptions} from "../../model/Weekday.ts";

export const DISPLAY_NONE = "/";

function showConditional(shouldShow: boolean, value: string) {
    if (!shouldShow) {
        return DISPLAY_NONE;
    }
    return value;
}

export function extractRequestDetails(result: SimulationResult): Record<string, string> {
    const {
        startDate,
        endDate,
        brokerName,
        stockNames,
        startCapital,
        indicators,
        tradingWeekdays,
        transactionBufferPercentage,
        riskTolerance
    } = result.stockSimulationRequest;

    const type = result.stockSimulationRequest.simulationType;
    const transactionBuffer = showConditional(type === SimulationTypes.RISK_BASED,
        transactionBufferPercentage.toFixed(1));
    const risk = showConditional(type === SimulationTypes.RISK_BASED || type === SimulationTypes.STATIC,
        riskTolerance?.toFixed(1) ?? '0');

    const weekdayOrder = Object.values(Weekday);
    const sortedWeekdayNames = [...tradingWeekdays]
        .sort((a, b) => weekdayOrder.indexOf(a) - weekdayOrder.indexOf(b))
        .map(day => weekdayOptions.find(
            (option) => option.value === day)?.label);

    return {
        "Strategy": positionAdjustment(result.stockSimulationRequest),
        "Indicators used": indicatorDescriptions(indicators),
        "Stocks Used": stockNames.join("\n"),
        "Start Capital": formatCurrency(startCapital, result.currencyType),
        "Trading Week Days": sortedWeekdayNames.join("\n"),
        "Transaction Buffer Percentage": transactionBuffer,
        "Risk Tolerance": risk,
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
    const avgGrowth = getAverageDailyGrowth(result);

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
        "Avg Daily Growth": `${avgGrowth.toFixed(3)}%`,
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