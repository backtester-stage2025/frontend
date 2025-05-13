import {SimulationTypes} from "./SimulationTypes.ts";
import {IndicatorType} from "./IndicatorType.ts";

export interface SimulationRequest {
    brokerName: string;
    stockName: string;
    startDate: Date;
    endDate: Date;
    startCapital: number;
    simulationType: SimulationTypes
    indicators: IndicatorDetails[];
    riskTolerance?: number;
}

export interface IndicatorDetails {
    indicator: IndicatorType;
    movingAverageShortDays?: number;
    movingAverageLongDays?: number;
    breakoutDays?: number;
}

export interface Indicator extends IndicatorDetails {
    id: string;
}