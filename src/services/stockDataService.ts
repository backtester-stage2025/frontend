import axios from "axios";
import {StockQuote} from "../model/StockQuote";
import {StockDetails} from "../model/StockDetails.ts";
import {safeApiCall} from "./safeApiCall.ts";

export async function getStockDetails(): Promise<StockDetails[]> {
    return safeApiCall(async () => {
        const {data} = await axios.get(`/api/stock/details`);
        return data;
    });
}

export async function getStockQuotes(stockName: string): Promise<StockQuote[]> {
    return safeApiCall(async () => {
        const {data} = await axios.get<StockQuote[]>(`/api/stock/data`, {
            params: {stockName}
        });
        return data;
    });
}

