import {Box, Grid, Paper, Stack, Typography} from "@mui/material";
import SavingsIcon from "@mui/icons-material/Savings";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import {formatEuro} from "../../../../services/formatService.ts";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import {useMemo} from "react";
import {UserPortfolio} from "../../../../model/simulation/UserPortfolio.ts";
import {ProfitChart} from "./ProfitChart.tsx";

interface InvestmentPerformanceViewProps {
    portfolioData: UserPortfolio[];
}

export function InvestmentPerformanceView({portfolioData}: Readonly<InvestmentPerformanceViewProps>) {
    const summaryData = useMemo(() => {
        if (!portfolioData || portfolioData.length === 0) return null;

        const initial = portfolioData[0];
        const latest = portfolioData[portfolioData.length - 1];
        const initialValue = initial.totalPortfolioValue;
        const finalValue = latest.totalPortfolioValue;

        const totalProfit = finalValue - initialValue;
        const percentProfit = (totalProfit / initialValue) * 100;

        const totalTransactionFees = portfolioData.reduce((sum, portfolio) => {
            return sum + Object.values(portfolio.sharesBought).reduce((feeSum, transaction) => {
                return feeSum + transaction.transactionFee;
            }, 0);
        }, 0);

        const totalTradeCount = portfolioData.reduce((count, portfolio) => {
            return count + Object.values(portfolio.sharesBought).filter(t => t.totalSharesBought !== 0).length;
        }, 0);

        let maxProfitDay = {date: '', profit: -Infinity};
        for (let i = 1; i < portfolioData.length; i++) {
            const todayValue = portfolioData[i].totalPortfolioValue;
            const yesterdayValue = portfolioData[i - 1].totalPortfolioValue;
            const dayProfit = todayValue - yesterdayValue;

            if (dayProfit > maxProfitDay.profit) {
                maxProfitDay = {date: portfolioData[i].date, profit: dayProfit};
            }
        }

        return {
            initialValue,
            finalValue,
            totalProfit,
            percentProfit,
            totalTransactionFees,
            feeToProfit: totalProfit > 0 ? (totalTransactionFees / totalProfit) * 100 : 0,
            totalTradeCount,
            maxProfitDay
        };
    }, [portfolioData]);

    return (
        <Paper elevation={2} sx={{p: 3, borderRadius: 2, height: '100%'}}>

            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3}}>
                <Typography variant="h6" gutterBottom sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <TrendingUpIcon color="primary"/>
                    Profit Evolution
                </Typography>
            </Box>

            {summaryData &&
                <Box sx={{mb: 4}}>
                    <Typography variant="h6" gutterBottom sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 2}}>
                        <SavingsIcon color="primary"/>
                        Portfolio Summary
                    </Typography>

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
                                    {formatEuro(summaryData.totalProfit)}
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
                                    {formatEuro(summaryData.totalTransactionFees)}
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
                                    {formatEuro(summaryData.finalValue)}
                                </Typography>
                                <Typography variant="caption" sx={{opacity: 0.9}}>
                                    From {formatEuro(summaryData.initialValue)}
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
                                    fee: {formatEuro(summaryData.totalTransactionFees / summaryData.totalTradeCount)}
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            }

            <ProfitChart portfolioData={portfolioData}/>
        </Paper>
    )
}