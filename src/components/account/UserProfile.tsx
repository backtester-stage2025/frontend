import {Avatar, Box, Card, CardContent, CircularProgress, Divider, Typography} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import {useAuth} from "../../context/AuthContext.tsx";
import {useSimulationHistory} from "../../hooks/useSimulationHistory.ts";

export function UserProfile() {
    const {username, email, picture} = useAuth();
    const {isLoading, simulationHistory} = useSimulationHistory();

    return (
        <Card elevation={3}>
            <CardContent sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
            }}>
                <Avatar
                    src={picture}
                    sx={{
                        width: 120,
                        height: 120,
                        mx: "auto",
                        mb: 3,
                        bgcolor: 'primary.main',
                        boxShadow: 3
                    }}
                >
                    {!picture && <PersonIcon sx={{fontSize: 60}}/>}
                </Avatar>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                    {username ?? "N/A"}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                    {email ?? "N/A"}
                </Typography>

                <Divider sx={{my: 3}}/>

                <Box sx={{textAlign: 'left', mt: 2}}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Simulations run:
                    </Typography>
                    <Typography variant="h6" fontWeight="medium">
                        {isLoading ?
                            <Box display="flex" justifyContent="center" p={4}>
                                <CircularProgress/>
                            </Box>
                            : simulationHistory?.length ?? 0
                        }
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    )
}
