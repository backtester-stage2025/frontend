import {SimulationRequest} from "../../../model/request/SimulationRequest.ts";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {enGB} from "date-fns/locale";
import {useStockData} from "../../../hooks/useStockData.ts";
import {FieldController, FormField} from "./FormController.tsx";
import {simulationTypeOptions} from "../../../model/request/SimulationTypes.ts";
import {useEffect, useState} from "react";
import {ErrorOverlay} from "./ErrorOverlay.tsx";
import {simulationRequestSchema} from "./SimulationRequestSchema.ts";
import {CloseButton} from "../../util/CloseButton.tsx";
import {IndicatorForm} from "./IndicatorForm.tsx";
import {Indicator} from "../../../model/request/Indicator.ts";

interface BuyAndHoldSimulationProps {
    isOpen: boolean;
    onSubmit: (data: SimulationRequest) => void;
    onClose: () => void;
    isServerError: boolean;
    serverError: Error | null;
}

export function SimulationDialog({
                                     isOpen,
                                     onSubmit,
                                     onClose,
                                     serverError
                                 }: Readonly<BuyAndHoldSimulationProps>) {
    const {stockData} = useStockData();
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

    const {control, handleSubmit, formState: {errors}} = useForm<SimulationRequest>({
        resolver: zodResolver(simulationRequestSchema),
        defaultValues: {
            stockName: '',
            startDate: new Date(),
            endDate: new Date(),
            startCapital: 10000,
            simulationType: simulationTypeOptions[0].value,
            riskTolerance: 20,
            indicators: []
        }
    });

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

    const onSubmitHandler = (data: SimulationRequest) => {
        if (!stockData || stockData.length === 0) {
            setError(Error("Stock data is not available."));
            setShowErrorOverlay(true);
            return;
        }

        const officialStockName = stockData.find(
            stockDetails => stockDetails.companyName === data.stockName
        )?.officialName;

        if (!officialStockName) {
            setError(Error(`Could not find a matching stock for "${data.stockName}".`));
            setShowErrorOverlay(true);
            return;
        }

        const result = {
            ...data,
            stockName: officialStockName,
            indicators,
        };

        onSubmit(result);
    };

    const fields: FormField[] = [
        {
            name: "stockName",
            type: "select",
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

                <DialogContent>
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
                    <Button type="submit" variant="contained" color="primary">
                        Simulate
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}