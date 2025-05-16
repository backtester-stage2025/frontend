import {UserPortfolio} from "./UserPortfolio.ts";
import {SimulationRequest} from "../request/SimulationRequest.ts";

export interface SimulationResult {
    simulationDate: Date;
    stockSimulationRequest: SimulationRequest;
    userPortfolios: UserPortfolio[];
}