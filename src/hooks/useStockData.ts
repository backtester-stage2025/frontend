import {useQuery} from "@tanstack/react-query";
import {getStockData} from "../services/stockDataService.ts";

export function useStockData() {
    const {isLoading, isError, data: stockData} = useQuery({
        queryKey: ['stockData'],
        queryFn: getStockData
    });
    return {
        isLoading,
        isError,
        stockData
    }
}