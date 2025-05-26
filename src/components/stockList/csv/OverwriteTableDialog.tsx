import {Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";

interface OverwriteTableDialog {
    open: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function OverwriteTableDialog({open, onConfirm, onCancel}: Readonly<OverwriteTableDialog>) {
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>Table Already Exists</DialogTitle>
            <DialogContent>
                <Alert severity="warning">
                    A table with this name already exists. Do you want to replace it?
                </Alert>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Button onClick={onConfirm} variant="contained" color="error">Replace Table</Button>
            </DialogActions>
        </Dialog>
    );
}
