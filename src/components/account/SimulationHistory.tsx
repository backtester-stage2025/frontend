import {Alert, Box, Button, CircularProgress, Grid, Paper, Typography} from "@mui/material";
import HistoryIcon from "@mui/icons-material/History";
import {useSimulationHistory} from "../../hooks/useSimulationHistory.ts";
import {SimulationResult} from "../../model/simulation/SimulationResult.ts";
import {useNavigate} from "react-router-dom";
import {SimulationCard} from "./SimulationCard.tsx";
import {useState} from "react";
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

export function SimulationHistory() {
    const {isLoading, isError, simulationHistory} = useSimulationHistory();

    const navigate = useNavigate();

    const [selectedSimulationsForComparison, setSelectedSimulationsForComparison] = useState<SimulationResult[]>([]);

    const selectSimulationForComparison = (simulation: SimulationResult) => {
        if (selectedSimulationsForComparison.length < 2) {
            setSelectedSimulationsForComparison(prev => [...prev, simulation]);
        }
    }

    const unselectSimulationForComparison = (simulation: SimulationResult) => {
        setSelectedSimulationsForComparison(prev => prev.filter(s => s.id !== simulation.id));
    }

    const viewSimulationDetails = (simulationResult: SimulationResult) => {
        navigate("/strategy-tester", {
            state: {
                isDialogInitialOpen: false,
                results: simulationResult.userPortfolios,
                request: {
                    ...simulationResult.stockSimulationRequest,
                    startDate: new Date(simulationResult.stockSimulationRequest.startDate),
                    endDate: new Date(simulationResult.stockSimulationRequest.endDate)
                }
            }
        });
    };

    const compareSimulations = (simulationResults: SimulationResult[]) => {
        navigate("/compare", {
            state: {
                result1: simulationResults[0],
                result2: simulationResults[1]
            }
        })
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
                        disableSelection={selectedSimulationsForComparison.length === 2 && !selectedSimulationsForComparison.find(s => s.id === simulation.id)}
                    />
                )}
                {selectedSimulationsForComparison.length === 2 && (
                    <Box position="fixed" bottom={16} right={16} zIndex={1000}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => compareSimulations(selectedSimulationsForComparison)}
                            startIcon={<CompareArrowsIcon />}
                            size = {"large"}
                        >
                            Compare Simulations
                        </Button>
                    </Box>
                )}
            </Paper>
        </Grid>
    )
}