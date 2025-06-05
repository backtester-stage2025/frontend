import {Alert, Snackbar} from "@mui/material";

interface CsvUploadSuccessBarProps {
    message?: string;
    onClose: () => void;
}

export function CsvUploadSuccessBar({message, onClose}: Readonly<CsvUploadSuccessBarProps>) {
    return (
        <Snackbar
            open={!!message}
            autoHideDuration={6000}
            onClose={onClose}
            anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        >
            <Alert onClose={onClose} severity="success" sx={{width: '100%', mt: 6}}>
                {message}
            </Alert>
        </Snackbar>
    )
}