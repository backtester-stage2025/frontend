import {StockMetrics} from "../StockMetrics.ts";

export interface SimulationReport {
    stockName: string,
    startDate: Date,
    endDate: Date,
    startCapital: number,
    endCapital: number,
    stockMetrics: StockMetrics
}