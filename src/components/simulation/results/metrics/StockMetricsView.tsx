import {StockMetrics} from "../../../../model/StockMetrics.ts";
import {MetricGroup, MetricGroupProps} from "./MetricGroup.tsx";
import {formatPercent} from "../../../../services/formatService.ts";
import {Box, Grid, Typography} from "@mui/material";
import {TOOLTIP_MESSAGES} from "../../../../constants/tooltipMessages.ts";

export function StockMetricsView({stockMetrics, stockName}: Readonly<{
    stockMetrics: StockMetrics,
    stockName: string
}>) {
    const details: MetricGroupProps[] = [
        {
            title: "Returns",
            properties: [
                {
                    name: "Daily Return (Avg)",
                    value: formatPercent(stockMetrics.averageDailyReturn),
                    isPositive: stockMetrics.averageDailyReturn >= 0
                },
                {
                    name: "Annual Return (Avg)",
                    value: formatPercent(stockMetrics.averageAnnualReturn),
                    isPositive: stockMetrics.averageAnnualReturn >= 0
                }
            ],
            color: "success.main",
            tooltip: {
                description: TOOLTIP_MESSAGES.stockMetrics.returnsInfo,
            }
        },
        {
            title: "Risk",
            properties: [
                {name: "Daily Risk", value: formatPercent(stockMetrics.dailyRisk)},
                {name: "Annual Risk", value: formatPercent(stockMetrics.annualRisk)}
            ],
            color: "warning.main",
            tooltip: {
                description: TOOLTIP_MESSAGES.stockMetrics.riskInfo,
            }
        },
        {
            title: "Drawdowns",
            properties: [
                {name: "Average Drawdown", value: formatPercent(stockMetrics.averageDrawdownPercentage)},
                {name: "Maximum Drawdown", value: formatPercent(stockMetrics.maxDrawdownPercentage)}
            ],
            color: "error.main",
            tooltip: {
                description: TOOLTIP_MESSAGES.stockMetrics.drawdownsInfo,
            }
        },
        {
            title: "Distribution",
            properties: [
                {name: "Skewness", value: stockMetrics.skewness.toFixed(2), isPositive: stockMetrics.skewness > 0}
            ],
            color: "info.main",
            tooltip: {
                description: TOOLTIP_MESSAGES.stockMetrics.distributionInfo,
            }
        }
    ]
    return (
        <Grid size={{xs: 12}} sx={{m: 1}}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 2, marginTop: 8}}>
                <Typography variant="h6" fontWeight="500">{stockName}</Typography>
            </Box>
            <Grid container spacing={2}>
                {details.map(group =>
                    <MetricGroup {...group} key={group.title}/>
                )}
            </Grid>
        </Grid>
    )
}