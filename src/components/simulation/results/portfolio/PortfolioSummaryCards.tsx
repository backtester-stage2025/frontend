import {UserPortfolio} from "../../../../model/simulation/UserPortfolio.ts";
import {Box, Card, Grid, Typography} from "@mui/material";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import {formatCurrency} from "../../../../services/formatService.ts";

interface PortfolioSummaryCardsProps {
    portfolio: UserPortfolio;
    totalPositions: number;
    totalBought: number;
    totalSold: number;
    hasActivity: boolean;
    currencyPreference?: string;
}

export function PortfolioSummaryCards({
    portfolio,
    totalPositions,
    totalBought,
    totalSold,
    hasActivity,
    currencyPreference
}: Readonly<PortfolioSummaryCardsProps>
) {

    const totalShares = Object.values(portfolio.shareHoldings).reduce((sum, sh) => sum + sh.totalSharesOwned, 0);

    return (
        <Grid container spacing={2}>
            <Grid size={{xs: 12, sm: 6, md: 3}}>
                <Card sx={{p: 2, display: 'flex', flexDirection: 'column', height: '100%'}}>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1}}>
                        <Typography variant="subtitle2" color="text.secondary">Total Value</Typography>
                        <AccountBalanceIcon color="primary" fontSize="small"/>
                    </Box>
                    <Typography variant="h6">{formatCurrency(portfolio.totalPortfolioValue, currencyPreference)}</Typography>
                    <Typography variant="caption" color="text.secondary">
                        Cash: {formatCurrency(portfolio.cashBalance, currencyPreference)}
                    </Typography>
                </Card>
            </Grid>
            <Grid size={{xs: 12, sm: 6, md: 3}}>
                <Card sx={{p: 2, display: 'flex', flexDirection: 'column', height: '100%'}}>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1}}>
                        <Typography variant="subtitle2" color="text.secondary">Positions</Typography>
                    </Box>
                    <Typography variant="h6">{totalPositions}</Typography>
                    <Typography variant="caption" color="text.secondary">
                        {totalShares} total shares
                    </Typography>
                </Card>
            </Grid>
            {hasActivity && (
                <>
                    <Grid size={{xs: 12, sm: 6, md: 3}}>
                        <Card sx={{
                            p: 2, display: 'flex', flexDirection: 'column', height: '100%',
                            bgcolor: 'success.light', color: 'white'
                        }}>
                            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1}}>
                                <Typography variant="subtitle2" color="white">Bought</Typography>
                                <TrendingUpIcon fontSize="small" sx={{color: 'white'}}/>
                            </Box>
                            <Typography variant="h6">{totalBought} shares</Typography>
                            <Typography variant="caption" sx={{color: 'rgba(255,255,255,0.8)'}}>
                                {Object.values(portfolio.sharesBought).filter(st => st.totalSharesBought > 0).length} stocks
                            </Typography>
                        </Card>
                    </Grid>
                    <Grid size={{xs: 12, sm: 6, md: 3}}>
                        <Card sx={{
                            p: 2, display: 'flex', flexDirection: 'column', height: '100%',
                            bgcolor: 'error.light', color: 'white'
                        }}>
                            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1}}>
                                <Typography variant="subtitle2" color="white">Sold</Typography>
                                <TrendingDownIcon fontSize="small" sx={{color: 'white'}}/>
                            </Box>
                            <Typography variant="h6">{totalSold} shares</Typography>
                            <Typography variant="caption" sx={{color: 'rgba(255,255,255,0.8)'}}>
                                {Object.values(portfolio.sharesBought).filter(st => st.totalSharesBought < 0).length} stocks
                            </Typography>
                        </Card>
                    </Grid>
                </>
            )}
        </Grid>
    );
}
