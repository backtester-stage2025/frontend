import {safeApiCall} from "./safeApiCall.ts";
import axios from "axios";
import {SimulationSummary} from "../model/simulation/SimulationSummary.ts";
import {SimulationResult} from "../model/simulation/SimulationResult.ts";

export async function getSimulationHistory(): Promise<SimulationSummary[]> {
    return safeApiCall(async () => {
        const {data} = await axios.get<SimulationSummary[]>(`/api/simulation-history/all`);
        return data;
    });
}

export async function getSimulationById(id: string): Promise<SimulationResult> {
    return safeApiCall(async () => {
        const {data} = await axios.get<SimulationResult>(`/api/simulation-history/${id}`)
        return data;
    });
}

export function shareSimulation(simulationId: string) {
    return safeApiCall(async () => {
        const {data} = await axios.put(`api/simulation-history/${simulationId}/share`)
        return data;
    })
}

export async function deleteSimulation(simulationId: string) {
    return safeApiCall(async () => {
        await axios.delete(`/api/simulation-history/${simulationId}`);
    });
}
