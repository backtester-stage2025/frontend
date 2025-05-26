import {useMutation} from "@tanstack/react-query";
import {deleteCsv, uploadCsv} from "../services/userCsvService.ts";

type UploadCsvVariables = {
    file: File;
    exchange: string;
    ticker: string;
    companyName: string;
    currencyType: string;
    overwrite: boolean;
}

export function useUploadCsv() {
    const {mutate: sendRequest, isPending: isRunning, isError, error} = useMutation({
        mutationFn: ({file, exchange, ticker, companyName, currencyType, overwrite}: UploadCsvVariables) =>
            uploadCsv(file, exchange, ticker, companyName, currencyType, overwrite)
    });

    return {
        sendRequest,
        isRunning,
        isError,
        error
    };
}

export function useDeleteCsv() {
    const {mutate: sendRequest, isPending: isRunning, isError, error} = useMutation({
        mutationFn: (officialName: string) => deleteCsv(officialName)
    });

    return {
        sendRequest,
        isRunning,
        isError,
        error
    };
}