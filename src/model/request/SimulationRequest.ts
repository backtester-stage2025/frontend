import {SimulationTypes} from "./SimulationTypes.ts";
import {IndicatorType} from "./IndicatorType.ts";
import {Weekday} from "../Weekday.ts";

export interface SimulationRequest {
    brokerName: string;
    stockNames: string[];
    startDate: Date;
    endDate: Date;
    startCapital: number;
    simulationType: SimulationTypes
    indicators: IndicatorDetails[];
    riskTolerance?: number;
    tradingWeekdays: Weekday[];
    transactionBufferPercentage: number;
}

export interface IndicatorDetails {
    indicator: IndicatorType;
    movingAverageShortDays?: number;
    movingAverageLongDays?: number;
    breakoutDays?: number;
    macdShortDays?: number;
    macdLongDays?: number;
}