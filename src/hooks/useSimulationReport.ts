import {useQuery} from "@tanstack/react-query";
import {getSimulationReport} from "../services/stockDataService";
import {StockReportRequest} from "../model/request/StockReportRequest.ts";

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