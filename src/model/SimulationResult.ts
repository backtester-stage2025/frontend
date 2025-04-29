import {StockMetrics} from "./StockMetrics.ts";

export interface SimulationResult {
    startDate: string;
    endDate: string;
    startCapital: number;
    endCapital: number;
    stockMetrics: StockMetrics;
}