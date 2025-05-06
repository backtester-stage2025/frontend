import {getMovingAverage} from "../services/stockAnalysisService.ts";
import {useQuery} from "@tanstack/react-query";

export function useMovingAverage(officialStockName: string, startDate: string, endDate: string, period: number) {
    const {isLoading, isError, data: movingAverage, error} = useQuery({
        queryKey: ['movingAverage', officialStockName, period],
        queryFn: () => getMovingAverage(officialStockName, startDate, endDate, period),
        enabled: !!officialStockName && !!startDate && !!endDate && !!period
    });
    return {
        isLoading,
        isError,
        movingAverage,
        error
    }
}
