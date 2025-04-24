import {useQuery} from "@tanstack/react-query";
import {getStockData} from "../services/stockDataService.ts";

export function useStockData() {
    const query = {
        queryKey: ['stockData'],
        queryFn: getStockData
    }
    const {isLoading, isError, data: stockData} = useQuery(query);
    return {
        isLoading,
        isError,
        stockData
    }
}