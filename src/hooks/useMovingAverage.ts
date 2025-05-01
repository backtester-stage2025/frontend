import {getMovingAverage} from "../services/stockAnalysisService.ts";
import {useQuery} from "@tanstack/react-query";

export function useMovingAverage(stockName: string, startDate: string, endDate: string, period: number) {
    const {isLoading, isError, data: movingAverage} = useQuery({
        queryKey: ['movingAverage', stockName, period],
        queryFn: () => getMovingAverage(stockName, startDate, endDate, period),
        enabled: !!stockName && !!startDate && !!endDate && !!period
    });
    return {
        isLoading,
        isError,
        movingAverage
    }
}
