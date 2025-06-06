import {Alert} from "@mui/material";

interface AlertProps {
    message: string;
    maxWidth?: number | string;
}

export function ErrorAlert({message}: Readonly<AlertProps>) {
    return (
        <Alert severity="error" sx={{mt: 2, width: "100%"}}>
            {message}
        </Alert>
    );
}

export function WarningAlert({message}: Readonly<AlertProps>) {
    return (
        <Alert severity="warning" sx={{mt: 2, width: "100%"}}>
            {message}
        </Alert>
    );
}

export function InfoAlert({message, maxWidth = "100%"}: Readonly<AlertProps>) {
    return (
        <Alert severity="info" sx={{mt: 2, maxWidth}}>
            {message}
        </Alert>
    );
}