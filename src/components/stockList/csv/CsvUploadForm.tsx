import {Box, Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField,} from "@mui/material";
import {ChangeEvent, FocusEvent, useState} from "react";
import {SelectChangeEvent} from "@mui/material/Select";
import {CurrencyType} from "../../../model/StockDetails.ts";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

interface CsvUploadFormProps {
    disabled: boolean;
    onSubmit: (formData: {
        exchange: string;
        ticker: string;
        companyName: string;
        currencyType: CurrencyType;
        file: File;
    }) => void;
}

interface FormErrors {
    exchange: string;
    ticker: string;
    companyName: string;
    file: string;
}

export function CsvUploadForm({disabled, onSubmit}: Readonly<CsvUploadFormProps>) {
    const [form, setForm] = useState({
        exchange: "",
        ticker: "",
        companyName: "",
        currencyType: CurrencyType.EUR,
        file: null as File | null,
    });

    const [errors, setErrors] = useState<FormErrors>({
        exchange: "",
        ticker: "",
        companyName: "",
        file: "",
    });

    const [touched, setTouched] = useState({
        exchange: false,
        ticker: false,
        companyName: false,
        file: false,
    });

    const validateField = (name: string, value: string | File | null): string => {
        switch (name) {
            case "exchange":
                if (!value) return "Exchange is required";
                if (typeof value === "string" && (value.length < 2 || value.length > 10))
                    return "Exchange must be between 2 and 10 characters";
                return "";

            case "ticker":
                if (!value) return "Ticker is required";
                if (typeof value === "string" && (value.length < 2 || value.length > 10))
                    return "Ticker must be between 2 and 10 characters";
                return "";

            case "companyName":
                if (!value) return "Company name is required";
                if (typeof value === "string") {
                    if (value.length < 2) return "Company name is too short";
                    if (value.length > 100) return "Company name is too long";
                }
                return "";

            case "file":
                if (!value) return "File is required";
                if (value instanceof File) {
                    if (!value.name.endsWith(".csv")) return "File must be a CSV";
                    if (value.size > MAX_FILE_SIZE) return "File must be smaller than 5MB";
                }
                return "";

            default:
                return "";
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm((prev) => ({...prev, [name]: value}));

        if (touched[name as keyof typeof touched]) {
            setErrors((prev) => ({
                ...prev,
                [name]: validateField(name, value),
            }));
        }
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const {name} = e.target;
        setTouched((prev) => ({...prev, [name]: true}));
        setErrors((prev) => ({
            ...prev,
            [name]: validateField(name, form[name as keyof typeof form]),
        }));
    };

    const handleCurrencyChange = (event: SelectChangeEvent) => {
        setForm((prev) => ({
            ...prev,
            currencyType: event.target.value as CurrencyType,
        }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setForm((prev) => ({...prev, file}));
        setTouched((prev) => ({...prev, file: true}));
        setErrors((prev) => ({
            ...prev,
            file: validateField("file", file),
        }));
    };

    const validateForm = (): boolean => {
        const newErrors = {
            exchange: validateField("exchange", form.exchange),
            ticker: validateField("ticker", form.ticker),
            companyName: validateField("companyName", form.companyName),
            file: validateField("file", form.file),
        };
        setErrors(newErrors);
        setTouched({exchange: true, ticker: true, companyName: true, file: true});
        return !Object.values(newErrors).some((error) => error !== "");
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        if (!form.file) return;
        onSubmit({...form, file: form.file});
    };

    const isFormValid = !Object.values(errors).some((err) => err !== "");

    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 2, mt: 1}}>
            <TextField
                label="Exchange"
                name="exchange"
                value={form.exchange}
                onChange={handleChange}
                onBlur={handleBlur}
                fullWidth
                disabled={disabled}
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
                disabled={disabled}
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
                disabled={disabled}
                error={touched.companyName && !!errors.companyName}
                helperText={touched.companyName && errors.companyName}
                required
            />
            <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select value={form.currencyType} onChange={handleCurrencyChange} disabled={disabled} label="Currency">
                    {Object.values(CurrencyType).map((c) => (
                        <MenuItem key={c} value={c}>
                            {c}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Button variant="outlined" component="label" disabled={disabled}>
                Select CSV file
                <input type="file" hidden onChange={handleFileChange}/>
            </Button>

            {touched.file && errors.file && (
                <FormHelperText error>{errors.file}</FormHelperText>
            )}

            {touched.file && errors.file && (
                <FormHelperText error>{errors.file}</FormHelperText>
            )}

            <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={disabled || !isFormValid}
            >
                Upload
            </Button>
        </Box>
    );
}