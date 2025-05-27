import {useMutation, useQuery} from "@tanstack/react-query";
import {getSimulationById, getSimulationHistory, shareSimulation} from "../services/SimulationHistoryService.ts";

export function useSimulationHistory() {
    const {isLoading, isError, data: simulationHistory} = useQuery({
        queryKey: ['simulationHistory'],
        queryFn: () => getSimulationHistory()
    });
    return {
        isLoading,
        isError,
        simulationHistory
    }
}

export function useGetSimulationById(id: string | null) {
    const {isLoading, isError, data: simulation, refetch} = useQuery({
        queryKey: ['simulation', id],
        queryFn: () => getSimulationById(id as string),
        enabled: !!id
    })

    return {
        isLoading,
        isError,
        simulation,
        refetch
    }
}

export function useShareSimulation() {
    const {mutate: sendRequest, isPending: isRunning, isError, error} = useMutation({
        mutationFn: (simulationId: string) => shareSimulation(simulationId)
    });

    return {
        sendRequest,
        isRunning,
        isError,
        error
    }
}