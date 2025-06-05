import {SimulationResult} from "../../model/simulation/SimulationResult.ts";
import {countDaysBetween} from "./dayCountService.ts";
import {
    getAverageDailyGrowth,
    getProfitMarginPercentage,
    getProfitMarginPercentageIgnoreFees,
    getTransactionCount
} from "../calculations/SimulationResultCalculations.ts";

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