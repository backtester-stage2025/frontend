import {useQuery} from "@tanstack/react-query";
import {getSimulationById, getSimulationHistory} from "../services/SimulationHistoryService.ts";

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

export function useGetSimulationById(id: string) {
    const {isLoading, isError, data: simulation} = useQuery({
        queryKey: ['simulation', id],
        queryFn: () => getSimulationById(id),
        enabled: !!id
    })

    return {
        isLoading,
        isError,
        simulation
    }
}