import {Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar} from "@mui/material";
import {useState} from "react";
import {useUploadCsv} from "../../../hooks/useCsvMutations.ts";
import {CurrencyType} from "../../../model/StockDetails.ts";
import {OverwriteTableDialog} from "./OverwriteTableDialog.tsx";
import {CsvUploadForm} from "./CsvUploadForm.tsx";

type CsvUploadDialogProps = {
    open: boolean;
    onClose: () => void;
};

export function CsvUploadDialog({open, onClose}: Readonly<CsvUploadDialogProps>) {
    const {sendRequest, isRunning, isError, error} = useUploadCsv();

    const [showOverwriteDialog, setShowOverwriteDialog] = useState(false);
    const [lastFormData, setLastFormData] = useState<null | {
        exchange: string;
        ticker: string;
        companyName: string;
        currencyType: CurrencyType;
        file: File;
    }>(null);

    const [successMsg, setSuccessMsg] = useState("");
    const [showError, setShowError] = useState(false);

    const handleSubmit = (formData: typeof lastFormData) => {
        if (!formData?.file) return;

        setLastFormData(formData);

        sendRequest(
            {...formData, overwrite: false},
            {
                onSuccess: (response) => {
                    setSuccessMsg(
                        `Successfully uploaded ${response.filename} with ${response.dataPointsCount} data points from ${response.startDate} to ${response.endDate}`
                    );
                    onClose();
                },
                onError: (e) => {
                    if (e?.message.includes("already exists. Please use a different name.")) {
                        setShowOverwriteDialog(true);
                    } else {
                        setShowError(true);
                    }
                },
            }
        );
    };

    const handleOverwriteConfirm = () => {
        setShowOverwriteDialog(false);
        if (!lastFormData?.file) return;

        sendRequest(
            {...lastFormData, overwrite: true},
            {
                onSuccess: (response) => {
                    setSuccessMsg(
                        `Successfully replaced table with ${response.filename} containing ${response.dataPointsCount} data points.`
                    );
                    onClose();
                },
                onError: () => setShowError(true),
            }
        );
    };

    const handleCloseSnackbar = () => setSuccessMsg("");
    const handleCloseError = () => setShowError(false);

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>Upload CSV</DialogTitle>
                <DialogContent>
                    <CsvUploadForm disabled={isRunning} onSubmit={handleSubmit}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={isRunning}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            <OverwriteTableDialog
                open={showOverwriteDialog}
                onConfirm={handleOverwriteConfirm}
                onCancel={() => setShowOverwriteDialog(false)}
            />
            <Snackbar
                open={!!successMsg}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{width: '100%', mt: 6}}>
                    {successMsg}
                </Alert>
            </Snackbar>
            <Snackbar
                open={isError && showError}
                autoHideDuration={6000}
                onClose={handleCloseError}
                anchorOrigin={{vertical: 'top', horizontal: 'center'}}
            >
                <Alert onClose={handleCloseError} severity="error" sx={{width: '100%', mt: 6}}>
                    Error uploading CSV: {error?.message ?? "Unknown error"}
                </Alert>
            </Snackbar>
        </>
    );
}