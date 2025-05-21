import {safeApiCall} from "./safeApiCall.ts";
import axios from "axios";
import {CsvUploadResponse} from "../model/CsvUploadResponse.ts";

export async function uploadCsv(file: File): Promise<CsvUploadResponse> {
    const payload = new FormData();
    payload.append("file", file);

    return safeApiCall(async () => {
        const {data} = await axios.post(`/api/user-csv/upload`, payload);
        return data;
    });
}
