import { useAuth } from "../../context/AuthContext";
import { Typography, Box } from "@mui/material";
import { Login } from "../Login";

export function Account() {
    const { isAuthenticated, username, email } = useAuth();

    if (!isAuthenticated) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <Login />
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