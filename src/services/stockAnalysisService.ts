import axios from "axios";

export async function getMovingAverage(
    stockName: string,
    startDate: string,
    endDate: string,
    period: number
) {
    const {data: movingAverage} = await axios.get<Map<Date, number[]>>(`/api/stock-analysis/moving-averages`, {
        params: {
            stockName: stockName,
            startDate: startDate,
            endDate: endDate,
            period: period
        }
    });
    return movingAverage;
}

export async function getMacd(
    stockName: string,
    startDate: string,
    endDate: string,
    shortPeriod: number,
    longPeriod: number
) {
    const {data: macd} = await axios.get<Map<Date, number[]>>(`/api/stock-analysis/macd`, {
        params: {
            stockName: stockName,
            startDate: startDate,
            endDate: endDate,
            shortPeriod: shortPeriod,
            longPeriod: longPeriod
        }
    });
    return macd;
}

export async function getSignal(
    stockName: string,
    startDate: string,
    endDate: string,
    shortPeriod: number,
    longPeriod: number
) {
    const {data: signal} = await axios.get<Map<Date, number[]>>(`/api/stock-analysis/signal`, {
        params: {
            stockName: stockName,
            startDate: startDate,
            endDate: endDate,
            shortPeriod: shortPeriod,
            longPeriod: longPeriod
        }
    });
    return signal;
}
