import {UserPortfolio} from "./UserPortfolio.ts";
import {UUID} from "../UUID.ts";
import {SimulationReport} from "./SimulationReport.ts";

export interface SimulationRunResponse {
    simulationId: UUID;
    userPortfolios: UserPortfolio[];
    simulationReports: SimulationReport[];
    saveSuccessful: boolean
}