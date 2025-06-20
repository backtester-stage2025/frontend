import {Box, Grid, Typography} from "@mui/material";
import {formatCurrency} from "../../../../services/formatService.ts";

interface CashFlowSummaryProps {
    totalBought: number;
    totalSold: number;
    totalTransactionFees: number;
    currencyPreference?: string;
}

export function CashFlowSummary({
                                    totalBought,
                                    totalSold,
                                    totalTransactionFees,
                                    currencyPreference
                                }: Readonly<CashFlowSummaryProps>) {
    return (
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
                    <Typography variant="body2" color="text.secondary">Transaction Fees:</Typography>
                </Grid>
                <Grid size={{xs: 6}} sx={{textAlign: 'right'}}>
                    <Typography variant="body2" color="success.main">{totalBought} shares</Typography>
                    <Typography variant="body2" color="error.main">{totalSold} shares</Typography>
                    <Typography variant="body2" color="warning.main">
                        {formatCurrency(totalTransactionFees, currencyPreference)}
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    );
}
