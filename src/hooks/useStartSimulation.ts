import {useMutation} from "@tanstack/react-query";
import {SimulationRequest} from "../model/request/SimulationRequest.ts";
import {runSimulation} from "../services/backtestService.ts";

export function useStartSimulation() {
    const {mutate: sendRequest, isPending: isRunning, isError, error} = useMutation({
        mutationFn: (request: SimulationRequest) => runSimulation(request)
    });

    return {
        sendRequest,
        isRunning,
        isError,
        error
    }
}