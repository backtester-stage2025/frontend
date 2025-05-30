export interface SimulationReport {
    stockName: string,
    averageDailyReturn: number,
    averageAnnualReturn: number,
    dailyRisk: number,
    annualRisk: number,
    averageDrawdownPercentage: number,
    maxDrawdownPercentage: number,
    skewness: number
}