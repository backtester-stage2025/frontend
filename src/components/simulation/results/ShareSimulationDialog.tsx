import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    TextField,
    Tooltip
} from "@mui/material";
import {ContentCopy as ContentCopyIcon} from "@mui/icons-material";

interface ShareSimulationDialogProps {
    shareDialogOpen: boolean;
    closeShareDialog: () => void;
    showShareUrl: boolean;
    shareUrl: string;
    copyToClipboard: () => void;
    confirmShare: () => void;
    isSharing: boolean;
}

export function ShareSimulationDialog({
                                          shareDialogOpen,
                                          closeShareDialog,
                                          showShareUrl,
                                          shareUrl,
                                          copyToClipboard,
                                          confirmShare,
                                          isSharing
                                      }: Readonly<ShareSimulationDialogProps>) {
    return (
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
                            <Tooltip title="Copy to clipboard">
                                <IconButton
                                    onClick={copyToClipboard}
                                    color="primary"
                                    size="small"
                                >
                                    <ContentCopyIcon/>
                                </IconButton>
                            </Tooltip>
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

    )
}