import {safeApiCall} from "./safeApiCall.ts";
import axios from "axios";
import {CsvUploadResponse} from "../model/CsvUploadResponse.ts";

export async function uploadCsv(file: File, exchange: string, ticker: string, companyName: string, currencyType: string, overwrite: boolean): Promise<CsvUploadResponse> {
    const payload = new FormData();
    payload.append("file", file);
    payload.append("exchange", exchange);
    payload.append("ticker", ticker);
    payload.append("companyName", companyName);
    payload.append("currencyType", currencyType);
    payload.append("overwrite", overwrite.toString());

    return safeApiCall(async () => {
        const {data} = await axios.post(`/api/user-csv/upload`, payload);
        return data;
    });
}

export async function deleteCsv(officialName: string): Promise<CsvUploadResponse> {
    return safeApiCall(async () => {
        const {data} = await axios.delete<CsvUploadResponse>(`/api/user-csv/delete/${officialName}`);
        return data;
    });
}
