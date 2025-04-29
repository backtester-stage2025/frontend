import {SimulationRequest} from "../../../model/request/SimulationRequest.ts";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import {enGB} from "date-fns/locale";
import {useStockData} from "../../../hooks/useStockData.ts";
import {FieldController, FormField} from "./FormController.tsx";
import {SimulationTypes} from "../../../model/request/SimulationTypes.ts";
import { useState, useEffect } from "react";
import {ErrorOverlay} from "./ErrorOverlay.tsx";
import {simulationRequestSchema} from "./SimulationRequestSchema.ts";

interface BuyAndHoldSimulationProps {
    isOpen: boolean
    onSubmit: (data: SimulationRequest) => void
    onClose: () => void
    isServerError: boolean
    serverError: Error | null
}

export function SimulationDialog({isOpen, onSubmit, onClose, isServerError, serverError}: Readonly<BuyAndHoldSimulationProps>) {
    const {stockData} = useStockData();
    const [showErrorOverlay, setShowErrorOverlay] = useState(isServerError);
    const [movingAverage, setMovingAverage] = useState<boolean>(true);
    useEffect(() => {
        setShowErrorOverlay(isServerError);
    }, [isServerError]);

    const fields: FormField[] = [
        {name: "csvFileName", type: "select", placeholder: "CSV file name", required: true, options: stockData},
        {name: "startDate", type: "date", placeholder: "Start Date", required: true},
        {name: "endDate", type: "date", placeholder: "End Date", required: true},
        {name: "startCapital", type: "number", placeholder: "Start Capital", required: true},
        {name: "riskTolerance", type: "number", placeholder: "Risk Tolerance (%)", required: false},
        {
            name: "simulationType",
            type: "select",
            placeholder: "Simulation Type",
            required: true,
            options: Object.values(SimulationTypes)
        },
        {
            name: "useMovingAverageCrossover",
            type: "checkbox",
            placeholder: "Use moving average crossover",
            required: false,
            checkBoxToggle: setMovingAverage
        },
        {name: "movingAverageShortDays", type: "number", placeholder: "Moving average (Short)", required: false, shouldRender: movingAverage},
        {name: "movingAverageLongDays", type: "number", placeholder: "Moving average (Long)", required: false, shouldRender: movingAverage},

    ];

    const {control, handleSubmit, formState: {errors}} = useForm<SimulationRequest>({
        resolver: zodResolver(simulationRequestSchema),
        defaultValues: {
            csvFileName: '',
            startDate: new Date(),
            endDate: new Date(),
            startCapital: 10000,
            simulationType: SimulationTypes.RISK_BASED,
            riskTolerance: 20,
            useMovingAverageCrossover: true,
            movingAverageShortDays: 10,
            movingAverageLongDays: 20
        }
    })

    const onSubmitHandler = (data: SimulationRequest) => {
        const request = {
            ...data,
            csvFileName: data.csvFileName + '.csv',
        }
        console.log(request)
        onSubmit(request);
    }

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit(onSubmitHandler)}>
                <ErrorOverlay
                    isOpen={showErrorOverlay}
                    setIsOpen={setShowErrorOverlay}
                    error={serverError}
                />

                <DialogTitle>Buy And Hold Simulation</DialogTitle>

                <DialogContent sx={{ position: 'relative' }}>
                    <DialogContentText>
                        Fill in the form to simulate a buy and hold
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
                </DialogContent>

                <DialogActions>
                    <Button type="submit" variant="contained" color="primary">
                        Simulate
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}