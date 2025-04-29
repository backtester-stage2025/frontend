import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Grid,
    Paper,
    Typography
} from "@mui/material";
import {Loader} from "../../Loader.tsx";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {UserPortfolio} from "../../../model/simulation/UserPortfolio.ts";
interface ResultScreenProps {
    result: UserPortfolio[] | null;
    isRunning: boolean;
    isError: boolean;
}


export function SimulationResults({result, isRunning, isError}: Readonly<ResultScreenProps>) {
    if (isError) {
        return (
            <Paper elevation={3} sx={{p: 3, mt: 4, bgcolor: "#FFF5F5", borderLeft: "4px solid #F56565"}}>
                <Typography color="error" variant="h6" sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    An error occurred while processing your simulation.
                </Typography>
            </Paper>
        );
    }

    if (isRunning) {
        return <Loader/>;
    }

    if (!result) {
        return null;
    }


    return (
        <Box sx={{ mt: 4}}>
            {result.map((portfolio) => (
                <Accordion key={portfolio.date} disableGutters>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Grid container spacing={2} alignItems="center" sx={{width: "100%"}}>
                            <Grid size={{xs: 4}}>
                                <Typography variant="subtitle1">
                                    {portfolio.date}
                                </Typography>
                            </Grid>
                            <Grid size={{xs: 4}}>
                                <Typography variant="body2">
                                    Cash: ${portfolio.cashBalance.toFixed(2)}
                                </Typography>
                            </Grid>
                            <Grid size={{xs: 4}}>
                                <Typography variant="body2">
                                    Total: ${portfolio.totalPortfolioValue.toFixed(2)}
                                </Typography>
                            </Grid>
                        </Grid>
                    </AccordionSummary>

                    <AccordionDetails sx={{ bgcolor: '#fafafa' }}>
                        <Grid container spacing={2} sx={{width: "100%"}}>
                            <Grid size={{xs: 12, md: 6}}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Share Holdings
                                </Typography>
                                <Box sx={{ pl: 2 }}>
                                    {Object.entries(portfolio.shareHoldings).map(
                                        ([symbol, qty]) => (
                                            <Typography key={symbol} variant="body2">
                                                {symbol}: {qty}
                                            </Typography>
                                        )
                                    )}
                                </Box>
                            </Grid>

                            <Grid size={{xs: 12, md: 6}}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Shares Bought
                                </Typography>
                                <Box sx={{ pl: 2 }}>
                                    {Object.entries(portfolio.sharesBought).map(
                                        ([symbol, qty]) => (
                                            <Typography key={symbol} variant="body2">
                                                {symbol}: {qty}
                                            </Typography>
                                        )
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
}