import {getMovingAverage} from "../services/stockAnalysisService.ts";
import {useQuery} from "@tanstack/react-query";

export function useMovingAverage(csvFileName: string, startDate: string, endDate: string, period: number) {
    const {isLoading, isError, data: movingAverage} = useQuery({
        queryKey: ['movingAverage', csvFileName, period],
        queryFn: () => getMovingAverage(csvFileName, startDate, endDate, period),
        enabled: !!csvFileName && !!startDate && !!endDate && !!period
    });
    return {
        isLoading,
        isError,
        movingAverage
    }
}
