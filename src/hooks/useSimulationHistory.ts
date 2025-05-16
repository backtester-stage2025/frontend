import {useQuery} from "@tanstack/react-query";
import {getSimulationHistory} from "../services/backtestService.ts";

export function useSimulationHistory(userId: string) {
    const {isLoading, isError, data: simulationHistory} = useQuery({
        queryKey: ['simulationHistory', userId],
        queryFn: () => getSimulationHistory(userId),
        enabled: !!userId
    });
    return {
        isLoading,
        isError,
        simulationHistory
    }
}