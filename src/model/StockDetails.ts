export interface StockDetails {
    exchange: string;
    ticker: string;
    companyName: string;
    currencyType: CurrencyType;
    officialName: string;
}

interface CurrencyType{
    sign: string;
    abbreviation: string;
}