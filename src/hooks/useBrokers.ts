import {useQuery} from "@tanstack/react-query";
import {getBrokers} from "../services/brokerService.ts";

export function useBrokers() {
    const {isLoading, isError, data: brokers} = useQuery({
        queryKey: ['brokers'],
        queryFn: getBrokers
    });
    return {
        isLoading,
        isError,
        brokers
    }
}