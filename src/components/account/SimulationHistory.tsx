import {Alert, Box, CircularProgress, Grid, Paper, Typography} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import {useSimulationHistory} from "../../hooks/useSimulationHistory.ts";
import {useNavigate} from "react-router-dom";
import {SimulationCard} from "./SimulationCard.tsx";
import {SimulationSummary} from "../../model/simulation/SimulationSummary.ts";

export function SimulationHistory() {
    const {isLoading, isError, simulationHistory} = useSimulationHistory();

    const navigate = useNavigate();

    const viewSimulationDetails = (simulationResult: SimulationSummary) => {
        navigate("/strategy-tester", {
            state: {
                simulationId: simulationResult.simulationId,
                isDialogInitialOpen: false,
                /*request: {
                    ...simulationResult.stockSimulationRequest,
                    startDate: new Date(simulationResult.stockSimulationRequest.startDate),
                    endDate: new Date(simulationResult.stockSimulationRequest.endDate)
                }*/
            }
        });
    };
    return (
        <Grid size={{xs: 12, md: 8}}>
            <Paper elevation={3} sx={{p: 3, borderRadius: 2}}>
                <Box display="flex" alignItems="center" mb={3}>
                    <HistoryIcon sx={{mr: 1, color: 'primary.main'}}/>
                    <Typography variant="h5" fontWeight="medium">Simulation History</Typography>
                </Box>

                {isLoading && (
                    <Box display="flex" justifyContent="center" p={4}>
                        <CircularProgress/>
                    </Box>
                )}

                {isError && (
                    <Alert severity="error" sx={{my: 2}}>
                        Unable to load simulation history. Please try again later.
                    </Alert>
                )}

                {!isLoading && !isError && simulationHistory?.length === 0 && (
                    <Alert severity="info" sx={{my: 2}}>
                        You haven't run any simulations yet.
                    </Alert>
                )}

                {!isLoading && !isError && simulationHistory?.sort((a, b) =>
                    new Date(b.simulationDate).getTime() - new Date(a.simulationDate).getTime()
                ).map((simulation, index) =>
                    <SimulationCard key={index} simulation={simulation} viewSimulationDetails={viewSimulationDetails}/>
                )}
            </Paper>
        </Grid>
    )
}