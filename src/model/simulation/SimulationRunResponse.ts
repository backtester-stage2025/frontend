import {UserPortfolio} from "./UserPortfolio.ts";

export interface SimulationRunResponse {
    simulationId: string;
    userPortfolios: UserPortfolio[];
    saveSuccessful: boolean
}