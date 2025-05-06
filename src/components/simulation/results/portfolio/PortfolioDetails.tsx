import {UserPortfolio} from "../../../../model/simulation/UserPortfolio.ts";
import {
    AccordionDetails,
    Box,
    Card,
    Chip,
    Divider,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from "@mui/material";
import {formatEuro} from "../../../../services/formatService.ts";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

export function PortfolioDetails({portfolio}: Readonly<{ portfolio: UserPortfolio }>) {
    const totalPositions = Object.values(portfolio.shareHoldings).filter(sh => sh.totalSharesOwned> 0).length;
    const totalShares = Object.values(portfolio.shareHoldings).reduce((sum, sh) => sum + sh.totalSharesOwned, 0);
    const totalBought = Object.values(portfolio.sharesBought).filter(st => st.totalSharesBought > 0).reduce((sum, st) => sum + st.totalSharesBought, 0);
    const totalSold = Object.values(portfolio.sharesBought).filter(st => st.totalSharesBought < 0).reduce((sum, st) => sum + Math.abs(st.totalSharesBought), 0);
    const hasActivity = Object.values(portfolio.sharesBought).some(st => st.totalSharesBought !== 0);

    return (
        <AccordionDetails sx={{bgcolor: '#fafafa', p: 3}}>
            {/* Portfolio Summary Cards */}
            <Box sx={{mb: 3}}>
                <Grid container spacing={2}>
                    <Grid size={{xs: 12, sm: 6, md: 3}}>
                        <Card sx={{p: 2, display: 'flex', flexDirection: 'column', height: '100%'}}>
                            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1}}>
                                <Typography variant="subtitle2" color="text.secondary">Total Value</Typography>
                                <AccountBalanceIcon color="primary" fontSize="small"/>
                            </Box>
                            <Typography variant="h6">{formatEuro(portfolio.totalPortfolioValue)}</Typography>
                            <Typography variant="caption" color="text.secondary">
                                Cash: {formatEuro(portfolio.cashBalance)}
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
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    bgcolor: 'success.light',
                                    color: 'white'
                                }}>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 1
                                    }}>
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
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    bgcolor: 'error.light',
                                    color: 'white'
                                }}>
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 1
                                    }}>
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
            </Box>

            <Divider sx={{my: 2}}/>

            <Grid container spacing={3}>
                {/* Holdings Table */}
                <Grid size={{xs: 12, md: 6}}>
                    <Box sx={{mb: 2}}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom
                                    sx={{display: 'flex', alignItems: 'center'}}>
                            Share Holdings
                            <Chip
                                label={totalPositions}
                                size="small"
                                color="primary"
                                sx={{ml: 1, height: 20}}
                            />
                        </Typography>
                    </Box>
                    <TableContainer component={Paper} variant="outlined">
                        <Table size="small" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Symbol</TableCell>
                                    <TableCell align="right">Quantity</TableCell>
                                    <TableCell align="right">Est. Value</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.values(portfolio.shareHoldings)
                                    .filter(sh => sh.totalSharesOwned > 0)
                                    .sort((a, b) => b.totalSharesOwned - a.totalSharesOwned)
                                    .map(sh => (
                                        <TableRow
                                            key={sh.stockName}
                                            sx={{'&:nth-of-type(odd)': {bgcolor: 'rgba(0, 0, 0, 0.02)'}}}
                                        >
                                            <TableCell sx={{fontWeight: 500}}>{sh.stockName}</TableCell>
                                            <TableCell align="right">{sh.totalSharesOwned.toLocaleString()}</TableCell>
                                            <TableCell align="right">
                                                {formatEuro(sh.price * sh.totalSharesOwned)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

                {/* Activity Section */}
                <Grid size={{xs: 12, md: 6}}>
                    <Box sx={{mb: 2}}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Trading Activity
                            {hasActivity && (
                                <Chip
                                    label={Object.values(portfolio.sharesBought).filter(st => st.totalSharesBought !== 0).length}
                                    size="small"
                                    color="secondary"
                                    sx={{ml: 1, height: 20}}
                                />
                            )}
                        </Typography>
                    </Box>

                    {hasActivity ? (
                        <TableContainer component={Paper} variant="outlined">
                            <Table size="small" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Symbol</TableCell>
                                        <TableCell align="right">Transaction</TableCell>
                                        <TableCell align="right">Shares</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.entries(portfolio.sharesBought)
                                        .filter(([, st]) => st.totalSharesBought !== 0)
                                        .sort((a, b) => Math.abs(b[1].totalSharesBought) - Math.abs(a[1].totalSharesBought))
                                        .map(([, st]) => (
                                            <TableRow key={st.stockName}>
                                                <TableCell sx={{fontWeight: 500}}>{st.stockName}</TableCell>
                                                <TableCell align="right">
                                                    <Chip
                                                        label={st.totalSharesBought > 0 ? 'BUY' : 'SELL'}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: st.totalSharesBought > 0 ? 'success.main' : 'error.main',
                                                            color: 'white',
                                                            fontWeight: 'bold',
                                                            minWidth: '60px'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Tooltip title={st.totalSharesBought > 0 ? "Bought" : "Sold"}>
                                                        <Typography
                                                            variant="body2"
                                                            fontWeight="medium"
                                                            sx={{color: st.totalSharesBought > 0 ? 'success.dark' : 'error.dark'}}
                                                        >
                                                            {Math.abs(st.totalSharesBought).toLocaleString()}
                                                        </Typography>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Box sx={{
                            p: 3,
                            textAlign: 'center',
                            bgcolor: 'background.paper',
                            borderRadius: 1,
                            border: '1px dashed',
                            borderColor: 'divider'
                        }}>
                            <Typography color="text.secondary">
                                No trading activity on this date
                            </Typography>
                        </Box>
                    )}

                    {/* Cash Flow Summary */}
                    {hasActivity && (
                        <Box sx={{
                            mt: 2,
                            p: 2,
                            bgcolor: 'background.paper',
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'divider'
                        }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Cash Flow Summary
                            </Typography>
                            <Grid container spacing={1}>
                                <Grid size={{xs: 6}}>
                                    <Typography variant="body2" color="text.secondary">Total Buys:</Typography>
                                    <Typography variant="body2" color="text.secondary">Total Sells:</Typography>
                                </Grid>
                                <Grid size={{xs: 6}} sx={{textAlign: 'right'}}>
                                    <Typography variant="body2" color="success.main">{totalBought} shares</Typography>
                                    <Typography variant="body2" color="error.main">{totalSold} shares</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </AccordionDetails>
    );
}