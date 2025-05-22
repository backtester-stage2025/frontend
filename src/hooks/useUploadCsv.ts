import {useMutation} from "@tanstack/react-query";
import {uploadCsv} from "../services/userCsvService.ts";

type UploadCsvVariables = {
    file: File;
    exchange: string;
    ticker: string;
    companyName: string;
    currencyType: string;
}

export function useUploadCsv() {
    const {mutate: sendRequest, isPending: isRunning, isError, error} = useMutation({
        mutationFn: ({file, exchange, ticker, companyName, currencyType}: UploadCsvVariables) =>
            uploadCsv(file, exchange, ticker, companyName, currencyType)
    });

    return {
        sendRequest,
        isRunning,
        isError,
        error
    };
}