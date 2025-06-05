import {SimulationResult} from "../../model/simulation/SimulationResult.ts";

export function getProfitMarginPercentage(result: SimulationResult): number {
    const start = result.stockSimulationRequest.startCapital;
    const end = result.userPortfolios[result.userPortfolios.length - 1]?.totalPortfolioValue ?? start;
    return ((end - start) / start) * 100;
}

function getDayCount(result: SimulationResult) {
    const startDate = new Date(result.stockSimulationRequest.startDate);
    const endDate = new Date(result.stockSimulationRequest.endDate);

    const millis = endDate.getTime() - startDate.getTime();
    return millis / (1000 * 3600 * 24);
}

export function getAverageDailyGrowth(result: SimulationResult): number {
    const dayCount = getDayCount(result);
    const startCapital = result.stockSimulationRequest.startCapital;
    const endCapital = result.userPortfolios[result.userPortfolios.length - 1]?.totalPortfolioValue ?? startCapital;
    return ((endCapital / startCapital) ** (1 / dayCount) - 1) * 100;
}

export function getTransactionCount(result: SimulationResult): number {
    return result.userPortfolios.reduce((sum, p) => sum + p.sharesBought.filter(st => st.totalSharesBought != 0).length, 0);
}

export function getProfitMarginPercentageIgnoreFees(result: SimulationResult): number {
    const totalFee = result.userPortfolios.flatMap(p => p.sharesBought)
        .reduce((sum, tx) => sum + tx.transactionFee, 0);
    const start = result.stockSimulationRequest.startCapital;
    const end = result.userPortfolios[result.userPortfolios.length - 1]?.totalPortfolioValue ?? start;
    const totalProfits = end + totalFee - start;
    return totalProfits / start * 100;
}