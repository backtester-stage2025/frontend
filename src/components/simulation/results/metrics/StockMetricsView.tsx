import {MetricGroup, MetricGroupProps} from "./MetricGroup.tsx";
import {formatPercent} from "../../../../services/formatService.ts";
import {Box, Grid, Typography} from "@mui/material";
import {TOOLTIP_MESSAGES} from "../../../../constants/tooltipMessages.ts";
import {SimulationReport} from "../../../../model/simulation/SimulationReport.ts";

interface StockMetricsViewProps {
    simulationReport: SimulationReport;
}

export function StockMetricsView({simulationReport}: Readonly<StockMetricsViewProps>) {
    const details: MetricGroupProps[] = [
        {
            title: "Returns",
            properties: [
                {
                    name: "Daily Return (Avg)",
                    value: formatPercent(simulationReport.averageDailyReturn),
                    isPositive: simulationReport.averageDailyReturn >= 0
                },
                {
                    name: "Annual Return (Avg)",
                    value: formatPercent(simulationReport.averageAnnualReturn),
                    isPositive: simulationReport.averageAnnualReturn >= 0
                }
            ],
            color: "success.main",
            tooltip: TOOLTIP_MESSAGES.stockMetrics.returns
        },
        {
            title: "Risk",
            properties: [
                {name: "Daily Risk", value: formatPercent(simulationReport.dailyRisk)},
                {name: "Annual Risk", value: formatPercent(simulationReport.annualRisk)}
            ],
            color: "warning.main",
            tooltip: TOOLTIP_MESSAGES.stockMetrics.risk
        },
        {
            title: "Drawdowns",
            properties: [
                {name: "Average Drawdown", value: formatPercent(simulationReport.averageDrawdownPercentage)},
                {name: "Maximum Drawdown", value: formatPercent(simulationReport.maxDrawdownPercentage)}
            ],
            color: "error.main",
            tooltip: TOOLTIP_MESSAGES.stockMetrics.drawdown
        },
        {
            title: "Distribution",
            properties: [
                {
                    name: "Skewness",
                    value: simulationReport.skewness.toFixed(2),
                    isPositive: simulationReport.skewness > 0
                }
            ],
            color: "info.main",
            tooltip: TOOLTIP_MESSAGES.stockMetrics.distribution
        }
    ]
    return (
        <Grid size={{xs: 12}} sx={{m: 1}}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 2, marginTop: 8}}>
                <Typography variant="h6" fontWeight="500">{simulationReport.stockName}</Typography>
            </Box>
            <Grid container spacing={2}>
                {details.map(group =>
                    <MetricGroup {...group} key={group.title}/>
                )}
            </Grid>
        </Grid>
    )
}