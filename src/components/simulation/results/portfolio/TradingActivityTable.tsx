import {UserPortfolio} from "../../../../model/simulation/UserPortfolio.ts";
import {
    Box,
    Chip,
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

interface TradingActivityTableProps {
    portfolio: UserPortfolio;
    hasActivity: boolean;
}

export function TradingActivityTable({portfolio, hasActivity}: Readonly<TradingActivityTableProps>) {
    return (
        <>
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
        </>
    );
}