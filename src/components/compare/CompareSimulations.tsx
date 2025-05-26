import {useLocation} from "react-router-dom";
import {Grid, Paper, Typography} from "@mui/material";
import CanvasJSReact from "@canvasjs/react-stockcharts";
import {SimulationResult} from "../../model/simulation/SimulationResult.ts";
import {UserPortfolio} from "../../model/simulation/UserPortfolio.ts";
import {MetricsComparison} from "./MetricsComparison.tsx";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;


const canvasColors = [
    "#1f77b4", // Blue – Simulation 1
    "#ff7f0e", // Orange – Simulation 2
    "#2ca02c", // Green – Simulation 3
    "#d62728", // Red – Simulation 4
    "#9467bd"  // Purple – Simulation 5
];

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
    return result.userPortfolios.reduce((sum, p) => sum + p.sharesBought.length, 0);
}

function getTotalFees(result: SimulationResult): number {
    return result.userPortfolios.flatMap(p => p.sharesBought).reduce((sum, tx) => sum + tx.transactionFee, 0);
}

function getSingleMetricChartOptions(label: string, values: number[]) {
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);

    return {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: label
        },
        axisY: {
            title: label,
            minimum: minVal < 0 ? minVal * 1.5 : 0,
            maximum: maxVal > 0 ? maxVal * 1.5 : minVal * -0.2
        },
        axisX: {
            title: "",
            valueFormatString: "",
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
                    color: canvasColors[index % canvasColors.length]
                }))
            }
        ]
    };
}

function getNormalizedComparisonChartOptions(results: Readonly<SimulationResult[]>) {
    const normalize = (portfolios: UserPortfolio[]) => {
        const startValue = portfolios[0]?.totalPortfolioValue || 1;
        return portfolios.map((portfolio, relativeDay) => ({
            x: relativeDay,
            y: (portfolio.totalPortfolioValue / startValue) * 100,
        }));
    };

    const normalizedPortfolios = results.map(r => normalize(r.userPortfolios));
    const maxSimulationLength = Math.max(...normalizedPortfolios.map(points => points.length));
    const xInterval = Math.ceil(maxSimulationLength / 10);

    return {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: "Normalized Total Portfolio Values"
        },
        axisY: {
            title: "Portfolio Value (Normalized)",
            suffix: "%",
            stripLines: [{
                value: 100,
                color: "#888",
                showOnTop: true,
                thickness: 2,
                dashType: "dash"
            }]
        },
        axisX: {
            title: "Simulation Day",
            interval: xInterval,
            labelFormatter: function (e: { value: number }) {
                return `Day ${e.value}`;
            }
        },
        toolTip: {
            shared: true,
            contentFormatter: function (e: {
                entries: {
                    dataPoint: { x: number | Date; y: number },
                    dataSeries: { name: string; color: string }
                }[]
            }) {
                const lines = e.entries.map(entry => {
                    return `<span style="color:${entry.dataSeries.color}">${entry.dataSeries.name}</span>: ${entry.dataPoint.y.toFixed(2)}%`;
                });
                return `Day ${e.entries[0].dataPoint.x}<br/>` + lines.join("<br/>");
            }
        },
        data: normalizedPortfolios.map((dataPoints, index) => ({
            type: "line",
            name: `Simulation ${index + 1}`,
            showInLegend: true,
            dataPoints: dataPoints,
            color: canvasColors[index % canvasColors.length]
        }))
    };
}

interface SimulationResults {
    results: SimulationResult[]
}

function NormalizedPortfolioValues({results}: Readonly<SimulationResults>) {
    const chartOptions = getNormalizedComparisonChartOptions(results);

    return (
        <Grid size={{xs: 12}}>
            <Paper elevation={3} sx={{padding: 2}}>
                <CanvasJSChart options={chartOptions}/>
            </Paper>
        </Grid>
    )
}

function ComparisonBarCharts({results}: Readonly<SimulationResults>) {
    const toDays = (start: Date, end: Date) =>
        Math.floor((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 3600 * 24));

    const metrics = [
        {
            label: "Simulation Length (days)",
            values: results.map(r => toDays(
                r.stockSimulationRequest.startDate,
                r.stockSimulationRequest.endDate
            )),
        },
        {
            label: "Total Profit Margin (%)",
            values: results.map(getProfitMargin)
        },
        {
            label: "Avg Daily Growth (%)",
            values: results.map(getAverageDailyGrowth)
        },
        {
            label: "Total Transactions",
            values: results.map(getTransactionCount)
        },
        {
            label: "Total Fees ($)",
            values: results.map(getTotalFees)
        }
    ];

    return (
        <Grid size={{xs: 12}} container spacing={2}>
            {metrics.map(({label, values}) => (
                <Grid size={{xs: 12, md: 6, xl: 4}} key={label}>
                    <Paper elevation={3} sx={{padding: 2}}>
                        <CanvasJSChart options={getSingleMetricChartOptions(label, values)}/>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    )
}

export function CompareSimulations() {
    const location = useLocation();
    const inputState = location.state as SimulationResults;
    const results = inputState.results;

    return (
        <Grid container spacing={2} padding={2}>
            <Grid size={{xs: 12}}>
                <Typography variant="h4" gutterBottom>
                    Simulation Comparison
                </Typography>
            </Grid>

            <MetricsComparison results={results} colors={canvasColors}/>
            <NormalizedPortfolioValues results={results}/>
            <ComparisonBarCharts results={results}/>
        </Grid>
    );
}