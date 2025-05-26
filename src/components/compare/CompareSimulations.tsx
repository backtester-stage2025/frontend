import {useLocation} from "react-router-dom";
import {Divider, Grid, Paper, Typography} from "@mui/material";
import CanvasJSReact from "@canvasjs/react-stockcharts";
import {SimulationResult} from "../../model/simulation/SimulationResult.ts";
import {UserPortfolio} from "../../model/simulation/UserPortfolio.ts";
import {Fragment} from "react";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

function extractMetrics(result: SimulationResult): Record<string, string> {
    const {startDate, endDate, brokerName, stockNames, startCapital} = result.stockSimulationRequest;
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
    values: number[]
) {
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
            maximum: maxVal > 0 ? maxVal * 1.5 : minVal * -0.2,
        },
        axisX: {
            title: "",
            valueFormatString: "",
            labelFormatter: () => "",
        },
        toolTip: {
            shared: true
        },
        data: values.map((value, index) => ({
            type: "column",
            name: `Simulation ${index + 1}`,
            showInLegend: true,
            dataPoints: [{label: "Comparison", y: value}],
        }))

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
    const maxSimulationLength = Math.max(...normalizedPortfolios.map(points=>points.length));
    const xInterval = Math.ceil(maxSimulationLength / 10);

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
            dataPoints: dataPoints
        }))
    };
}

interface SimulationResults {
    results: SimulationResult[]
}

function MetricsComparison({results}: Readonly<SimulationResults>) {
    if (results.length === 0) {
        return null;
    }
    const metrics = results.map(extractMetrics);
    const metricKeys = Object.keys(metrics[0]) as (keyof SimulationResult)[];

    return (
        <Grid size={{xs: 12}}>
            <Paper elevation={3} sx={{padding: 2}}>
                <Typography variant="h6" gutterBottom>
                    Metrics
                </Typography>
                <Divider sx={{mb: 2}}/>
                <Grid container spacing={2}>

                    {metricKeys.map((key) => (
                        <Fragment key={key}>
                            <Grid size={{xs: 4}}>
                                <Typography fontWeight="bold">{key}</Typography>
                            </Grid>
                            {metrics.map((m) => (
                                <Grid size={{xs: 4}} key={m.id}>
                                    <Typography>
                                        {m[key]}
                                    </Typography>
                                </Grid>
                            ))}
                        </Fragment>
                    ))}
                </Grid>
            </Paper>
        </Grid>
    )
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

            <MetricsComparison results={results} />
            <NormalizedPortfolioValues results={results}/>
            <ComparisonBarCharts results={results}/>
        </Grid>
    );
}