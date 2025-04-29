import {useMutation} from "@tanstack/react-query";
import {simulateBuyAndSellRisk} from "../services/stockDataService.ts";
import {SimulationRequest} from "../model/request/SimulationRequest.ts";

export function useBuyAndSellRisk() {
    const { mutate: sendRequest, isPending: isRunning, isError, error } = useMutation({
        mutationFn: (request: SimulationRequest) => simulateBuyAndSellRisk(request)
    });

    return {
        sendRequest,
        isRunning,
        isError,
        error
    }
}