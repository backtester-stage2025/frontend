import {useQuery} from "@tanstack/react-query";
import {getSimulationHistory} from "../services/backtestService.ts";

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