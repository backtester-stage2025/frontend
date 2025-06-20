import {Box, Button, Card, CardContent, Chip, Divider, Grid, Stack, Typography} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import {format} from "date-fns";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import InsightsIcon from "@mui/icons-material/Insights";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {calculateReturnPercentage, formatCurrency} from "../../services/formatService.ts";
import {SimulationSummary} from "../../model/simulation/SimulationSummary.ts";
import {UUID} from "../../model/UUID.ts";
import ShareIcon from '@mui/icons-material/Share';
import {CompareCheckbox} from "./CompareCheckbox.tsx";
import {simulationTypeOptions} from "../../model/request/SimulationTypes.ts";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import {useDeleteSimulation} from "../../hooks/useSimulationHistory";

interface SimulationCardProps {
    simulation: SimulationSummary;
    viewSimulationDetails: (simulation: SimulationSummary) => void;
    isSelected: boolean;
    addSimulation: (result: SimulationSummary) => void;
    removeSimulation: (result: SimulationSummary) => void;
    disableSelection: boolean;
    shareSimulation: (id: UUID) => void;
    onDelete?: (id: UUID) => void;
}

export function SimulationCard({
                                   simulation,
                                   viewSimulationDetails,
                                   isSelected,
                                   addSimulation,
                                   removeSimulation,
                                   disableSelection,
                                   shareSimulation,
                                   onDelete
                               }: Readonly<SimulationCardProps>) {
    const returnPercentage = calculateReturnPercentage(simulation);
    const finalValue = simulation.latestPortfolioValue || 0;
    const startCapital = simulation.stockSimulationRequest.startCapital;
    const isPositiveReturn = parseFloat(returnPercentage) >= 0;
    const currencyType = simulation.currencyType ?? "EUR";

    const absoluteGain = Math.abs(finalValue - startCapital);

    const {sendRequest: deleteSimulation, isRunning: isDeleting} = useDeleteSimulation();

    const handleDelete = () => {
        deleteSimulation(simulation.id, {
            onSuccess: () => {
                if (onDelete) onDelete(simulation.id);
            }
        });
    };

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
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                    <Box>
                        <Typography variant="subtitle1" fontWeight="bold" mb={0.5}>
                            Stocks:
                        </Typography>
                        <Stack spacing={0.5}>
                            {simulation.stockSimulationRequest.stockNames.map((stock) => (
                                <Typography key={stock} variant="body2" sx={{display: 'flex', alignItems: 'center'}}>
                                    • {stock}
                                </Typography>
                            ))}
                        </Stack>
                    </Box>
                    <Stack spacing={1} alignItems="flex-end">
                        <CompareCheckbox
                            disabled={disableSelection}
                            checked={isSelected}
                            onSelect={() => addSimulation(simulation)}
                            onUnselect={() => removeSimulation(simulation)}
                        />
                        <Chip
                            size="small"
                            icon={<CalendarTodayIcon fontSize="small"/>}
                            label={format(new Date(simulation.simulationDate), 'PPP p')}
                            color="primary"
                            variant="outlined"
                            sx={{mb: 1, p: 0.5}}
                        />
                    </Stack>
                </Box>

                <Divider sx={{mb: 2}}/>

                <Grid container spacing={2}>
                    <Grid size={{xs: 12, sm: 6}}>
                        <Stack spacing={1.5}>
                            <Box display="flex" alignItems="center">
                                <AttachMoneyIcon fontSize="small"
                                                 sx={{mr: 1, color: 'info.main'}}/>
                                <Typography variant="body2">
                                    Initial: {formatCurrency(startCapital, currencyType)}
                                </Typography>
                            </Box>

                            <Box display="flex" alignItems="center">
                                <AccountBalanceWalletIcon fontSize="small" sx={{
                                    mr: 1,
                                    color: isPositiveReturn ? 'success.main' : 'error.main'
                                }}/>
                                <Typography variant="body2" fontWeight="medium">
                                    Final: {formatCurrency(finalValue, currencyType)}
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
                                    {simulationTypeOptions.find(
                                        s => s.value === simulation.stockSimulationRequest.simulationType
                                    )?.label ?? "Unknown simulation type"}
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
                                {isPositiveReturn ? "+" : "-"} {formatCurrency(absoluteGain, currencyType)}
                            </Typography>
                        </Box>
                    </Box>
                    <Stack direction="row" spacing={1}>
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
                        <Button
                            size="small"
                            variant="outlined"
                            color="secondary"
                            startIcon={<ShareIcon/>}
                            onClick={() => shareSimulation(simulation.id)}
                            sx={{fontWeight: 'medium'}}
                        >
                            Share
                        </Button>
                        <IconButton
                            aria-label="delete"
                            color="error"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            sx={{ml: 0.5}}
                        >
                            <DeleteIcon/>
                        </IconButton>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    )
}
