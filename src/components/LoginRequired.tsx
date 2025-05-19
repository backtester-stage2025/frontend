import {Box, Button, Stack, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";
import GoogleIcon from "@mui/icons-material/Google";
import {useGoogleAuth} from "../hooks/useGoogleAuth.ts";

export function LoginRequired() {
    const navigate = useNavigate();
    const {login} = useGoogleAuth();

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
            <LockIcon color="primary" sx={{fontSize: 64, mb: 2}}/>

            <Typography variant="h4" sx={{mb: 2}}>
                Login Required
            </Typography>

            <Typography variant="body1" sx={{mb: 4, maxWidth: 500}}>
                Please log in to access the stock strategy tester.
            </Typography>

            <Stack direction="row" spacing={2}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<GoogleIcon/>}
                    onClick={() => login()}
                >
                    Login with Google
                </Button>

                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate('/')}
                >
                    Back to Home
                </Button>
            </Stack>
        </Box>
    );
}