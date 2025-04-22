import axios from "axios";

export async function getStockData(){
    const {data: stockData} = await axios.get(`/api/stock/names`);
    return stockData;
}