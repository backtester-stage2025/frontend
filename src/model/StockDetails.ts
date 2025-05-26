export interface StockDetails {
    exchange: string;
    ticker: string;
    companyName: string;
    currencyType: CurrencyType;
    officialName: string;
    publiclyAvailable: boolean;
}

export enum CurrencyType {
    EUR = "EUR",
    USD = "USD"
}