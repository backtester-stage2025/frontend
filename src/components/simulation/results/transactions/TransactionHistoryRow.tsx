import {Accordion, AccordionSummary, Box, Chip, Grid, Typography} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {UserPortfolio} from "../../../../model/simulation/UserPortfolio.ts";
import {formatCurrency} from "../../../../services/formatService.ts";
import {PortfolioDetails} from "../portfolio/PortfolioDetails.tsx";

interface RowProps {
    portfolio: UserPortfolio;
    expanded: boolean;
    onToggle: () => void;
    currencyPreference?: string;
}

export function TransactionHistoryRow({portfolio, expanded, onToggle, currencyPreference}: Readonly<RowProps>) {
    const hasTradesOnDay = Object.values(portfolio.sharesBought).some(st => st.totalSharesBought !== 0);

    return (
        <Accordion
            expanded={expanded}
            onChange={onToggle}
            disableGutters
            sx={{
                mb: 1,
                bgcolor: hasTradesOnDay ? 'rgba(66, 165, 245, 0.05)' : 'inherit',
                '&:hover': {bgcolor: 'rgba(0, 0, 0, 0.04)'}
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls={`panel-${portfolio.date}-content`}
                id={`panel-${portfolio.date}-header`}
            >
                <Grid container spacing={2} alignItems="center" sx={{width: "100%"}}>
                    <Grid size={{xs: 4, sm: 3}}>
                        <Typography variant="subtitle1" fontWeight="medium">
                            {portfolio.date}
                        </Typography>
                        {hasTradesOnDay && (
                            <Chip
                                label="Trades"
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ml: 1, height: 20}}
                            />
                        )}
                    </Grid>
                    <Grid size={{xs: 4, sm: 3}}>
                        <Typography variant="body2">
                            Cash: {formatCurrency(portfolio.cashBalance, currencyPreference)}
                        </Typography>
                    </Grid>
                    <Grid size={{xs: 4, sm: 3}}>
                        <Typography
                            variant="body2"
                            fontWeight="bold"
                        >
                            Total: {formatCurrency(portfolio.totalPortfolioValue, currencyPreference)}
                        </Typography>
                    </Grid>
                    <Grid size={{xs: 12, sm: 3}} sx={{display: {xs: 'none', sm: 'block'}}}>
                        {hasTradesOnDay && (
                            <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                                {Object.values(portfolio.sharesBought)
                                    .filter(st => st.totalSharesBought !== 0)
                                    .slice(0, 3)
                                    .map(st => (
                                        <Chip
                                            key={st.stockName}
                                            label={`${st.stockName} ${st.totalSharesBought > 0 ? '+' : ''}${st.totalSharesBought}`}
                                            size="small"
                                            sx={{
                                                bgcolor: st.totalSharesBought > 0 ? 'success.light' : 'error.light',
                                                color: 'white',
                                                fontSize: '0.7rem'
                                            }}
                                        />
                                    ))}
                                {Object.values(portfolio.sharesBought)
                                    .filter(st => st.totalSharesBought !== 0)
                                    .length > 3 && (
                                    <Chip
                                        label="..."
                                        size="small"
                                        sx={{fontSize: '0.7rem'}}
                                    />
                                )}
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </AccordionSummary>
            <PortfolioDetails portfolio={portfolio} currencyPreference={currencyPreference}/>
        </Accordion>
    );
}
