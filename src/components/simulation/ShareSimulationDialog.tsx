import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Snackbar,
    TextField
} from "@mui/material";
import {useState} from "react";
import {useShareSimulation} from "../../hooks/useSimulationHistory.ts";

interface ShareSimulationDialogProps {
    shareDialogOpen: boolean;
    setShareDialogOpen: (shareDialogOpen: boolean) => void;
    simulationId: string | null;
}

export function ShareSimulationDialog({
                                          shareDialogOpen,
                                          setShareDialogOpen,
                                          simulationId
                                      }: Readonly<ShareSimulationDialogProps>) {
    const [showShareUrl, setShowShareUrl] = useState(false);
    const [shareUrl, setShareUrl] = useState("");

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

    const closeShareDialog = () => {
        setShareDialogOpen(false);
        setShowShareUrl(false);
        setShareUrl("");
    };

    const {
        sendRequest: shareSimulation,
        isRunning: isSharing,
        error: sharingError
    } = useShareSimulation();

    const confirmShare = () => {
        if (!simulationId) return;

        shareSimulation(simulationId, {
            onSuccess: () => {
                const url = `${window.location.origin}/strategy-tester?id=${simulationId}&openForm=false`;
                setShareUrl(url);
                setShowShareUrl(true);

                setSnackbarMessage("Simulation shared successfully!");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
            },
            onError: () => {
                setSnackbarMessage(sharingError?.message ?? "Failed to share simulation. Please try again.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
                setShareDialogOpen(false);
            }
        });
    };

    return (
        <>
            <Dialog
                open={shareDialogOpen}
                onClose={closeShareDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {showShareUrl ? "Simulation Shared Successfully" : "Share Simulation"}
                </DialogTitle>
                <DialogContent>
                    {!showShareUrl ? (
                        <DialogContentText>
                            This will make your simulation publicly accessible to anyone with the link.
                            Anyone will be able to view your simulation results, configuration, and performance metrics.
                            <br/><br/>
                            Do you want to proceed with sharing this simulation?
                        </DialogContentText>
                    ) : (
                        <>
                            <DialogContentText sx={{mb: 2}}>
                                Your simulation has been shared successfully! Use the link below to share it with
                                others:
                            </DialogContentText>
                            <Box sx={{display: 'flex', gap: 1, alignItems: 'flex-end'}}>
                                <TextField
                                    fullWidth
                                    value={shareUrl}
                                    slotProps={{
                                        input: {
                                            readOnly: true,
                                        }
                                    }}
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    {!showShareUrl ? (
                        <>
                            <Button onClick={closeShareDialog}>
                                Cancel
                            </Button>
                            <Button
                                onClick={confirmShare}
                                variant="contained"
                                disabled={isSharing}
                            >
                                {isSharing ? "Sharing..." : "Yes, Share Simulation"}
                            </Button>
                        </>
                    ) : (
                        <Button onClick={closeShareDialog} variant="contained">
                            Close
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    sx={{width: '100%', mt: 6}}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>

    )
}