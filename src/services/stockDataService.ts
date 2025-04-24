import axios from "axios";
import {StockQuote} from "../model/StockQuote";
import {BuyAndHoldSimulationRequest} from "../model/BuyAndHoldSimulationRequest.ts";

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

export async function simulateBuyAndHold(request: BuyAndHoldSimulationRequest) {
    const {data: result} = await axios.post(`/api/backtest/report`, request);
    return result;
}