import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    TextField
} from "@mui/material";
import {ChangeEvent, FocusEvent, useState} from "react";
import {useUploadCsv} from "../../hooks/useCsvMutations.ts";
import {CurrencyType} from "../../model/StockDetails.ts";
import {SelectChangeEvent} from "@mui/material/Select";

type CsvUploadDialogProps = {
    open: boolean;
    onClose: () => void;
};

interface FormErrors {
    exchange: string;
    ticker: string;
    companyName: string;
    file: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function CsvUploadDialog({open, onClose}: Readonly<CsvUploadDialogProps>) {
    const {sendRequest, isRunning, isError, error} = useUploadCsv();
    const [form, setForm] = useState({
        exchange: "",
        ticker: "",
        companyName: "",
        currencyType: CurrencyType.EUR,
        file: null as File | null
    });
    const [errors, setErrors] = useState<FormErrors>({
        exchange: "",
        ticker: "",
        companyName: "",
        file: ""
    });
    const [touched, setTouched] = useState({
        exchange: false,
        ticker: false,
        companyName: false,
        file: false
    });
    const [successMsg, setSuccessMsg] = useState("");
    const [showError, setShowError] = useState(false);

    const validateField = (name: string, value: string | File | null): string => {
        switch (name) {
            case "exchange":
                if (!value) return "Exchange is required";
                if (typeof value == "string" && (value.length < 2 || value.length > 10))
                    return "Exchange must be between 2 and 10 characters";
                return "";

            case "ticker":
                if (!value) return "Ticker is required";
                if (typeof value == "string" && (value.length < 2 || value.length > 10))
                    return "Ticker must be between 2 and 10 characters";
                return "";

            case "companyName":
                if (!value) return "Company name is required";
                if (typeof value == "string") {
                    if (value.length < 2) return "Company name is too short";
                    if (value.length > 100) return "Company name is too long";
                }
                return "";

            case "file":
                if (!value) return "File is required";
                if (value instanceof File) {
                    if (!value.name.endsWith('.csv')) return "File must be a CSV";
                    if (value.size > MAX_FILE_SIZE) return "File must be smaller than 5MB";
                }
                return "";

            default:
                return "";
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm(prev => ({...prev, [name]: value}));

        if (touched[name as keyof typeof touched]) {
            setErrors(prev => ({
                ...prev,
                [name]: validateField(name, value)
            }));
        }
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const {name} = e.target;
        setTouched(prev => ({...prev, [name]: true}));
        setErrors(prev => ({
            ...prev,
            [name]: validateField(name, form[name as keyof typeof form])
        }));
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
        setTouched(prev => ({...prev, file: true}));
        setErrors(prev => ({
            ...prev,
            file: validateField("file", file)
        }));
    };

    const validateForm = (): boolean => {
        const newErrors = {
            exchange: validateField("exchange", form.exchange),
            ticker: validateField("ticker", form.ticker),
            companyName: validateField("companyName", form.companyName),
            file: validateField("file", form.file)
        };

        setErrors(newErrors);
        setTouched({exchange: true, ticker: true, companyName: true, file: true});

        return !Object.values(newErrors).some(error => error !== "");
    };

    const handleSubmit = () => {
        if (!validateForm()) return;

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
                    setSuccessMsg(`Successfully uploaded ${response.filename} with ${response.dataPointsCount} data points from ${response.startDate} to ${response.endDate}`);
                    setForm({exchange: "", ticker: "", companyName: "", currencyType: CurrencyType.EUR, file: null});
                    setTouched({exchange: false, ticker: false, companyName: false, file: false});
                    setErrors({exchange: "", ticker: "", companyName: "", file: ""});
                    onClose();
                },
                onError: () => setShowError(true)
            }
        );
    };

    const handleCloseSnackbar = () => setSuccessMsg("");
    const handleCloseError = () => setShowError(false);

    const isFormValid = !Object.values(errors).some(err => err !== "");

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
                            onBlur={handleBlur}
                            fullWidth
                            disabled={isRunning}
                            error={touched.exchange && !!errors.exchange}
                            helperText={touched.exchange && errors.exchange}
                            required
                        />
                        <TextField
                            label="Ticker"
                            name="ticker"
                            value={form.ticker}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                            disabled={isRunning}
                            error={touched.ticker && !!errors.ticker}
                            helperText={touched.ticker && errors.ticker}
                            required
                        />
                        <TextField
                            label="Company Name"
                            name="companyName"
                            value={form.companyName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                            disabled={isRunning}
                            error={touched.companyName && !!errors.companyName}
                            helperText={touched.companyName && errors.companyName}
                            required
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
                            color={touched.file && errors.file ? "error" : "primary"}
                        >
                            {form.file ? form.file.name : "Select CSV File"}
                            <input
                                type="file"
                                accept=".csv"
                                hidden
                                onChange={handleFileChange}
                            />
                        </Button>
                        {touched.file && errors.file && (
                            <FormHelperText error>{errors.file}</FormHelperText>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={isRunning}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={isRunning || !isFormValid}
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