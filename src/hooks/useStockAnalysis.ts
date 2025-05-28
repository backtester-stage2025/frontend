import {getMacd, getMovingAverage, getSignal} from "../services/stockAnalysisService.ts";
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

export function useMacd(officialStockName: string, startDate: string, endDate: string, shortPeriod: number, longPeriod: number) {
    const {isLoading, isError, data: macd, error} = useQuery({
        queryKey: ['macd', officialStockName, shortPeriod, longPeriod],
        queryFn: () => getMacd(officialStockName, startDate, endDate, shortPeriod, longPeriod),
        enabled: !!officialStockName && !!startDate && !!endDate && !!shortPeriod && !!longPeriod
    });
    return {
        isLoading,
        isError,
        macd,
        error
    }
}

export function useSignal(officialStockName: string, startDate: string, endDate: string, shortPeriod: number, longPeriod: number) {
    const {isLoading, isError, data: signal, error} = useQuery({
        queryKey: ['signal', officialStockName, shortPeriod, longPeriod],
        queryFn: () => getSignal(officialStockName, startDate, endDate, shortPeriod, longPeriod),
        enabled: !!officialStockName && !!startDate && !!endDate && !!shortPeriod && !!longPeriod
    });
    return {
        isLoading,
        isError,
        signal,
        error
    }
}

