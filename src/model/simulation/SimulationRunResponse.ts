import {UserPortfolio} from "./UserPortfolio.ts";
import {UUID} from "../UUID.ts";

export interface SimulationRunResponse {
    simulationId: UUID;
    userPortfolios: UserPortfolio[];
    saveSuccessful: boolean
    currencyType: string;
}