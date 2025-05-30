import {SimulationResult} from "../../model/simulation/SimulationResult.ts";


export function getSingleMetricChartOptions(label: string, values: number[], colors: string[], formatter: (x: number) => string): SimulationResult {
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);

    const chartMin = minVal < 0 ? minVal * 1.5 : 0;
    const chartMax = maxVal > 0 ? maxVal * 1.5 : minVal * -1;

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
            label: "Total Profit Margin (%)",
            values: results.map(getProfitMargin),
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
        },
        {
            label: "Total Fees",
            values: results.map(getTotalFees),
            formatter: (x: number) => "$" + x.toFixed(2)
        }
    ];
}

function countDaysBetween(start: Date, end: Date) {
    return Math.floor((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 3600 * 24));
}

function getProfitMargin(result: SimulationResult): number {
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

function getTotalFees(result: SimulationResult): number {
    return result.userPortfolios.flatMap(p => p.sharesBought).reduce((sum, tx) => sum + tx.transactionFee, 0);
}