import {StockMetrics} from "./StockMetrics.ts";

export interface BuyAndHoldSimulationResult {
    startDate: string;
    endDate: string;
    startCapital: number;
    endCapital: number;
    stockMetrics: StockMetrics;
}