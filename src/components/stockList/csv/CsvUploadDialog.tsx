import {
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
    Select
} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {CsvUploadSuccessBar} from "./CsvUploadSuccessBar.tsx";
import {CsvUploadErrorBar} from "./CsvUploadErrorBar.tsx";
import {OverwriteTableDialog} from "./OverwriteTableDialog.tsx";
import {CurrencyType} from "../../../model/CurrencyType.ts";
import {TOOLTIP_MESSAGES} from "../../../constants/tooltipMessages.ts";
import {useUploadCsv} from "../../../hooks/useCsvMutations.ts";
import {z} from "zod";
import {useState} from "react";
import {RequiredTextInput} from "./RequiredTextInput.tsx";
import {csvUploadSchema} from "./csvUploadSchema.ts";

type CsvUploadDialogProps = {
    open: boolean;
    onClose: () => void;
};


type FormData = z.infer<typeof csvUploadSchema>;

export function CsvUploadDialog({open, onClose}: Readonly<CsvUploadDialogProps>) {
    const {sendRequest, isRunning, isError, error} = useUploadCsv();

    const [successMsg, setSuccessMsg] = useState("");
    const [showError, setShowError] = useState(false);
    const [showOverwriteDialog, setShowOverwriteDialog] = useState(false);

    const {control, register, handleSubmit, reset, watch, getValues, formState: {errors}} = useForm<FormData>({
        resolver: zodResolver(csvUploadSchema),
        defaultValues: {
            exchange: "",
            ticker: "",
            companyName: "",
            currencyType: CurrencyType.EUR,
            file: undefined
        }
    });

    const watchFile = watch("file");

    const submit = (overwriteEnabled: boolean) => {
        const data = getValues();
        const file = data.file.item(0);
        if (!file) return;

        sendRequest(
            { ...data, file: file, overwrite: overwriteEnabled },
            {
                onSuccess: (res) => {
                    const msg = overwriteEnabled
                        ? `Successfully replaced table with ${res.filename} containing ${res.dataPointsCount} data points.`
                        : `Successfully uploaded ${res.filename} with ${res.dataPointsCount} data points from ${res.startDate} to ${res.endDate}`;
                    setSuccessMsg(msg);
                    reset();
                    onClose();
                },
                onError: (err) => {
                    const isOverwriteConflict = err?.message.includes("continue");
                    if (isOverwriteConflict && !overwriteEnabled) setShowOverwriteDialog(true);
                    else setShowError(true);
                }
            }
        );
    };

    const onSubmit = (data: FormData) => {
        const file = data.file.item(0);
        if (!file) return;
        submit(false);
    };

    const handleOverwriteConfirm = () => {
        setShowOverwriteDialog(false);
        submit(true);
    };

    const handleCloseSnackbar = () => setSuccessMsg("");
    const handleCloseError = () => setShowError(false);

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>Upload CSV</DialogTitle>
                <DialogContent>
                    <Box sx={{display: "flex", flexDirection: "column", gap: 2, mt: 1}}>

                        <RequiredTextInput
                            label={"Exchange"} registration={register("exchange")} disabled={isRunning}
                            error={errors.exchange} tooltip={TOOLTIP_MESSAGES.csvUpload.exchange}
                        />

                        <RequiredTextInput
                            label={"Ticker"} registration={register("ticker")} disabled={isRunning}
                            error={errors.ticker} tooltip={TOOLTIP_MESSAGES.csvUpload.ticker}
                        />

                        <RequiredTextInput
                            label={"Company Name"} registration={register("companyName")} disabled={isRunning}
                            error={errors.companyName} tooltip={TOOLTIP_MESSAGES.csvUpload.companyName}
                        />

                        <FormControl fullWidth error={!!errors.currencyType}>
                            <InputLabel>Currency</InputLabel>
                            <Controller
                                name="currencyType"
                                control={control}
                                render={({field}) => (
                                    <Select label="Currency" {...field} disabled={isRunning}>
                                        {Object.values(CurrencyType).map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                )}
                            />
                            <FormHelperText>{errors.currencyType?.message}</FormHelperText>
                        </FormControl>
                        <FormControl fullWidth error={!!errors.file}>
                            <Button
                                variant="outlined"
                                component="label"
                                disabled={isRunning}
                                color={errors.file ? "error" : "primary"}
                            >
                                {watchFile?.item(0)?.name ?? "Select CSV File"}
                                <input type="file" accept=".csv" hidden={true} {...register("file")}/>
                            </Button>

                            <FormHelperText><>{errors.file?.message}</></FormHelperText>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit(onSubmit)} variant="contained" disabled={isRunning}>
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>

            <CsvUploadSuccessBar message={successMsg} onClose={handleCloseSnackbar}/>
            <CsvUploadErrorBar open={showError && isError} onClose={handleCloseError} errorMessage={(error?.message) ?? "Unknown error"}/>
            <OverwriteTableDialog
                open={showOverwriteDialog}
                onCancel={() => setShowOverwriteDialog(false)}
                onConfirm={handleOverwriteConfirm}
            />
        </>
    );
}