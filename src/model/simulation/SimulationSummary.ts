import {SimulationRequest} from "../request/SimulationRequest.ts";

export interface SimulationSummary {
    id: string;
    simulationDate: Date;
    stockSimulationRequest: SimulationRequest;
    latestPortfolioValue: number;
    totalPortfolioCount: number;
}