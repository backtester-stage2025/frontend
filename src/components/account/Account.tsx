import {useAuth} from "../../context/AuthContext";
import {Box, Typography} from "@mui/material";
import {Login} from "../Login";
import {useSimulationHistory} from "../../hooks/useSimulationHistory.ts";

export function Account() {
    const {isAuthenticated, username, email, userId} = useAuth();

    const {isLoading, isError, simulationHistory} = useSimulationHistory(userId ?? "");

    if (!isAuthenticated) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <Login/>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Account
            </Typography>
            <Typography variant="body1">
                <strong>Name:</strong> {username ?? "N/A"}
            </Typography>
            <Typography variant="body1">
                <strong>Email:</strong> {email ?? "N/A"}
            </Typography>
        </Box>
    );
}