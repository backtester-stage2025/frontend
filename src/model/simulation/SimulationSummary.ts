import {SimulationRequest} from "../request/SimulationRequest.ts";

export interface SimulationSummary {
    simulationId: string;
    simulationDate: Date;
    stockSimulationRequest: SimulationRequest;
    latestPortfolioValue: number;
    totalPortfolioCount: number;
}