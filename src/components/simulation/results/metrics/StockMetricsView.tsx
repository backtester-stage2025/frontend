import {StockMetrics} from "../../../../model/StockMetrics.ts";
import {MetricGroup, MetricGroupProps} from "./MetricGroup.tsx";
import {formatPercent} from "../../../../services/formatService.ts";
import {Box, Grid, Typography} from "@mui/material";

export function StockMetricsView({stockMetrics}: Readonly<{ stockMetrics: StockMetrics }>) {
    const details: MetricGroupProps[] = [
        {
            title: "Returns",
            properties: [
                {name: "Daily Return (Avg)", value: formatPercent(stockMetrics.averageDailyReturn)},
                {name: "Annual Return (Avg)", value: formatPercent(stockMetrics.averageAnnualReturn)}
            ]
        },
        {
            title: "Risk",
            properties: [
                {name: "Daily Risk", value: formatPercent(stockMetrics.dailyRisk)},
                {name: "Annual Risk", value: formatPercent(stockMetrics.annualRisk)}
            ]
        },
        {
            title: "Drawdowns",
            properties: [
                {name: "Average Drawdown", value: formatPercent(stockMetrics.averageDrawdownPercentage)},
                {name: "Maximum Drawdown", value: formatPercent(stockMetrics.maxDrawdownPercentage)}
            ]
        },
        {
            title: "Distribution",
            properties: [
                {name: "Skewness", value: stockMetrics.skewness.toFixed(2)}
            ]
        }
    ]
    return (
        <Grid size={{xs: 12}} sx={{m: 1}}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 2}}>
                <Typography variant="h6" fontWeight="500">Stock Metrics</Typography>
            </Box>
            <Grid container spacing={2}>
                {details.map(MetricGroup)}
            </Grid>
        </Grid>
    )
}