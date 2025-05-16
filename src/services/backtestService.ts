import {SimulationRequest} from "../model/request/SimulationRequest.ts";
import {UserPortfolio} from "../model/simulation/UserPortfolio.ts";
import {formatDateToLocalDateString} from "./formatService.ts";
import {safeApiCall} from "./safeApiCall.ts";
import axios from "axios";
import {StockReportRequest} from "../model/request/StockReportRequest.ts";
import {SimulationReport} from "../model/simulation/SimulationReport.ts";

export async function simulateBuyAndSellRisk(request: SimulationRequest): Promise<UserPortfolio[]> {
    const payload = {
        ...request,
        startDate: formatDateToLocalDateString(request.startDate),
        endDate: formatDateToLocalDateString(request.endDate)
    };

    return safeApiCall(async () => {
        const {data} = await axios.post(`/api/backtest/run-simulation`, payload);
        return data;
    });
}

export async function getSimulationReport(request: StockReportRequest): Promise<SimulationReport[]> {
    const payload = {
        ...request,
        startDate: formatDateToLocalDateString(request.startDate),
        endDate: formatDateToLocalDateString(request.endDate)
    }

    return safeApiCall(async () => {
        const {data} = await axios.post(`api/backtest/report`, payload);
        return data;
    });
}