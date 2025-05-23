import { useLocation } from "react-router-dom";
import {Grid, Typography, Paper, Divider} from "@mui/material";
import CanvasJSReact from "@canvasjs/react-stockcharts";
import {SimulationResult} from "../../model/simulation/SimulationResult.ts";
import {UserPortfolio} from "../../model/simulation/UserPortfolio.ts";
import {Fragment} from "react";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

function extractMetrics(result: SimulationResult): Record<string, string> {
    const { startDate, endDate, brokerName, stockNames, startCapital } = result.stockSimulationRequest;
    const portfolios = result.userPortfolios;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((+end - +start) / (1000 * 60 * 60 * 24));
    const finalValue = portfolios[portfolios.length - 1]?.totalPortfolioValue || 0;
    const profitMargin = ((finalValue - startCapital) / startCapital) * 100;

    const avgGrowth = portfolios.length > 1
        ? ((finalValue / startCapital) ** (1 / (portfolios.length - 1)) - 1) * 100
        : 0;

    let transactionCount = 0;
    let totalFees = 0;
    portfolios.forEach(p => {
        transactionCount += p.sharesBought.length;
        totalFees += p.sharesBought.reduce((sum, tx) => sum + tx.transactionFee, 0);
    });

    return {
        "Broker Name": brokerName,
        "Simulation Length": `${days} days`,
        "Stocks Used": stockNames.join(", "),
        "Start Capital": `$${startCapital.toFixed(2)}`,
        "Final Portfolio Value": `$${finalValue.toFixed(2)}`,
        "Profit Margin": `${profitMargin.toFixed(2)}%`,
        "Avg Daily Growth": `${avgGrowth.toFixed(2)}%`,
        "Total Transactions": transactionCount.toString(),
        "Total Transaction Fees": `$${totalFees.toFixed(2)}`
    };
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
    return result.userPortfolios.reduce((sum, p) => sum + p.sharesBought.length, 0);
}

function getTotalFees(result: SimulationResult): number {
    return result.userPortfolios.flatMap(p => p.sharesBought).reduce((sum, tx) => sum + tx.transactionFee, 0);
}

function getSingleMetricChartOptions(
    label: string,
    val1: number,
    val2: number
) {
    const minVal = Math.min(val1, val2);

    return {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: label
        },
        axisY: {
            title: label,
            minimum: minVal < 0 ? minVal * 1.5 : 0
        },
        axisX: {
            title: "",
            valueFormatString: "",
            labelFormatter: () => "",
        },
        toolTip: {
            shared: true
        },
        data: [
            {
                type: "column",
                name: "Simulation 1",
                showInLegend: true,
                dataPointWidth: 80,
                dataPoints: [{ label: "Comparison", y: val1 }]
            },
            {
                type: "column",
                name: "Simulation 2",
                showInLegend: true,
                dataPointWidth: 80,
                dataPoints: [{ label: "Comparison", y: val2 }]
            }
        ]
    };
}

function getNormalizedComparisonChartOptions(result1: SimulationResult, result2: SimulationResult) {
    const normalize = (portfolios: UserPortfolio[]) => {
        const startValue = portfolios[0]?.totalPortfolioValue || 1;
        return portfolios.map((portfolio, relativeDay) => ({
            x: relativeDay,
            y: (portfolio.totalPortfolioValue / startValue) * 100,
        }));
    };

    const dataPoints1 = normalize(result1.userPortfolios);
    const dataPoints2 = normalize(result2.userPortfolios);

    return {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: "Normalized Total Portfolio Values"
        },
        axisY: {
            title: "Portfolio Value (Normalized)",
            suffix: "%"
        },
        axisX: {
            title: "Simulation Day",
            interval: Math.ceil(Math.max(dataPoints1.length, dataPoints2.length) / 10), // 10 ticks
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
        data: [
            {
                type: "line",
                name: "Simulation 1",
                showInLegend: true,
                dataPoints: dataPoints1
            },
            {
                type: "line",
                name: "Simulation 2",
                showInLegend: true,
                dataPoints: dataPoints2
            }
        ]
    };
}

interface ComparedSimulations {
    result1: SimulationResult;
    result2: SimulationResult;
}

function MetricsComparison({result1, result2}: Readonly<ComparedSimulations>) {
    const metrics1 = extractMetrics(result1);
    const metrics2 = extractMetrics(result2);

    return (
        <Grid size={{xs: 12}}>
            <Paper elevation={3} sx={{ padding: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Metrics
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                    {Object.keys(metrics1).map((key) => (
                        <Fragment key={key}>
                            <Grid size={{xs: 4}}>
                                <Typography fontWeight="bold">{key}</Typography>
                            </Grid>
                            <Grid size={{xs: 4}}>
                                <Typography>{metrics1[key]}</Typography>
                            </Grid>
                            <Grid size={{xs: 4}}>
                                <Typography>{metrics2[key]}</Typography>
                            </Grid>
                        </Fragment>
                    ))}
                </Grid>
            </Paper>
        </Grid>
    )
}

function NormalizedPortfolioValues({result1, result2}: Readonly<ComparedSimulations>) {
    const chartOptions = getNormalizedComparisonChartOptions(result1, result2);

    return (
        <Grid size={{xs: 12}}>
            <Paper elevation={3} sx={{ padding: 2 }}>
                <CanvasJSChart options={chartOptions} />
            </Paper>
        </Grid>
    )
}

function ComparisonBarCharts({result1, result2}: Readonly<ComparedSimulations>) {
    const toDays = (start: Date, end: Date) =>
        Math.floor((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 3600 * 24));

    const metrics = [
        {
            label: "Simulation Length (days)",
            val1: toDays(result1.stockSimulationRequest.startDate, result1.stockSimulationRequest.endDate),
            val2: toDays(result2.stockSimulationRequest.startDate, result2.stockSimulationRequest.endDate)
        },
        {
            label: "Total Profit Margin (%)",
            val1: getProfitMargin(result1),
            val2: getProfitMargin(result2)
        },
        {
            label: "Avg Daily Growth (%)",
            val1: getAverageDailyGrowth(result1),
            val2: getAverageDailyGrowth(result2)
        },
        {
            label: "Total Transactions",
            val1: getTransactionCount(result1),
            val2: getTransactionCount(result2)
        },
        {
            label: "Total Fees ($)",
            val1: getTotalFees(result1),
            val2: getTotalFees(result2)
        }
    ];

    return (
        <Grid size={{xs:12}} container spacing={2}>
            {metrics.map(({ label, val1, val2 }) => (
                <Grid size={{xs:12, md:6, xl: 4}} key={label}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <CanvasJSChart options={getSingleMetricChartOptions(label, val1, val2)} />
                    </Paper>
                </Grid>
            ))}
        </Grid>
    )
}

export function CompareSimulations() {
    const location = useLocation();
    const { result1, result2 } = location.state as {
        result1: SimulationResult;
        result2: SimulationResult;
    };

    return (
        <Grid container spacing={2} padding={2}>
            <Grid size={{xs: 12}}>
                <Typography variant="h4" gutterBottom>
                    Simulation Comparison
                </Typography>
            </Grid>

            <MetricsComparison result1={result1} result2={result2} />
            <NormalizedPortfolioValues result1={result1} result2={result2}/>
            <ComparisonBarCharts result1={result1} result2={result2}/>
        </Grid>
    );
}