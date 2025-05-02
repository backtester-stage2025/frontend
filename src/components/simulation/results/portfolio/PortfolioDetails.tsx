import {UserPortfolio} from "../../../../model/simulation/UserPortfolio.ts";
import {AccordionDetails, Box, Divider, Grid} from "@mui/material";
import {PortfolioSummaryCards} from "./PortfolioSummaryCards";
import {ShareHoldingsTable} from "./ShareHoldingsTable";
import {TradingActivityTable} from "./TradingActivityTable";
import {CashFlowSummary} from "./CashFlowSummary";

interface PortfolioDetailsProps {
    portfolio: UserPortfolio;
}

export function PortfolioDetails({portfolio}: Readonly<PortfolioDetailsProps>) {
    const totalPositions = Object.values(portfolio.shareHoldings).filter(sh => sh.totalSharesOwned > 0).length;
    const totalBought = Object.values(portfolio.sharesBought).filter(st => st.totalSharesBought > 0).reduce((sum, st) => sum + st.totalSharesBought, 0);
    const totalSold = Object.values(portfolio.sharesBought).filter(st => st.totalSharesBought < 0).reduce((sum, st) => sum + Math.abs(st.totalSharesBought), 0);
    const hasActivity = Object.values(portfolio.sharesBought).some(st => st.totalSharesBought !== 0);

    return (
        <AccordionDetails sx={{bgcolor: '#fafafa', p: 3}}>
            <Box sx={{mb: 3}}>
                <PortfolioSummaryCards
                    portfolio={portfolio}
                    totalPositions={totalPositions}
                    totalBought={totalBought}
                    totalSold={totalSold}
                    hasActivity={hasActivity}
                />
            </Box>
            <Divider sx={{my: 2}}/>
            <Grid container spacing={3}>
                <Grid size={{xs: 12, md: 6}}>
                    <ShareHoldingsTable portfolio={portfolio} totalPositions={totalPositions}/>
                </Grid>
                <Grid size={{xs: 12, md: 6}}>
                    <TradingActivityTable portfolio={portfolio} hasActivity={hasActivity}/>
                    {hasActivity && (
                        <CashFlowSummary totalBought={totalBought} totalSold={totalSold}/>
                    )}
                </Grid>
            </Grid>
        </AccordionDetails>
    );
}