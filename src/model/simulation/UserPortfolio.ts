export interface UserPortfolio {
    date: string;
    cashBalance: number;
    totalPortfolioValue: number;
    shareHoldings: Record<string, number>;
    sharesBought: Record<string, number>;
}