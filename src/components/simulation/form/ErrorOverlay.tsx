import {Box, Paper, Typography} from "@mui/material";
import {CloseButton} from "../../util/CloseButton.tsx";

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
                <CloseButton onClose={() => {setIsOpen(false)}} color="#D00"/>
                <Typography color="error" variant="h6" sx={{ pr: 4 }}>
                    {error?.message}
                </Typography>
            </Paper>
        </Box>
    )
}