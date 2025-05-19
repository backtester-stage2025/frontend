import {useAuth} from "../../context/AuthContext";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Paper,
    Typography
} from "@mui/material";
import {Login} from "../Login";
import {useSimulationHistory} from "../../hooks/useSimulationHistory.ts";
import {format} from "date-fns";
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import VisibilityIcon from '@mui/icons-material/Visibility';

import {useNavigate} from "react-router-dom";
import {SimulationResult} from "../../model/simulation/SimulationResult.ts";


export function Account() {
    const {isAuthenticated, username, email, userId} = useAuth();
    const {isLoading, isError, simulationHistory} = useSimulationHistory(userId ?? "");
    const navigate = useNavigate();

    const viewSimulationDetails = (simulationResult: SimulationResult) => {
        navigate("/strategy-tester", {
            state: {
                isDialogInitialOpen: false,
                results: simulationResult.userPortfolios,
                request: {
                    stockName: simulationResult.stockSimulationRequest.stockName,
                    startCapital: simulationResult.stockSimulationRequest.startCapital,
                    startDate: new Date(simulationResult.stockSimulationRequest.startDate),
                    endDate: new Date(simulationResult.stockSimulationRequest.endDate)
                }
            }
        });
    };

    if (!isAuthenticated) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <Login/>
            </Box>
        );
    }

    return (
        <Box sx={{maxWidth: 1200, mx: "auto", p: 3}}>
            <Typography variant="h4" component="h1" fontWeight="500" gutterBottom mb={4}>
                Account Overview
            </Typography>

            <Grid container spacing={4}>
                {/*User Profile Card*/}
                <Grid size={{xs: 12, md: 4}}>
                    <Card elevation={3}>
                        <CardContent sx={{p: 3, textAlign: 'center'}}>
                            <Avatar sx={{width: 120, height: 120, mx: "auto", mb: 2, bgcolor: 'primary.main'}}>
                                <PersonIcon sx={{fontSize: 60}}/>
                            </Avatar>
                            <Typography variant="h5" gutterBottom>
                                {username ?? "N/A"}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" gutterBottom>
                                {email ?? "N/A"}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/*Simulation History Section*/}
                <Grid size={{xs: 12, md: 8}}>
                    <Paper elevation={3} sx={{p: 3}}>
                        <Box display="flex" alignItems="center" mb={3}>
                            <HistoryIcon sx={{mr: 1, color: 'primary.main'}}/>
                            <Typography variant="h5">Simulation History</Typography>
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

                        {!isLoading && !isError && simulationHistory?.map((simulation, index) => (
                            <Card key={index} variant="outlined" sx={{mb: 2, p: 0}}>
                                <CardContent sx={{p: 2, "&:last-child": {pb: 2}}}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {simulation.stockSimulationRequest.stockName}
                                        </Typography>
                                        <Chip
                                            size="small"
                                            label={format(new Date(simulation.simulationDate), 'PPP p')}
                                            color="primary"
                                            variant="outlined"
                                        />
                                    </Box>

                                    <Grid container spacing={2}>
                                        <Grid size={{xs: 6, md: 3}}>
                                            <Box display="flex" alignItems="center">
                                                <AttachMoneyIcon fontSize="small"
                                                                 sx={{mr: 0.5, color: 'success.main'}}/>
                                                <Typography variant="body2">
                                                    ${simulation.stockSimulationRequest.startCapital.toLocaleString()}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid size={{xs: 6, md: 3}}>
                                            <Box display="flex" alignItems="center">
                                                <ShowChartIcon fontSize="small" sx={{mr: 0.5, color: 'info.main'}}/>
                                                <Typography variant="body2">
                                                    {simulation.stockSimulationRequest.simulationType}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid size={{xs: 12, md: 6}}>
                                            <Typography variant="body2">
                                                {format(new Date(simulation.stockSimulationRequest.startDate), 'PP')} -
                                                {format(new Date(simulation.stockSimulationRequest.endDate), 'PP')}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                                        <Typography variant="body2" color="text.secondary">
                                            {simulation.userPortfolios.length} days simulated
                                        </Typography>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="primary"
                                            startIcon={<VisibilityIcon/>}
                                            onClick={() => viewSimulationDetails(simulation)}
                                        >
                                            View Details
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}