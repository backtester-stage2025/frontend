import {Box, Button, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";

export function NotFound() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '70vh',
                textAlign: 'center',
                p: 3
            }}
        >
            <Typography variant="h1" color="primary" sx={{mb: 2}}>
                404
            </Typography>
            <Typography variant="h4" sx={{mb: 3}}>
                Page Not Found
            </Typography>
            <Typography variant="body1" sx={{mb: 4, maxWidth: 500}}>
                The page you are looking for doesn't exist or has been moved.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/')}
            >
                Back to Home
            </Button>
        </Box>
    );
}