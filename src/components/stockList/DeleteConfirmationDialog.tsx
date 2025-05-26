import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";
import Alert from "@mui/material/Alert";

interface DeleteConfirmationDialog {
    deleteDialogOpen: boolean;
    setDeleteDialogOpen: (open: boolean) => void;
    isRunning: boolean;
    isErrorDeleteCsv: boolean;
    deleteCsvError: Error | null;
    handleDeleteStock: () => void;

}

export function DeleteConfirmationDialog({
                                             deleteDialogOpen,
                                             setDeleteDialogOpen,
                                             isRunning,
                                             isErrorDeleteCsv,
                                             deleteCsvError,
                                             handleDeleteStock
                                         }: Readonly<DeleteConfirmationDialog>) {
    return (
        <Dialog
            open={deleteDialogOpen}
            onClose={() => !isRunning && setDeleteDialogOpen(false)}
        >
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
                <Typography>
                    Are you sure you want to delete this stock data? This action cannot be undone.
                </Typography>
                {isErrorDeleteCsv && deleteCsvError && (
                    <Alert severity="error" sx={{mt: 2}}>
                        {deleteCsvError.message || "An error occurred during deletion."}
                    </Alert>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setDeleteDialogOpen(false)} disabled={isRunning}>Cancel</Button>
                <Button
                    onClick={handleDeleteStock}
                    color="error"
                    variant="contained"
                    disabled={isRunning}
                >
                    {isRunning ? "Deleting..." : "Delete"}
                </Button>
            </DialogActions>
        </Dialog>
    )
}