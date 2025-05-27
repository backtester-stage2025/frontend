import {UserPortfolio} from "./UserPortfolio.ts";

export interface SimulationRunResponse {
    userPortfolios: UserPortfolio[];
    saveSuccessful: boolean
    currencyType: string;
}