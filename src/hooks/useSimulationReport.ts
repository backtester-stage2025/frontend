import {useQuery} from "@tanstack/react-query";
import {StockReportRequest} from "../model/request/StockReportRequest.ts";
import {getSimulationReport} from "../services/backtestService.ts";

export function useSimulationReport(request: StockReportRequest | null) {
    const {isLoading, isError, data: simulationReport} = useQuery({
        queryKey: ['simulationReport'],
        queryFn: () => getSimulationReport(request as StockReportRequest),
        enabled: !!request
    });
    return {
        isLoading,
        isError,
        simulationReport
    }
}