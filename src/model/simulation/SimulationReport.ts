import {StockMetrics} from "../StockMetrics.ts";

export interface SimulationReport {
    startDate: Date,
    endDate: Date,
    startCapital: number,
    endCapital: number,
    stockMetrics: StockMetrics
}