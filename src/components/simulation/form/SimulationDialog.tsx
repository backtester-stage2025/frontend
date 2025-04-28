import {z} from "zod";
import {BuyAndHoldSimulationRequest} from "../../../model/BuyAndHoldSimulationRequest.ts";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {enGB} from "date-fns/locale";
import {useStockData} from "../../../hooks/useStockData.ts";
import {FieldController, FormField} from "./FormController.tsx";


const simulationRequestSchema = z.object({
    csvFileName: z.string().nonempty("CSV file name is required"),
    startDate: z.coerce.date({required_error: "Start Date is required"}),
    endDate: z.coerce.date({required_error: "End Date is required"}),
    startCapital: z.coerce.number({
        required_error: "Start Capital is required",
        invalid_type_error: "Start Capital must be a number",
    }).positive("Start Capital must be a positive number"),
}).refine((data) => data.endDate > data.startDate, {
    path: ["endDate"],
    message: "End Date must be after Start Date",
});

interface BuyAndHoldSimulationProps {
    isOpen: boolean
    onSubmit: (data: BuyAndHoldSimulationRequest) => void
    onClose: () => void
}


export function SimulationDialog({isOpen, onSubmit, onClose}: Readonly<BuyAndHoldSimulationProps>) {

    const {stockData} = useStockData();

    const fields: FormField[] = [
        {name: "csvFileName", type: "select", placeholder: "CSV file name", required: true, options: stockData},
        {name: "startDate", type: "date", placeholder: "Start Date", required: true},
        {name: "endDate", type: "date", placeholder: "End Date", required: true},
        {name: "startCapital", type: "number", placeholder: "Start Capital", required: true}
    ];

    const {control, handleSubmit, formState: {errors}} = useForm<BuyAndHoldSimulationRequest>({
        resolver: zodResolver(simulationRequestSchema),
        defaultValues: {
            csvFileName: '',
            startDate: new Date(),
            endDate: new Date(),
            startCapital: 100
        }
    })

    const onSubmitHandler = (data: BuyAndHoldSimulationRequest) => {
        const request = {
            ...data,
            csvFileName: data.csvFileName + '.csv',
        }
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