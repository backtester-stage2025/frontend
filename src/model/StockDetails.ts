import {CurrencyType} from "./CurrencyType.ts";

export interface StockDetails {
    exchange: string;
    ticker: string;
    companyName: string;
    currencyType: CurrencyType;
    officialName: string;
    publiclyAvailable: boolean;
}