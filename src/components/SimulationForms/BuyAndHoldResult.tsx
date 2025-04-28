import { BuyAndHoldSimulationResult } from "../../model/BuyAndHoldSimulationResult.ts";
import { Box, Card, CardContent, Divider, Typography, Paper, Chip, Grid} from "@mui/material";
import { Loader } from "../Loader.tsx";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AssessmentIcon from '@mui/icons-material/Assessment';

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

export function BuyAndHoldResult({ result, isRunning, isError }: Readonly<ResultScreenProps>) {
    if (isError) {
        return (
            <Paper elevation={3} sx={{ p: 3, mt: 4, bgcolor: "#FFF5F5", borderLeft: "4px solid #F56565" }}>
                <Typography color="error" variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    An error occurred while processing your simulation.
                </Typography>
            </Paper>
        );
    }

    if (isRunning) {
        return <Loader />;
    }

    if (!result) {
        return null;
    }

    const { startDate, endDate, startCapital, endCapital, stockMetrics } = result;
    const profitLoss = endCapital - startCapital;
    const isProfitable = profitLoss >= 0;
    const profitLossPercent = ((profitLoss / startCapital) * 100).toFixed(2);

    return (
        <Card sx={{ mt: 4, borderRadius: 2, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 2, px: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUpIcon />
                    <Typography variant="h5" fontWeight="500">
                        Buy &amp; Hold Simulation Result
                    </Typography>
                </Box>
            </Box>

            <CardContent sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    {/* Summary Section */}
                    <Grid size={{ xs: 12 }} sx={{ m: 1 }}>
                        <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 4 }} sx={{ m: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <CalendarTodayIcon color="primary" fontSize="small" />
                                        <Typography variant="subtitle2" color="text.secondary">Period</Typography>
                                    </Box>
                                    <Typography variant="body1">{startDate} → {endDate}</Typography>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 4 }} sx={{ m: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <AccountBalanceWalletIcon color="primary" fontSize="small" />
                                        <Typography variant="subtitle2" color="text.secondary">Capital</Typography>
                                    </Box>
                                    <Typography variant="body1">{formatCurrency(startCapital)} → {formatCurrency(endCapital)}</Typography>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 4 }} sx={{ m: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <AssessmentIcon color="primary" fontSize="small" />
                                        <Typography variant="subtitle2" color="text.secondary">Performance</Typography>
                                    </Box>
                                    <Chip
                                        label={`${isProfitable ? '+' : ''}${formatCurrency(profitLoss)} (${isProfitable ? '+' : ''}${profitLossPercent}%)`}
                                        color={isProfitable ? "success" : "error"}
                                        size="small"
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* Stock Metrics Section */}
                    <Grid size={{ xs: 12 }} sx={{ m: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Typography variant="h6" fontWeight="500">Stock Metrics</Typography>
                        </Box>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }} sx={{ m: 1 }}>
                                <Paper elevation={1} sx={{ p: 2, height: '100%', borderRadius: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary" mb={1}>Returns</Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2">Daily Return (Avg)</Typography>
                                            <Typography variant="body2" fontWeight="500">{formatPercent(stockMetrics.averageDailyReturn)}</Typography>
                                        </Box>
                                        <Divider />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2">Annual Return (Avg)</Typography>
                                            <Typography variant="body2" fontWeight="500">{formatPercent(stockMetrics.averageAnnualReturn)}</Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }} sx={{ m: 1 }}>
                                <Paper elevation={1} sx={{ p: 2, height: '100%', borderRadius: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary" mb={1}>Risk</Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2">Daily Risk</Typography>
                                            <Typography variant="body2" fontWeight="500">{formatPercent(stockMetrics.dailyRisk)}</Typography>
                                        </Box>
                                        <Divider />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2">Annual Risk</Typography>
                                            <Typography variant="body2" fontWeight="500">{formatPercent(stockMetrics.annualRisk)}</Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }} sx={{ m: 1 }}>
                                <Paper elevation={1} sx={{ p: 2, height: '100%', borderRadius: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary" mb={1}>Drawdowns</Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2">Average Drawdown</Typography>
                                            <Typography variant="body2" fontWeight="500">{formatPercent(stockMetrics.averageDrawdownPercentage)}</Typography>
                                        </Box>
                                        <Divider />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2">Maximum Drawdown</Typography>
                                            <Typography variant="body2" fontWeight="500" color="error.main">{formatPercent(stockMetrics.maxDrawdownPercentage)}</Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }} sx={{ m: 1 }}>
                                <Paper elevation={1} sx={{ p: 2, height: '100%', borderRadius: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary" mb={1}>Distribution</Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2">Skewness</Typography>
                                        <Typography variant="body2" fontWeight="500">{stockMetrics.skewness.toFixed(2)}</Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}