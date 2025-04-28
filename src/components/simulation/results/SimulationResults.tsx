import {BuyAndHoldSimulationResult} from "../../../model/BuyAndHoldSimulationResult.ts";
import {Box, Card, CardContent, Chip, Grid, Paper, Typography} from "@mui/material";
import {Loader} from "../../Loader.tsx";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AssessmentIcon from '@mui/icons-material/Assessment';
import {MetricGroup, MetricGroupProps} from "./metrics/MetricGroup.tsx";
import {BackTestResult} from "./metrics/BackTestResult.tsx";

interface ResultScreenProps {
    result: BuyAndHoldSimulationResult | null;
    isRunning: boolean;
    isError: boolean;
}

function formatPercent(value: number) {
    return `${value.toFixed(2)}%`;
}

function formatCurrency(value: number) {
    return `$${value.toFixed(2)}`;
}



export function SimulationResults({result, isRunning, isError}: Readonly<ResultScreenProps>) {
    if (isError) {
        return (
            <Paper elevation={3} sx={{p: 3, mt: 4, bgcolor: "#FFF5F5", borderLeft: "4px solid #F56565"}}>
                <Typography color="error" variant="h6" sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    An error occurred while processing your simulation.
                </Typography>
            </Paper>
        );
    }

    if (isRunning) {
        return <Loader/>;
    }

    if (!result) {
        return null;
    }

    const {startDate, endDate, startCapital, endCapital, stockMetrics} = result;
    const profitLoss = endCapital - startCapital;
    const isProfitable = profitLoss >= 0;
    const profitLossPercent = ((profitLoss / startCapital) * 100).toFixed(2);

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
        <Card sx={{mt: 4, borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}}>
            <Box sx={{bgcolor: 'primary.main', color: 'white', py: 2, px: 3}}>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <TrendingUpIcon/>
                    <Typography variant="h5" fontWeight="500">
                        Buy &amp; Hold Simulation Result
                    </Typography>
                </Box>
            </Box>

            <CardContent sx={{p: 3}}>
                <Grid container spacing={3}>
                    {/* Summary Section */}
                    <Grid size={{xs: 12}} sx={{m: 1}}>
                        <Paper elevation={1} sx={{p: 2, borderRadius: 2}}>
                            <Grid container spacing={2}>
                                <BackTestResult
                                    icon={CalendarTodayIcon}
                                    title="Period"
                                >
                                    <Typography variant="body1">{startDate} → {endDate}</Typography>
                                </BackTestResult>

                                <BackTestResult
                                    icon={AccountBalanceWalletIcon}
                                    title="Capital"
                                >
                                    <Typography variant="body1">
                                        {formatCurrency(startCapital)} → {formatCurrency(endCapital)}
                                    </Typography>
                                </BackTestResult>

                                <BackTestResult
                                    icon={AssessmentIcon}
                                    title="Performance"
                                >
                                    <Chip
                                        label={`${isProfitable ? '+' : ''}${formatCurrency(profitLoss)} (${isProfitable ? '+' : ''}${profitLossPercent}%)`}
                                        color={isProfitable ? "success" : "error"}
                                        size="small"
                                    />
                                </BackTestResult>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Stock Metrics Section */}
                    <Grid size={{xs: 12}} sx={{m: 1}}>
                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 2}}>
                            <Typography variant="h6" fontWeight="500">Stock Metrics</Typography>
                        </Box>
                        <Grid container spacing={2}>
                            {details.map(MetricGroup)}
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}