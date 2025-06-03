import {Box, Paper, Typography} from "@mui/material";
import SavingsIcon from "@mui/icons-material/Savings";
import {useMemo} from "react";
import {UserPortfolio} from "../../../../model/simulation/UserPortfolio.ts";
import {ProfitChart} from "./ProfitChart.tsx";
import {InvestmentSummaryCards} from "./InvestmentSummaryCards.tsx";
import {CurrencyTypeDisplay} from "../../../../model/CurrencyType.ts";

interface InvestmentPerformanceViewProps {
    portfolioData: UserPortfolio[];
    currencyPreference?: string;
    startCapital?: number | null;
}

export function InvestmentPerformanceView({
                                              portfolioData,
                                              currencyPreference,
                                              startCapital
                                          }: Readonly<InvestmentPerformanceViewProps>) {
    const summaryData = useMemo(() => {
        if (!portfolioData || portfolioData.length === 0) return null;

        const latest = portfolioData[portfolioData.length - 1];
        const initialValue = startCapital ?? 0;
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

    const currencyLabel = currencyPreference
        ? CurrencyTypeDisplay[currencyPreference] || currencyPreference
        : "€";

    return (
        <Paper elevation={2} sx={{p: 3, borderRadius: 2, height: '100%'}}>
            {summaryData &&
                <Box sx={{mb: 4}}>
                    <Typography variant="h6" gutterBottom sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 2}}>
                        <SavingsIcon color="primary"/>
                        Portfolio Summary
                    </Typography>

                    <InvestmentSummaryCards
                        summaryData={summaryData}
                        currencyPreference={currencyPreference}
                    />
                </Box>
            }

            <ProfitChart portfolioData={portfolioData} currencyLabel={currencyLabel}
                         currencyPreference={currencyPreference}/>
        </Paper>
    )
}
