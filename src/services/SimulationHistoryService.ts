import {safeApiCall} from "./safeApiCall.ts";
import axios from "axios";
import {SimulationSummary} from "../model/simulation/SimulationSummary.ts";
import {SimulationResult} from "../model/simulation/SimulationResult.ts";

export async function getSimulationHistory(): Promise<SimulationSummary[]> {
    return safeApiCall(async () => {
        const {data} = await axios.get<SimulationSummary[]>(`/api/simulation-history/history`);
        return data;
    });
}

export async function getSimulationById(id: string): Promise<SimulationResult> {
    return safeApiCall(async () => {
        const {data} = await axios.get<SimulationResult>(`/api/simulation-history/${id}`)
        return data;
    });
}