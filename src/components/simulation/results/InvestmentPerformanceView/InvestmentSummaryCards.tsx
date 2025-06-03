import {Grid, Paper, Stack, Typography} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import {formatCurrency} from "../../../../services/formatService.ts";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

interface InvestmentSummaryCardsProps {
    summaryData: {
        totalProfit: number;
        percentProfit: number;
        totalTransactionFees: number;
        feeToProfit: number;
        finalValue: number;
        initialValue: number;
        totalTradeCount: number;
    };
    currencyPreference?: string;
}

export function InvestmentSummaryCards({summaryData, currencyPreference}: Readonly<InvestmentSummaryCardsProps>) {
    return (
        <Grid container spacing={3} sx={{mb: 3}}>
            {/* Total Profit */}
            <Grid size={{xs: 12, sm: 6, md: 3}}>
                <Paper
                    elevation={1}
                    sx={{
                        p: 2,
                        bgcolor: summaryData.totalProfit >= 0 ? 'success.light' : 'error.light',
                        color: 'white',
                        borderRadius: 2
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={1} sx={{mb: 1}}>
                        {summaryData.totalProfit >= 0 ?
                            <TrendingUpIcon/> :
                            <TrendingDownIcon/>
                        }
                        <Typography variant="body2" fontWeight="medium">Total Profit</Typography>
                    </Stack>
                    <Typography variant="h6" fontWeight="bold">
                        {formatCurrency(summaryData.totalProfit, currencyPreference)}
                    </Typography>
                    <Typography variant="caption" sx={{opacity: 0.9}}>
                        {summaryData.percentProfit.toFixed(2)}% from initial
                    </Typography>
                </Paper>
            </Grid>

            {/* Transaction Fees */}
            <Grid size={{xs: 12, sm: 6, md: 3}}>
                <Paper
                    elevation={1}
                    sx={{
                        p: 2,
                        bgcolor: 'warning.light',
                        color: 'white',
                        borderRadius: 2
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={1} sx={{mb: 1}}>
                        <MoneyOffIcon/>
                        <Typography variant="body2" fontWeight="medium">Transaction Fees</Typography>
                    </Stack>
                    <Typography variant="h6" fontWeight="bold">
                        {formatCurrency(summaryData.totalTransactionFees, currencyPreference)}
                    </Typography>
                    {summaryData.totalProfit > 0 && (
                        <Typography variant="caption" sx={{opacity: 0.9}}>
                            {summaryData.feeToProfit.toFixed(2)}% of profit
                        </Typography>
                    )}
                </Paper>
            </Grid>

            {/* Account Value */}
            <Grid size={{xs: 12, sm: 6, md: 3}}>
                <Paper
                    elevation={1}
                    sx={{
                        p: 2,
                        bgcolor: 'info.light',
                        color: 'white',
                        borderRadius: 2
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={1} sx={{mb: 1}}>
                        <AccountBalanceIcon/>
                        <Typography variant="body2" fontWeight="medium">Final Value</Typography>
                    </Stack>
                    <Typography variant="h6" fontWeight="bold">
                        {formatCurrency(summaryData.finalValue, currencyPreference)}
                    </Typography>
                    <Typography variant="caption" sx={{opacity: 0.9}}>
                        From {formatCurrency(summaryData.initialValue, currencyPreference)}
                    </Typography>
                </Paper>
            </Grid>

            {/* Trading Activity */}
            <Grid size={{xs: 12, sm: 6, md: 3}}>
                <Paper
                    elevation={1}
                    sx={{
                        p: 2,
                        bgcolor: 'primary.light',
                        color: 'white',
                        borderRadius: 2
                    }}
                >
                    <Stack direction="row" alignItems="center" spacing={1} sx={{mb: 1}}>
                        <TrendingUpIcon/>
                        <Typography variant="body2" fontWeight="medium">Trading Activity</Typography>
                    </Stack>
                    <Typography variant="h6" fontWeight="bold">
                        {summaryData.totalTradeCount} trades
                    </Typography>
                    <Typography variant="caption" sx={{opacity: 0.9}}>
                        Avg
                        fee: {formatCurrency(summaryData.totalTransactionFees / summaryData.totalTradeCount, currencyPreference)}
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    )
}
