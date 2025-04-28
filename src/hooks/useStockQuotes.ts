import {useQuery} from "@tanstack/react-query";
import {getStockQuotes} from "../services/stockDataService";

export function useStockQuotes(stockName: string) {
    const {isLoading, isError, data: stockQuotes} = useQuery({
        queryKey: ['stockQuotes', stockName],
        queryFn: () => getStockQuotes(stockName),
        enabled: !!stockName
    });
    return {
        isLoading,
        isError,
        stockQuotes
    }
}