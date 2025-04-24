import {Box, CircularProgress, Fade, Typography} from "@mui/material";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface LoaderProps {
    message?: string;
}

export function Loader({message = "Loading stock data..."}: Readonly<LoaderProps>) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '40vh',
            }}
        >
            <Box sx={{position: 'relative', marginBottom: 2}}>
                <CircularProgress
                    size={130}
                    thickness={4}
                    sx={{color: 'primary.main'}}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Fade in={true} timeout={500}>
                        <TrendingUpIcon
                            color="primary"
                            sx={{fontSize: 70}}
                        />
                    </Fade>
                </Box>
            </Box>

            <Typography variant="body1" color="text.secondary" align="center">
                {message}
            </Typography>
        </Box>
    );
}