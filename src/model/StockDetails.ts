export interface StockDetails {
    exchange: string;
    ticker: string;
    companyName: string;
    currencyType: CurrencyType;
    officialName: string;
}

export enum CurrencyType {
    EUROS = "EUROS",
    USD = "USD"
}