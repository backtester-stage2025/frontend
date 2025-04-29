import axios, {AxiosError} from "axios";
import {StockQuote} from "../model/StockQuote";
import {SimulationRequest} from "../model/request/SimulationRequest.ts";
import {formatDateToLocalDateString} from "./formatService.ts";
import {UserPortfolio} from "../model/simulation/UserPortfolio.ts";

export async function getStockData() {
    const {data: stockData} = await axios.get(`/api/stock/names`);
    return stockData;
}

export async function getStockQuotes(stockName: string): Promise<StockQuote[]> {
    const {data: stockQuotes} = await axios.get<StockQuote[]>(`/api/stock/data`, {
        params: {stockName}
    });
    return stockQuotes;
}

export async function simulateBuyAndSellRisk(request: SimulationRequest): Promise<UserPortfolio[]> {
    const payload = {
        ...request,
        startDate: formatDateToLocalDateString(request.startDate),
        endDate: formatDateToLocalDateString(request.endDate)
    };

    try {
        const { data: result } = await axios.post(`/api/backtest/buy-and-sell-risk`, payload);
        return result;
    } catch (error) {
        console.log(error);
        const axiosError = error as AxiosError<string>;
        console.log(axiosError);
        const message = axiosError.response?.data ?? "An unknown error occurred.";
        throw new Error(message);
    }
}