import {SimulationResult} from "../../model/simulation/SimulationResult.ts";
import {countDaysBetween} from "./dayCountService.ts";

export function getSingleMetricChartOptions(label: string, values: number[], colors: string[], formatter: (x: number) => string) {
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);

    const chartMin = minVal < 0 ? minVal * 1.5 : 0;
    const chartMax = maxVal > 0 ? maxVal * 1.5 : minVal * -0.1;

    return {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: label
        },
        axisY: {
            title: label,
            minimum: chartMin,
            maximum: chartMax
        },
        axisX: {
            title: "",
            margin: 15
        },
        toolTip: {
            shared: false
        },
        data: [
            {
                type: "column",
                dataPoints: values.map((value, index) => ({
                    label: `Simulation ${index + 1}`,
                    y: value,
                    color: colors[index % colors.length],
                    toolTipContent: `Simulation ${index + 1}: ${formatter(value)}`
                }))
            }
        ]
    };
}

export function getMetricsForBarCharts(results: SimulationResult[]) {
    return [
        {
            label: "Simulation Length (days)",
            values: results.map(r => countDaysBetween(
                r.stockSimulationRequest.startDate,
                r.stockSimulationRequest.endDate
            )),
            formatter: (x: number) => x.toFixed() + " days"
        },
        {
            label: "Total Profit Margins (%)",
            values: results.map(getProfitMarginPercentage),
            formatter: (x: number) => x.toFixed(1) + "%"
        },
        {
            label: "Profit margins without fees (%)",
            values: results.map(getProfitMarginPercentageIgnoreFees),
            formatter: (x: number) => x.toFixed(1) + "%"
        },
        {
            label: "Avg Daily Growth (%)",
            values: results.map(getAverageDailyGrowth),
            formatter: (x: number) => x.toFixed(3) + "%"
        },
        {
            label: "Total Transactions",
            values: results.map(getTransactionCount),
            formatter: (x: number) => x.toFixed() + " transactions"
        }
    ];
}

function getProfitMarginPercentage(result: SimulationResult): number {
    const start = result.stockSimulationRequest.startCapital;
    const end = result.userPortfolios[result.userPortfolios.length - 1]?.totalPortfolioValue ?? start;
    return ((end - start) / start) * 100;
}

function getAverageDailyGrowth(result: SimulationResult): number {
    const days = (new Date(result.stockSimulationRequest.endDate).getTime() - new Date(result.stockSimulationRequest.startDate).getTime()) / (1000 * 3600 * 24);
    const start = result.stockSimulationRequest.startCapital;
    const end = result.userPortfolios[result.userPortfolios.length - 1]?.totalPortfolioValue ?? start;
    return ((end / start) ** (1 / days) - 1) * 100;
}

function getTransactionCount(result: SimulationResult): number {
    return result.userPortfolios.reduce((sum, p) => sum + p.sharesBought.filter(st => st.totalSharesBought != 0).length, 0);
}

function getProfitMarginPercentageIgnoreFees(result: SimulationResult): number {
    const totalFee = result.userPortfolios.flatMap(p => p.sharesBought)
        .reduce((sum, tx) => sum + tx.transactionFee, 0);
    const start = result.stockSimulationRequest.startCapital;
    const end = result.userPortfolios[result.userPortfolios.length - 1]?.totalPortfolioValue ?? start;
    const totalProfits = end + totalFee - start;
    return totalProfits / start * 100;
}