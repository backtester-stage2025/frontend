import {SimulationTypes} from "./SimulationTypes.ts";
import {Indicator} from "./Indicator.ts";

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
    indicator: Indicator;
    movingAverageShortDays?: number;
    movingAverageLongDays?: number;
    breakoutDays?: number;
}