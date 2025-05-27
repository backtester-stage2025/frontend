import {UserPortfolio} from "./UserPortfolio.ts";
import {SimulationRequest} from "../request/SimulationRequest.ts";
import {UUID} from "../UUID.ts";

export interface SimulationResult {
    simulationDate: Date;
    stockSimulationRequest: SimulationRequest;
    userPortfolios: UserPortfolio[];
    id: UUID;
}