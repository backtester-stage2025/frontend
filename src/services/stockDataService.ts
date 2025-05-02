import axios, {AxiosError} from "axios";
import {StockQuote} from "../model/StockQuote";
import {SimulationRequest} from "../model/request/SimulationRequest.ts";
import {formatDateToLocalDateString} from "./formatService.ts";
import {UserPortfolio} from "../model/simulation/UserPortfolio.ts";
import {StockDetails} from "../model/StockDetails.ts";

export async function getStockDetails(): Promise<StockDetails[]> {
    return safeApiCall(async () => {
        const { data } = await axios.get(`/api/stock/details`);
        return data;
    });
}

export async function getStockQuotes(stockName: string): Promise<StockQuote[]> {
    return safeApiCall(async () => {
        const { data } = await axios.get<StockQuote[]>(`/api/stock/data`, {
            params: { stockName }
        });
        return data;
    });
}

export async function simulateBuyAndSellRisk(request: SimulationRequest): Promise<UserPortfolio[]> {
    const payload = {
        ...request,
        startDate: formatDateToLocalDateString(request.startDate),
        endDate: formatDateToLocalDateString(request.endDate)
    };

    return safeApiCall(async () => {
        const { data } = await axios.post(`/api/backtest/run-simulation`, payload);
        return data;
    });
}

// Handles errors, reduced boilerplate
async function safeApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
    try {
        return await apiCall();
    } catch (error) {
        const axiosError = error as AxiosError<string>;
        const message = axiosError.response?.data ?? "An unknown error occurred.";
        throw new Error(message);
    }
}