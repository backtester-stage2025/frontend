import axios, {AxiosError} from "axios";
import {StockQuote} from "../model/StockQuote";
import {SimulationRequest} from "../model/request/SimulationRequest.ts";
import {formatDateToLocalDateString} from "./formatService.ts";
import {UserPortfolio} from "../model/simulation/UserPortfolio.ts";
import {StockReportRequest} from "../model/request/StockReportRequest.ts";
import {SimulationReport} from "../model/simulation/SimulationReport.ts";

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
        const {data: result} = await axios.post(`/api/backtest/run-simulation`, payload);
        return result;
    } catch (error) {
        console.log(error);
        const axiosError = error as AxiosError<string>;
        console.log(axiosError);
        const message = axiosError.response?.data ?? "An unknown error occurred.";
        throw new Error(message);
    }
}

export async function getSimulationReport(request: StockReportRequest): Promise<SimulationReport> {
    const payload = {
        ...request,
        startDate: formatDateToLocalDateString(request.startDate),
        endDate: formatDateToLocalDateString(request.endDate)
    }
    const {data: simulationReport} = await axios.post<SimulationReport>(`api/backtest/report`, payload);

    return simulationReport;
}
