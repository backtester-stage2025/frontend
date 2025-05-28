import {StockDetails} from "../model/StockDetails.ts";
import {SimulationSummary} from "../model/simulation/SimulationSummary.ts";
import {SimulationTypes} from "../model/request/SimulationTypes.ts";
import {IndicatorType} from "../model/request/IndicatorType.ts";
import {Weekday} from "../model/Weekday.ts";

export function formatDateToLocalDateString(date: Date): string {
    return date.toISOString().split('T')[0];
}

export function formatPercent(value: number) {
    return `${value.toFixed(2)}%`;
}

export function formatCurrency(value: number, currency: string = 'EUR'): string {
    return new Intl.NumberFormat('de-DE', {style: 'currency', currency: currency}).format(value);
}

export function formatLargeNumber(value: number): string {
    const absValue = Math.abs(value);

    let formatted: string;
    if (absValue >= 1_000_000_000) {
        formatted = `${(absValue / 1_000_000_000).toFixed(1)}B`;
    } else if (absValue >= 1_000_000) {
        formatted = `${(absValue / 1_000_000).toFixed(1)}M`;
    } else if (absValue >= 1_000) {
        formatted = `${(absValue / 1_000).toFixed(1)}K`;
    } else {
        formatted = absValue.toLocaleString();
    }

    return value < 0 ? `-${formatted}` : formatted;
}


export function getNiceStep(r: number) {
    if (r === 0) return 1;
    const exponent = Math.floor(Math.log10(Math.abs(r)));
    const fraction = r / Math.pow(10, exponent);
    let niceFraction;
    if (fraction <= 1) niceFraction = 1;
    else if (fraction <= 2) niceFraction = 2;
    else if (fraction <= 5) niceFraction = 5;
    else niceFraction = 10;
    return niceFraction * Math.pow(10, exponent);
}


export function calculateReturnPercentage(simulation: SimulationSummary) {
    const startCapital = simulation.stockSimulationRequest.startCapital;
    const endValue = simulation.latestPortfolioValue || 0;

    return ((endValue - startCapital) / startCapital * 100).toFixed(2);
}

export function getFieldNameStockDetails(sd: StockDetails) {
    return `${sd.companyName} (${sd.officialName})`
}

export function getSimulationTypeLabel(type: SimulationTypes) {
    switch (type) {
        case SimulationTypes.RISK_BASED:
            return "Risk Based";
        case SimulationTypes.BUY_AND_HOLD:
            return "Buy and Hold";
        default:
            return type;
    }
}

export function getIndicatorTypeLabel(type: IndicatorType) {
    switch (type) {
        case IndicatorType.MOVING_AVERAGE_CROSSOVER:
            return "Moving Average Crossover";
        case IndicatorType.BREAKOUT:
            return "Breakout";
        default:
            return type;
    }
}

export function getWeekdayLabel(weekday: Weekday) {
    return weekday.charAt(0) + weekday.slice(1).toLowerCase();
}
