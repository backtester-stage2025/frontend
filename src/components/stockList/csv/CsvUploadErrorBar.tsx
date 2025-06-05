import {Alert, Snackbar} from "@mui/material";

interface CsvUploadErrorBarProps {
    open: boolean;
    onClose: () => void;
    errorMessage: string;
}

export function CsvUploadErrorBar({open, onClose, errorMessage}: Readonly<CsvUploadErrorBarProps>){
    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={onClose}
            anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        >
            <Alert
                onClose={onClose}
                severity="error"
                sx={{width: '100%', mt: 6}}
            >
                {/* Split lines */}
                {errorMessage.split('\n').map((line) => (
                    <span key={line}>{line}<br/></span>
                ))}
            </Alert>
        </Snackbar>
    )
}