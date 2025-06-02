import {UserPortfolio} from "./UserPortfolio.ts";
import {SimulationRequest} from "../request/SimulationRequest.ts";
import {UUID} from "../UUID.ts";
import {SimulationReport} from "./SimulationReport.ts";
import {CurrencyType} from "../CurrencyType.ts";

export interface SimulationResult {
    simulationDate: Date;
    stockSimulationRequest: SimulationRequest;
    userPortfolios: UserPortfolio[];
    simulationReports: SimulationReport[];
    id: UUID;
    currencyType: CurrencyType;
}