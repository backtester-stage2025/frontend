import {useStockData} from "./useStockData.ts";
import {CurrencyType} from "../model/CurrencyType.ts";

export function useCurrencyForStock(stockName: string) {
    const {stockData} = useStockData();
    const stock = stockData?.find(s => s.officialName === stockName);
    return stock?.currencyType ?? CurrencyType.USD;
}