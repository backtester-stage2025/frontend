export interface StockDetails {
    exchange: string;
    ticker: string;
    companyName: string;
    currencyType: CurrencyType;
    officialName: string;
}

export enum CurrencyType {
    EUR = "EUR",
    USD = "USD"
}