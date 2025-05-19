import {useAuth} from "../../context/AuthContext";
import {Box, Grid, Typography} from "@mui/material";
import {Login} from "../Login";
import {UserProfile} from "./UserProfile.tsx";
import {SimulationHistory} from "./SimulationHistory.tsx";


export function Account() {
    const {isAuthenticated} = useAuth();

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
                <UserProfile/>

                <SimulationHistory/>
            </Grid>
        </Box>
    );
}