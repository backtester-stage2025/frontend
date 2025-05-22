import {useQuery} from "@tanstack/react-query";
import {getStockDetails} from "../services/stockDataService.ts";

export function useStockData() {
    const {isLoading, isError, data: stockData, error, refetch} = useQuery({
        queryKey: ['stockData'],
        queryFn: getStockDetails
    });
    return {
        isLoading,
        isError,
        stockData,
        error,
        refetch
    }
}