import {useMutation} from "@tanstack/react-query";
import {uploadCsv} from "../services/userCsvService.ts";

export function useUploadCsv() {
    const {mutate: sendRequest, isPending: isRunning, isError, error} = useMutation({
        mutationFn: (file: File) => uploadCsv(file)
    });

    return {
        sendRequest,
        isRunning,
        isError,
        error
    }
}