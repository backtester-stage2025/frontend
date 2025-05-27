import {Box, Button, Card, CardContent, Chip, Divider, Grid, Stack, Typography} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {format} from "date-fns";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import InsightsIcon from "@mui/icons-material/Insights";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {calculateReturnPercentage} from "../../services/formatService.ts";
import {SimulationSummary} from "../../model/simulation/SimulationSummary.ts";

interface SimulationCardProps {
    simulation: SimulationSummary;
    viewSimulationDetails: (simulation: SimulationSummary) => void;
}

export function SimulationCard({simulation, viewSimulationDetails}: Readonly<SimulationCardProps>) {

    const returnPercentage = calculateReturnPercentage(simulation);
    const finalValue = simulation.latestPortfolioValue || 0;
    const startCapital = simulation.stockSimulationRequest.startCapital;
    const isPositiveReturn = parseFloat(returnPercentage) >= 0;

    const absoluteGain = Math.abs(finalValue - startCapital).toFixed(2);

    return (
        <Card
            variant="outlined"
            sx={{
                mb: 2.5,
                p: 0,
                borderRadius: 2,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    boxShadow: 3,
                    transform: 'translateY(-2px)'
                }
            }}
        >
            <CardContent sx={{p: 2.5, "&:last-child": {pb: 0.5}}}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold" mb={0.5}>
                            Stocks:
                        </Typography>
                        <Stack spacing={0.5}>
                            {simulation.stockSimulationRequest.stockNames.map((stock, index) => (
                                <Typography key={index} variant="body2" sx={{display: 'flex', alignItems: 'center'}}>
                                    • {stock}
                                </Typography>
                            ))}
                        </Stack>
                    </Box>
                    <Chip
                        size="small"
                        icon={<CalendarTodayIcon/>}
                        label={format(new Date(simulation.simulationDate), 'PPP p')}
                        color="primary"
                        variant="outlined"
                    />
                </Box>

                <Divider sx={{mb: 2}}/>

                <Grid container spacing={2}>
                    <Grid size={{xs: 12, sm: 6}}>
                        <Stack spacing={1.5}>
                            <Box display="flex" alignItems="center">
                                <AttachMoneyIcon fontSize="small"
                                                 sx={{mr: 1, color: 'info.main'}}/>
                                <Typography variant="body2">
                                    Initial: ${startCapital.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                                </Typography>
                            </Box>

                            <Box display="flex" alignItems="center">
                                <AccountBalanceWalletIcon fontSize="small" sx={{
                                    mr: 1,
                                    color: isPositiveReturn ? 'success.main' : 'error.main'
                                }}/>
                                <Typography variant="body2" fontWeight="medium">
                                    Final: ${finalValue.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}
                                </Typography>
                            </Box>
                        </Stack>
                    </Grid>

                    <Grid size={{xs: 12, sm: 6}}>
                        <Stack spacing={1.5}>
                            <Box display="flex" alignItems="center">
                                <InsightsIcon
                                    fontSize="small"
                                    sx={{mr: 1, color: 'secondary.main'}}/>
                                <Typography variant="body2">
                                    {simulation.stockSimulationRequest.simulationType}
                                </Typography>
                            </Box>

                            <Box display="flex" alignItems="center">
                                <DateRangeIcon fontSize="small" sx={{mr: 1, color: 'text.secondary'}}/>
                                <Typography variant="body2" sx={{mr: 0.5}}>
                                    {format(new Date(simulation.stockSimulationRequest.startDate), 'PP')}
                                </Typography>
                                <ArrowRightAltIcon sx={{mx: 0.5}} fontSize="small"/>
                                <Typography variant="body2">
                                    {format(new Date(simulation.stockSimulationRequest.endDate), 'PP')}
                                </Typography>
                            </Box>
                        </Stack>
                    </Grid>
                </Grid>

                <Box
                    sx={{
                        mt: 2.5,
                        p: 1.5,
                        borderRadius: 1,
                        bgcolor: isPositiveReturn ? 'success.lighter' : 'error.lighter',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Box>
                        <Box display="flex" alignItems="center">
                            <Typography
                                variant="body1"
                                color={isPositiveReturn ? "success.main" : "error.main"}
                                fontWeight="bold"
                                sx={{mr: 1.5}}
                            >
                                {isPositiveReturn ? "+" : ""}{returnPercentage}%
                            </Typography>
                            <Typography variant="body1" fontWeight="medium"
                                        color={isPositiveReturn ? "success.dark" : "error.dark"}>
                                {isPositiveReturn ? "+" : "-"} ${absoluteGain.toLocaleString()}
                            </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary"
                                    sx={{display: 'block'}}>
                            {simulation.totalPortfolioCount} days simulated
                        </Typography>
                    </Box>
                    <Button
                        size="small"
                        variant="contained"
                        color={isPositiveReturn ? "success" : "primary"}
                        startIcon={<TrendingUpIcon/>}
                        onClick={() => viewSimulationDetails(simulation)}
                        sx={{fontWeight: 'medium'}}
                    >
                        View Details
                    </Button>
                </Box>
            </CardContent>
        </Card>
    )
}