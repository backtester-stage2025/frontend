import {useQuery} from "@tanstack/react-query";
import {getStockQuotes} from "../services/stockDataService";

export function useStockQuotes(stockName: string) {
    const query = {
        queryKey: ['stockQuotes', stockName],
        queryFn: () => getStockQuotes(stockName),
        enabled: !!stockName
    }
    const {isLoading, isError, data: stockQuotes} = useQuery(query);
    return {
        isLoading,
        isError,
        stockQuotes
    }
}