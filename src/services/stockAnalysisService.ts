import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export async function getMovingAverage(
    stockName: string,
    startDate: string,
    endDate: string,
    period: number
) {
    const {data: movingAverage} = await axios.get<Map<Date, number[]>>(`${BASE_URL}/api/stock-analysis/moving-averages`, {
        params: {
            stockName: stockName,
            startDate: startDate,
            endDate: endDate,
            period: period
        }
    });
    return movingAverage;
}
