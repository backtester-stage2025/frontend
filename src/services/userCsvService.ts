import {safeApiCall} from "./safeApiCall.ts";
import axios from "axios";
import {CsvUploadResponse} from "../model/CsvUploadResponse.ts";

export async function uploadCsv(file: File, exchange: string, ticker: string, companyName: string, currencyType: string): Promise<CsvUploadResponse> {
    const payload = new FormData();
    payload.append("file", file);
    payload.append("exchange", exchange);
    payload.append("ticker", ticker);
    payload.append("companyName", companyName);
    payload.append("currencyType", currencyType);

    return safeApiCall(async () => {
        const {data} = await axios.post(`/api/user-csv/upload`, payload);
        return data;
    });
}
