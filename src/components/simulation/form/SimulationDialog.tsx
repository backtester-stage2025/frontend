import {IndicatorDetails, SimulationRequest} from "../../../model/request/SimulationRequest.ts";
import {useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import {enGB} from "date-fns/locale";
import {useStockData} from "../../../hooks/useStockData.ts";
import {FieldController, FormField} from "./FormController.tsx";
import {simulationTypeOptions} from "../../../model/request/SimulationTypes.ts";
import {useEffect, useState} from "react";
import {ErrorOverlay} from "./ErrorOverlay.tsx";
import {simulationRequestSchema} from "./SimulationRequestSchema.ts";
import {CloseButton} from "../../util/CloseButton.tsx";
import {useBrokers} from "../../../hooks/useBrokers.ts";
import {Loader} from "../../util/Loader.tsx";
import {Broker} from "../../../model/Broker.ts";
import {Indicator} from "../../../model/request/Indicator.ts";
import {IndicatorForm} from "./IndicatorForm.tsx";

interface BuyAndHoldSimulationProps {
    isOpen: boolean
    onSubmit: (data: SimulationRequest) => void
    onClose: () => void
    isServerError: boolean
    serverError: Error | null
}

export function SimulationDialog({
                                     isOpen,
                                     onSubmit,
                                     onClose,
                                     serverError
                                 }: Readonly<BuyAndHoldSimulationProps>) {
    const {stockData} = useStockData();
    const {isLoading: isLoadingBrokers, isError: isErrorLoadingBrokers, brokers} = useBrokers();
    const [error, setError] = useState<Error | null>(serverError ?? null);
    const [showErrorOverlay, setShowErrorOverlay] = useState<boolean>(!!serverError);

    useEffect(() => {
        setError(serverError ?? null);
        setShowErrorOverlay(!!serverError);
    }, [serverError]);

    const {control, handleSubmit, formState: {errors}} = useForm<SimulationRequest>({
        resolver: zodResolver(simulationRequestSchema),
        defaultValues: {
            brokerName: '',
            stockName: '',
            startDate: new Date(),
            endDate: new Date(),
            startCapital: 10000,
            simulationType: simulationTypeOptions[0].value,
            riskTolerance: 20,
            indicators: []
        }
    });

    const {fields: indicatorFields, append, remove, update} = useFieldArray({
        control,
        name: "indicators"
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    if (isLoadingBrokers) {
        return <Loader/>
    }
    if (isErrorLoadingBrokers) {
        return (
            <Alert severity="error" sx={{mt: 2, width: "100%"}}>
                Error loading brokers
            </Alert>
        );
    }

    const fields: FormField[] = [
        {
            name: "brokerName", type: "autocomplete", placeholder: "Broker", required: true,
            options: brokers?.map((b: Broker) => `${b.name} (Fee: ${b.transactionFee.toFixed(2)}€)`)
        },
        {
            name: "stockName",
            type: "autocomplete",
            placeholder: "Stock Name",
            required: true,
            options: stockData?.map((details) => details.companyName)
        },
        {name: "startDate", type: "date", placeholder: "Start Date", required: true},
        {name: "endDate", type: "date", placeholder: "End Date", required: true},
        {name: "startCapital", type: "number", placeholder: "Start Capital", required: true},
        {name: "riskTolerance", type: "number", placeholder: "Risk Tolerance (%)", required: false},
        {
            name: "simulationType",
            type: "select",
            placeholder: "Simulation Type",
            required: true,
            options: simulationTypeOptions
        }
    ];

    const addIndicator = () => {
        append({
            indicator: Indicator.NONE,
            movingAverageShortDays: undefined,
            movingAverageLongDays: undefined,
            breakoutDays: undefined
        });
    };

    const removeIndicator = (index: number) => {
        remove(index);
    };

    const updateIndicator = (index: number, field: keyof IndicatorDetails, value: Indicator | number | undefined) => {
        const indicator = {...indicatorFields[index], [field]: value};
        update(index, indicator);
    };

    const showSubmitError = (error: string) => {
        setError(Error(error));
        setShowErrorOverlay(true);
        console.error(error);
        setIsSubmitting(false);
    };

    const onSubmitHandler = (data: SimulationRequest) => {
        setIsSubmitting(true);
        if (!stockData || stockData.length === 0) {
            showSubmitError("Stock data is not available.");
            return;
        }

        const officialStockName = stockData.find(
            stockDetails => stockDetails.companyName === data.stockName
        )?.officialName;

        if (!officialStockName) {
            showSubmitError(`Could not find a matching stock for "${data.stockName}".`);
            return;
        }

        const result = {
            ...data,
            stockName: officialStockName
        };

        onSubmit(result);
        setIsSubmitting(false);
    };

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
            <CloseButton onClose={onClose}/>
            <form onSubmit={handleSubmit(onSubmitHandler)}>
                <ErrorOverlay
                    isOpen={showErrorOverlay}
                    setIsOpen={setShowErrorOverlay}
                    error={error}
                />

                <DialogTitle>Strategy Tester</DialogTitle>

                <DialogContent sx={{position: 'relative'}}>
                    <DialogContentText>
                        Fill in the form to test your strategy
                    </DialogContentText>

                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                        <Box display="flex" flexDirection="column" gap={2} mt={2}>
                            {fields.map((field) => (
                                <FieldController
                                    key={field.name}
                                    control={control}
                                    errors={errors}
                                    field={field}
                                />
                            ))}
                        </Box>
                    </LocalizationProvider>

                    <Box mt={3}>
                        <Typography variant="h6" gutterBottom>
                            Trading Indicators
                        </Typography>
                        <Divider sx={{mb: 2}}/>

                        {indicatorFields.length > 0 ? (
                            <Stack spacing={2}>
                                {indicatorFields.map((field, index) => (
                                    <Paper key={field.id} elevation={2} sx={{p: 2}}>
                                        <Box component="div" sx={{position: 'relative'}}>
                                            <IndicatorForm
                                                indicators={[{
                                                    id: field.id,
                                                    indicator: field.indicator,
                                                    movingAverageShortDays: field.movingAverageShortDays,
                                                    movingAverageLongDays: field.movingAverageLongDays,
                                                    breakoutDays: field.breakoutDays
                                                }]}
                                                addIndicator={() => {
                                                }}
                                                removeIndicator={() => removeIndicator(index)}
                                                updateIndicator={(_, fieldKey, value) =>
                                                    updateIndicator(index, fieldKey as keyof IndicatorDetails, value)
                                                }
                                                errors={errors.indicators?.[index] ? {0: errors.indicators[index]} : undefined}
                                            />
                                        </Box>
                                    </Paper>
                                ))}
                            </Stack>
                        ) : (
                            <Alert severity="info" sx={{mb: 2}}>
                                No indicators added yet. Add an indicator to enhance your strategy.
                            </Alert>
                        )}

                        <Button
                            onClick={addIndicator}
                            variant="outlined"
                            color="primary"
                            sx={{mt: 2}}
                        >
                            Add Indicator
                        </Button>
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose} color="inherit">
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                        {isSubmitting ? "Simulating..." : "Simulate"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}