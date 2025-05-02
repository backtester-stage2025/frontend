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
    const totalShares = Object.values(portfolio.shareHoldings).reduce((sum, qty) => sum + qty, 0);
    const totalBought = Object.values(portfolio.sharesBought).filter(qty => qty > 0).reduce((sum, qty) => sum + qty, 0);
    const totalSold = Object.values(portfolio.sharesBought).filter(qty => qty < 0).reduce((sum, qty) => sum + Math.abs(qty), 0);
    const hasActivity = Object.values(portfolio.sharesBought).some(qty => qty !== 0);

    const stockValues = Object.entries(portfolio.shareHoldings).map(([symbol, qty]) => ({
        symbol,
        quantity: qty,
        estimatedValue: qty * 100
    }));

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
                            <Typography variant="h6">{Object.keys(portfolio.shareHoldings).length}</Typography>
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
                                        {Object.entries(portfolio.sharesBought).filter(([_, qty]) => qty > 0).length} stocks
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
                                        {Object.entries(portfolio.sharesBought).filter(([_, qty]) => qty < 0).length} stocks
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
                                label={Object.keys(portfolio.shareHoldings).length}
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
                                {Object.entries(portfolio.shareHoldings)
                                    .sort((a, b) => b[1] - a[1])
                                    .map(([symbol, qty]) => (
                                        <TableRow
                                            key={symbol}
                                            sx={{'&:nth-of-type(odd)': {bgcolor: 'rgba(0, 0, 0, 0.02)'}}}
                                        >
                                            <TableCell sx={{fontWeight: 500}}>{symbol}</TableCell>
                                            <TableCell align="right">{qty.toLocaleString()}</TableCell>
                                            <TableCell align="right">
                                                {formatEuro(stockValues.find(stock => stock.symbol === symbol)?.estimatedValue ?? 0)}
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
                                    label={Object.values(portfolio.sharesBought).filter(qty => qty !== 0).length}
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
                                        .filter(([_, qty]) => qty !== 0)
                                        .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
                                        .map(([symbol, qty]) => (
                                            <TableRow key={symbol}>
                                                <TableCell sx={{fontWeight: 500}}>{symbol}</TableCell>
                                                <TableCell align="right">
                                                    <Chip
                                                        label={qty > 0 ? 'BUY' : 'SELL'}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: qty > 0 ? 'success.main' : 'error.main',
                                                            color: 'white',
                                                            fontWeight: 'bold',
                                                            minWidth: '60px'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Tooltip title={qty > 0 ? "Bought" : "Sold"}>
                                                        <Typography
                                                            variant="body2"
                                                            fontWeight="medium"
                                                            sx={{color: qty > 0 ? 'success.dark' : 'error.dark'}}
                                                        >
                                                            {Math.abs(qty).toLocaleString()}
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