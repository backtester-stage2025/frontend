import {SimulationRequest} from "../model/request/SimulationRequest.ts";
import {formatDateToLocalDateString} from "./formatService.ts";
import {safeApiCall} from "./safeApiCall.ts";
import axios from "axios";
import {SimulationRunResponse} from "../model/simulation/SimulationRunResponse.ts";

export async function runSimulation(request: SimulationRequest): Promise<SimulationRunResponse> {
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
