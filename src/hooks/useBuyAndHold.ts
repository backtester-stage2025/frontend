import {useMutation} from "@tanstack/react-query";
import {simulateBuyAndHold} from "../services/stockDataService.ts";
import {BuyAndHoldSimulationRequest} from "../model/BuyAndHoldSimulationRequest.ts";

export function useBuyAndHold() {
    const {mutate: sendRequest, isPending: isRunning, isError} = useMutation({
        mutationFn: (request: BuyAndHoldSimulationRequest) => simulateBuyAndHold(request)
    });
    return {
        sendRequest,
        isRunning,
        isError
    }
}