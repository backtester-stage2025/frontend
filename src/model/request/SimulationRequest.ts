import {SimulationTypes} from "./SimulationTypes.ts";

export interface SimulationRequest {
    broker: string;
    stockName: string;
    startDate: Date;
    endDate: Date;
    startCapital: number;
    simulationType: SimulationTypes
    useMovingAverageCrossover?: boolean;
    movingAverageShortDays?: number;
    movingAverageLongDays?: number;
    riskTolerance?: number;
}