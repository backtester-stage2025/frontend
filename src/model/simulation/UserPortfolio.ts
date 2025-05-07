import {ShareHolding} from "./ShareHolding.ts";
import {ShareTransaction} from "./ShareTranscation.ts";

export interface UserPortfolio {
    date: string;
    cashBalance: number;
    totalPortfolioValue: number;
    shareHoldings: ShareHolding[];
    sharesBought: ShareTransaction [];
}