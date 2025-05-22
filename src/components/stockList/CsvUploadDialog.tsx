import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControl, InputLabel, MenuItem, Select,
    Snackbar,
    TextField
} from "@mui/material";
import {ChangeEvent, useState} from "react";
import {useUploadCsv} from "../../hooks/useCsvMutations.ts";
import {CurrencyType} from "../../model/StockDetails.ts";
import {SelectChangeEvent} from "@mui/material/Select";

type CsvUploadDialogProps = {
    open: boolean;
    onClose: () => void;
};

export function CsvUploadDialog({open, onClose}: Readonly<CsvUploadDialogProps>) {
    const {sendRequest, isRunning, isError, error} = useUploadCsv();
    const [form, setForm] = useState({
        exchange: "",
        ticker: "",
        companyName: "",
        currencyType: CurrencyType.EUR,
        file: null as File | null
    });
    const [successMsg, setSuccessMsg] = useState("");
    const [showError, setShowError] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm(prev => ({...prev, [name]: value}));
    };

    const handleCurrencyChange = (event: SelectChangeEvent) => {
        setForm(prev => ({
                ...prev,
                currencyType: event.target.value as CurrencyType
            })
        );
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setForm(prev => ({...prev, file}));
    };

    const handleSubmit = () => {
        if (!form.file) return;
        sendRequest(
            {
                file: form.file,
                exchange: form.exchange,
                ticker: form.ticker,
                companyName: form.companyName,
                currencyType: form.currencyType
            },
            {
                onSuccess: (response) => {
                    setSuccessMsg(`Successfully uploaded ${response.stockName} with ${response.dataPointsCount} data points from ${response.startDate} to ${response.endDate}`);
                    setForm({exchange: "", ticker: "", companyName: "", currencyType: CurrencyType.EUR, file: null});
                    onClose();
                },
                onError: () => setShowError(true)
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
                    <Box sx={{display: "flex", flexDirection: "column", gap: 2, mt: 1}}>
                        <TextField
                            label="Exchange"
                            name="exchange"
                            value={form.exchange}
                            onChange={handleChange}
                            fullWidth
                            disabled={isRunning}
                        />
                        <TextField
                            label="Ticker"
                            name="ticker"
                            value={form.ticker}
                            onChange={handleChange}
                            fullWidth
                            disabled={isRunning}
                        />
                        <TextField
                            label="Company Name"
                            name="companyName"
                            value={form.companyName}
                            onChange={handleChange}
                            fullWidth
                            disabled={isRunning}
                        />
                        <FormControl fullWidth>
                            <InputLabel id="currency-type-label" disabled={isRunning}>Currency</InputLabel>
                            <Select
                                labelId="currency-type-label"
                                label="Currency"
                                name="currencyType"
                                value={form.currencyType}
                                onChange={handleCurrencyChange}
                                disabled={isRunning}
                            >
                                {Object.values(CurrencyType).map((currency) => (
                                    <MenuItem key={currency} value={currency}>
                                        {currency}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            variant="outlined"
                            component="label"
                            disabled={isRunning}
                        >
                            {form.file ? form.file.name : "Select CSV File"}
                            <input
                                type="file"
                                accept=".csv"
                                hidden
                                onChange={handleFileChange}
                            />
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={isRunning}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={isRunning || !form.file}
                    >
                        {isRunning ? "Uploading..." : "Upload"}
                    </Button>
                </DialogActions>
            </Dialog>
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