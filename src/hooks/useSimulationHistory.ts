import {useMutation, useQuery} from "@tanstack/react-query";
import {
    deleteSimulation,
    getSimulationById,
    getSimulationHistory,
    shareSimulation
} from "../services/SimulationHistoryService.ts";
import {UUID} from "../model/UUID.ts";

export function useSimulationHistory() {
    const {isLoading, isError, data: simulationHistory, refetch} = useQuery({
        queryKey: ['simulationHistory'],
        queryFn: () => getSimulationHistory()
    });
    return {
        isLoading,
        isError,
        simulationHistory,
        refetch
    }
}

export function useGetSimulationById(id: UUID | null) {
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

export function useGetSimulationsByIds(ids: UUID[] | null) {
    const enabled = Array.isArray(ids) && ids.length > 0;

    const {isLoading, isError, data: simulations} = useQuery({
        queryKey: ['simulations', ids],
        queryFn: async () => {
            if (!ids) return [];
            return Promise.all(ids.map(id => getSimulationById(id as string)));
        },
        enabled
    });

    return {
        isLoading,
        isError,
        simulations
    };
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

export function useDeleteSimulation() {
    const {mutate: sendRequest, isPending: isRunning, isError, error} = useMutation({
        mutationFn: (simulationId: string) => deleteSimulation(simulationId)
    });

    return {
        sendRequest,
        isRunning,
        isError,
        error
    }
}
