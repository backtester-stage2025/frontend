import {BuyAndHoldSimulationResult} from "../../model/BuyAndHoldSimulationResult.ts";
import {Box, Card, CardContent, Divider, Typography} from "@mui/material";
import {Loader} from "../Loader.tsx";

interface ResultScreenProps{
    result: BuyAndHoldSimulationResult | null;
    isRunning: boolean
    isError: boolean
}

function formatPercent(value: number) {
    return `${value.toFixed(2)}%`;
}

function formatCurrency(value: number) {
    return `$${value.toFixed(2)}`;
}

export function BuyAndHoldResult({ result, isRunning, isError }: Readonly<ResultScreenProps>) {
    if (isError) {
        return <Typography color="error">An error occurred.</Typography>;
    }

    if (isRunning) {
        return <Loader/>;
    }

    if (!result) {
        return null;
    }

    const { startDate, endDate, startCapital, endCapital, stockMetrics } = result;

    return (
        <Card sx={{ mt: 4 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Buy &amp; Hold Simulation Result
                </Typography>

                <Typography variant="subtitle1">
                    Period: {startDate} → {endDate}
                </Typography>
                <Typography variant="subtitle1">
                    Start Capital: {formatCurrency(startCapital)}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    End Capital: {formatCurrency(endCapital)}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                    Stock Metrics
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ flex: '1 1 300px' }}>
                        <Typography>
                            Avg. Daily Return: {formatPercent(stockMetrics.averageDailyReturn)}
                        </Typography>
                        <Typography>
                            Avg. Annual Return: {formatPercent(stockMetrics.averageAnnualReturn)}
                        </Typography>
                        <Typography>
                            Daily Risk: {formatPercent(stockMetrics.dailyRisk)}
                        </Typography>
                        <Typography>
                            Annual Risk: {formatPercent(stockMetrics.annualRisk)}
                        </Typography>
                    </Box>
                    <Box sx={{ flex: '1 1 300px' }}>
                        <Typography>
                            Avg. Drawdown: {formatPercent(stockMetrics.averageDrawdownPercentage)}
                        </Typography>
                        <Typography>
                            Max Drawdown: {formatPercent(stockMetrics.maxDrawdownPercentage)}
                        </Typography>
                        <Typography>
                            Skewness: {stockMetrics.skewness.toFixed(2)}
                        </Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}