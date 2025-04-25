import {z} from "zod";
import {BuyAndHoldSimulationRequest} from "../../model/BuyAndHoldSimulationRequest.ts";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
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
    TextField
} from "@mui/material";

interface FormField {
    name: string;
    type: string;
    placeholder: string;
    required: boolean;
}

const fields: FormField[] = [
    {name: "csvFileName", type: "text", placeholder: "CSV file name (no extension)", required: true},
    {name: "startDate", type: "date", placeholder: "Start Date", required: true},
    {name: "endDate", type: "date", placeholder: "End Date", required: true},
    {name: "startCapital", type: "number", placeholder: "Start Capital", required: true}
];


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

export function BuyAndHoldSimulationDialog({isOpen, onSubmit, onClose}: Readonly<BuyAndHoldSimulationProps>) {
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
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <Box display="flex" flexDirection="column" gap={2} mt={2}>
                            {fields.map((field) => (
                                <Controller
                                    key={field.name}
                                    name={field.name as keyof BuyAndHoldSimulationRequest}
                                    control={control}
                                    render={({field: controllerField}) => {
                                        const error = !!errors[field.name as keyof BuyAndHoldSimulationRequest];
                                        const helperText = errors[field.name as keyof BuyAndHoldSimulationRequest]?.message;

                                        if (field.type === "date") {
                                            return (
                                                <DatePicker
                                                    label={field.placeholder}
                                                    value={controllerField.value instanceof Date ? controllerField.value : null}
                                                    onChange={(date) => controllerField.onChange(date)}
                                                    slotProps={{
                                                        textField: {
                                                            fullWidth: true,
                                                            required: field.required,
                                                            error,
                                                            helperText
                                                        }
                                                    }}
                                                />
                                            );
                                        }

                                        return (
                                            <TextField
                                                {...controllerField}
                                                type={field.type}
                                                fullWidth
                                                label={field.placeholder}
                                                required={field.required}
                                                error={error}
                                                helperText={helperText}
                                            />
                                        );
                                    }}
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