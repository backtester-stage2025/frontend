import {Box, Button, Paper, Typography} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ErrorOverlayProps {
    isOpen: boolean
    error: Error | null
    setIsOpen: (isOpen: boolean) => void
}

export function ErrorOverlay({isOpen, error, setIsOpen}: Readonly<ErrorOverlayProps>){
    if (!isOpen) return null;

    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                zIndex: 1301,
                pointerEvents: 'none',
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    mt: 2,
                    mx: 2,
                    p: 2,
                    bgcolor: '#FFF5F5',
                    borderLeft: '4px solid #F56565',
                    position: 'relative',
                    width: '100%',
                    maxWidth: '600px',
                    pointerEvents: 'auto', // clickable
                }}
            >
                <Typography color="error" variant="h6" sx={{ pr: 4 }}>
                    {error?.message}
                </Typography>
                <Button
                    onClick={() => setIsOpen(false)}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        minWidth: 'auto',
                        color: '#DD0000',
                    }}
                >
                    <CloseIcon />
                </Button>
            </Paper>
        </Box>
    )
}