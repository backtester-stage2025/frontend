import {Alert, Box, Button, CircularProgress, Grid, Paper, Typography} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import {useShareSimulation, useSimulationHistory} from "../../hooks/useSimulationHistory.ts";
import {useNavigate} from "react-router-dom";
import {SimulationCard} from "./SimulationCard.tsx";
import {SimulationSummary} from "../../model/simulation/SimulationSummary.ts";
import {useState} from "react";
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import {UUID} from "../../model/UUID.ts";

export function SimulationHistory() {
    const {isLoading, isError, simulationHistory} = useSimulationHistory();
    const {
        sendRequest: shareSimulationRequest,
        isRunning: isSharing,
        error: sharingError
    } = useShareSimulation();

    const navigate = useNavigate();

    const MAX_SELECT_LENGTH = 5;
    const MIN_SELECT_LENGTH = 2;

    const [selectedSimulationsForComparison, setSelectedSimulationsForComparison] = useState<SimulationSummary[]>([]);

    const selectSimulationForComparison = (simulation: SimulationSummary) => {
        if (selectedSimulationsForComparison.length < MAX_SELECT_LENGTH) {
            setSelectedSimulationsForComparison(prev => [...prev, simulation]);
        }
    }

    const unselectSimulationForComparison = (simulation: SimulationSummary) => {
        setSelectedSimulationsForComparison(prev => prev.filter(s => s.id !== simulation.id));
    }

    const viewSimulationDetails = (simulationResult: SimulationSummary) => {
        navigate(`/strategy-tester?simulationId=${simulationResult.id}&allowOpenForm=false`, {});
    };

    const compareSimulations = (simulationResults: SimulationSummary[]) => {
        navigate("/compare", {
            state: {
                results: simulationResults
            }
        })
    }

    const shareSimulation = (id: UUID) => {
        shareSimulationRequest(id as string);
    }

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
                ).map((simulation) =>
                    <SimulationCard
                        key={simulation.id}
                        simulation={simulation}
                        viewSimulationDetails={viewSimulationDetails}
                        isSelected={!!selectedSimulationsForComparison.find(s => s.id === simulation.id)}
                        addSimulation={selectSimulationForComparison}
                        removeSimulation={unselectSimulationForComparison}
                        disableSelection={selectedSimulationsForComparison.length === MAX_SELECT_LENGTH && !selectedSimulationsForComparison.find(s => s.id === simulation.id)}
                        shareSimulation={shareSimulation}
                    />
                )}
                {selectedSimulationsForComparison.length >= MIN_SELECT_LENGTH && (
                    <Box position="fixed" bottom={16} right={16} zIndex={1000}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => compareSimulations(selectedSimulationsForComparison)}
                            startIcon={<CompareArrowsIcon/>}
                            size={"large"}
                        >
                            Compare Simulations
                        </Button>
                    </Box>
                )}
            </Paper>
        </Grid>
    )
}