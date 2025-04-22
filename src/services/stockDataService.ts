import axios from "axios";
import {StockQuote} from "../model/StockQuote";

export async function getStockData(){
    const {data: stockData} = await axios.get(`/api/stock/names`);
    return stockData;
}

export async function getStockQuotes(stockName: string): Promise<StockQuote[]>{
    const {data: stockQuotes} = await axios.get<StockQuote[]>(`/api/stock/data`, {
        params: {stockName}
    });
    return stockQuotes;
}