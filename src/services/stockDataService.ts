import axios from "axios";

export async function getStockData(){
    const {data: stockData} = await axios.get(`/api/stock/data`);
    console.log("Finished query");
    console.log(stockData);
    return stockData;
}

export async function getStockQuotes(stockName: string){
    const {data: stockQuotes} = await axios.get(`/api/stock/data`, {
        params: {stockName}
    });
    return stockQuotes;
}