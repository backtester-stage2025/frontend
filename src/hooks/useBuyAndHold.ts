import {useMutation} from "@tanstack/react-query";
import {simulateBuyAndHold} from "../services/stockDataService.ts";
import {BuyAndHoldSimulationRequest} from "../model/BuyAndHoldSimulationRequest.ts";

export function useBuyAndHold(request: BuyAndHoldSimulationRequest) {
    const {mutate, isPending: isRunning, isError} = useMutation({
        mutationFn: () => simulateBuyAndHold(request)
    });
    return {
        mutate,
        isRunning,
        isError
    }
}