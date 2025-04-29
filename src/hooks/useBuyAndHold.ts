import {useMutation} from "@tanstack/react-query";
import {simulateBuyAndHold} from "../services/stockDataService.ts";
import {SimulationRequest} from "../model/request/SimulationRequest.ts";

export function useBuyAndHold() {
    const {mutate: sendRequest, isPending: isRunning, isError} = useMutation({
        mutationFn: (request: SimulationRequest) => simulateBuyAndHold(request)
    });
    return {
        sendRequest,
        isRunning,
        isError
    }
}