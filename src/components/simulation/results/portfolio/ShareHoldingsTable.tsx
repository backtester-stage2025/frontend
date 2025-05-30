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
    Typography
} from "@mui/material";
import {formatCurrency} from "../../../../services/formatService.ts";

interface ShareHoldingsTableProps {
    portfolio: UserPortfolio;
    totalPositions: number;
    currencyPreference?: string;
}

export function ShareHoldingsTable({portfolio, totalPositions, currencyPreference}: Readonly<ShareHoldingsTableProps>) {
    return (
        <>
            <Box sx={{mb: 2}}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom
                            sx={{display: 'flex', alignItems: 'center'}}>
                    Share Holdings
                    <Chip label={totalPositions} size="small" color="primary" sx={{ml: 1, height: 20}}/>
                </Typography>
            </Box>
            <TableContainer component={Paper} variant="outlined">
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Symbol</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Price/Share</TableCell>
                            <TableCell align="right">Est. Value</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.values(portfolio.shareHoldings)
                            .filter(sh => sh.totalSharesOwned > 0)
                            .sort((a, b) => b.totalSharesOwned - a.totalSharesOwned)
                            .map(sh => (
                                <TableRow key={sh.stockName}
                                          sx={{'&:nth-of-type(odd)': {bgcolor: 'rgba(0, 0, 0, 0.02)'}}}>
                                    <TableCell sx={{fontWeight: 500}}>{sh.stockName}</TableCell>
                                    <TableCell align="right">{sh.totalSharesOwned.toLocaleString()}</TableCell>
                                    <TableCell align="right">{formatCurrency(sh.price, currencyPreference)}</TableCell>
                                    <TableCell
                                        align="right">{formatCurrency(sh.price * sh.totalSharesOwned, currencyPreference)}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
