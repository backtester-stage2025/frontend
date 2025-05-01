import axios from "axios";

export async function getMovingAverage(
    stockName: string,
    startDate: string,
    endDate: string,
    period: number
) {
    const {data: movingAverage} = await axios.get<Map<Date, number[]>>(`/api/stock-analysis/moving-averages`, {
        params: {
            stockName: stockName + ".csv",
            startDate: startDate,
            endDate: endDate,
            period: period
        }
    });
    return movingAverage;
}
