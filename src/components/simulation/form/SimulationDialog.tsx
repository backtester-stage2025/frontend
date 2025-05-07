import {SimulationRequest} from "../../../model/request/SimulationRequest.ts";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,} from "@mui/material";
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
import {IndicatorForm} from "./IndicatorForm.tsx";
import {Indicator} from "../../../model/request/Indicator.ts";

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
                                     isServerError,
                                     serverError
                                 }: Readonly<BuyAndHoldSimulationProps>) {
    const {stockData} = useStockData();
    const {isLoading: isLoadingBrokers, isError: isErrorLoadingBrokers, brokers} = useBrokers();
    const [error, setError] = useState<Error | null>(serverError ?? null);
    const [showErrorOverlay, setShowErrorOverlay] = useState<boolean>(!!serverError);
    const [indicators, setIndicators] = useState<{
        id: string;
        indicator: Indicator;
        movingAverageShortDays?: number;
        movingAverageLongDays?: number;
        breakoutDays?: number
    }[]>([]);

    useEffect(() => {
        setError(serverError ?? null);
        setShowErrorOverlay(!!serverError);
    }, [serverError]);

    const [movingAverage, setMovingAverage] = useState<boolean>(true);
    useEffect(() => {
        setShowErrorOverlay(isServerError);
    }, [isServerError]);

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
    })
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
        },
        {
            name: "useMovingAverageCrossover",
            type: "checkbox",
            placeholder: "Use moving average crossover",
            required: false,
            checkBoxToggle: setMovingAverage
        },
        {
            name: "movingAverageShortDays",
            type: "number",
            placeholder: "Moving average (Short)",
            required: false,
            shouldRender: movingAverage
        },
        {
            name: "movingAverageLongDays",
            type: "number",
            placeholder: "Moving average (Long)",
            required: false,
            shouldRender: movingAverage
        },

    ];

    const addIndicator = () => {
        setIndicators([
            ...indicators,
            {
                id: Date.now().toString(),
                indicator: Indicator.NONE,
                movingAverageShortDays: 0,
                movingAverageLongDays: 0,
                breakoutDays: 0
            }
        ]);
    };

    const removeIndicator = (id: string) => {
        setIndicators(indicators.filter((indicator) => indicator.id !== id));
    };

    const updateIndicator = (id: string, field: string, value: Indicator | number | undefined) => {
        setIndicators(indicators.map((indicator) =>
            indicator.id === id ? {...indicator, [field]: value} : indicator
        ));
    };

    const showSubmitError = (error: string) => {
        setError(Error(error))
        setShowErrorOverlay(true)
        console.error(error)
        setIsSubmitting(false);
    }

    const onSubmitHandler = (data: SimulationRequest) => {
        setIsSubmitting(true);
        if (!stockData || stockData.length === 0) {
            showSubmitError("Stock data is not available.")
            return;
        }

        const officialStockName = stockData.find(
            stockDetails => stockDetails.companyName === data.stockName
        )?.officialName;

        if (!officialStockName) {
            showSubmitError(`Could not find a matching stock for "${data.stockName}".`)
            return;
        }

        const result = {
            ...data,
            stockName: officialStockName,
            indicators,
        };

        onSubmit(result);
        setIsSubmitting(false);
    };

    return (
        <Dialog open={isOpen} onClose={onClose}>
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

                    <IndicatorForm
                        indicators={indicators}
                        addIndicator={addIndicator}
                        removeIndicator={removeIndicator}
                        updateIndicator={updateIndicator}
                    />
                </DialogContent>

                <DialogActions>
                    <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                        {isSubmitting ? "Simulating..." : "Simulate"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}