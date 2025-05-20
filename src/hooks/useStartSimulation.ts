import {useMutation} from "@tanstack/react-query";
import {SimulationRequest} from "../model/request/SimulationRequest.ts";
import {simulateBuyAndSellRisk} from "../services/backtestService.ts";

export function useStartSimulation(userId: string | undefined) {
    const {mutate: sendRequest, isPending: isRunning, isError, error} = useMutation({
        mutationFn: (request: SimulationRequest) => simulateBuyAndSellRisk(request, userId ?? '')
    });

    return {
        sendRequest,
        isRunning,
        isError,
        error
    }
}