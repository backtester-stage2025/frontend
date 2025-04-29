import {z} from "zod";
import {SimulationRequest} from "../../../model/request/SimulationRequest.ts";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {enGB} from "date-fns/locale";
import {useStockData} from "../../../hooks/useStockData.ts";
import {FieldController, FormField} from "./FormController.tsx";
import {SimulationTypes} from "../../../model/request/SimulationTypes.ts";


const simulationRequestSchema = z.object({
    csvFileName: z.string().nonempty("CSV file name is required"),
    startDate: z.coerce.date({ required_error: "Start Date is required" }),
    endDate: z.coerce.date({ required_error: "End Date is required" }),
    startCapital: z.coerce.number({
        required_error: "Start Capital is required",
        invalid_type_error: "Start Capital must be a number",
    }).positive("Start Capital must be a positive number"),
    simulationType: z.nativeEnum(SimulationTypes, {
        required_error: "Simulation Type is required",
        invalid_type_error: "Invalid Simulation Type"
    }),
    useMovingAverageCrossover: z.boolean().optional(),
    movingAverageShortDays: z.coerce.number().positive("Short MA must be positive").optional(),
    movingAverageLongDays: z.coerce.number().positive("Long MA must be positive").optional(),
    riskTolerance: z.coerce.number()
        .min(0, "Risk Tolerance must be between 0 and 100")
        .max(100, "Risk Tolerance must be between 0 and 100")
        .optional(),
}).refine((data) => data.endDate > data.startDate, {
    path: ["endDate"],
    message: "End Date must be after Start Date",
}).refine((data) => {
    if (data.useMovingAverageCrossover) {
        return data.movingAverageShortDays !== undefined && data.movingAverageLongDays !== undefined;
    }
    return true;
}, {
    path: ["movingAverageShortDays"],
    message: "Moving Average Short and Long days are required when Moving Average Crossover is enabled",
}).refine((data) => {
    if (data.useMovingAverageCrossover && data.movingAverageShortDays !== undefined && data.movingAverageLongDays !== undefined) {
        return data.movingAverageShortDays < data.movingAverageLongDays;
    }
    return true;
});

interface BuyAndHoldSimulationProps {
    isOpen: boolean
    onSubmit: (data: SimulationRequest) => void
    onClose: () => void
}


export function SimulationDialog({isOpen, onSubmit, onClose}: Readonly<BuyAndHoldSimulationProps>) {

    const {stockData} = useStockData();

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
            required: false
        },
        {name: "movingAverageShortDays", type: "number", placeholder: "Moving average (Short)", required: false},
        {name: "movingAverageLongDays", type: "number", placeholder: "Moving average (Long)", required: false},

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
                <DialogTitle>Buy And Hold Simulation</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Fill in the form to simulate a buy and hold
                    </DialogContentText>
                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                        <Box display="flex" flexDirection="column" gap={2} mt={2}>
                            {fields.map((field) => <FieldController
                                key={field.name}
                                control={control}
                                errors={errors}
                                field={field}
                            />)}
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