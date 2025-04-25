import { z } from "zod";
import {BuyAndHoldSimulationRequest} from "../../model/BuyAndHoldSimulationRequest.ts";
import {useForm, Controller} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useBuyAndHold} from "../../hooks/useBuyAndHold.ts";
import {Box, Dialog, DialogContent, DialogContentText, DialogTitle, TextField} from "@mui/material";

const fields = [
    {name: 'csvFileName', type: 'text', placeHolder: 'CSV file name', required: true},
    {name: 'startDate', type: 'date', placeHolder: 'Start Date', required: true},
    {name: 'endDate', type: 'date', placeHolder: 'End Date', required: true},
    {name: 'startCapital', type: 'number', placeHolder: 'Start Capital', required: true}
];

const simulationRequestSchema = z.object({
    csvFileName: z.string().nonempty("CSV file name is required"),
    startDate: z.coerce.date({ required_error: "Start Date is required" }),
    endDate: z.coerce.date({ required_error: "End Date is required" }),
    startCapital: z.coerce.number({
        required_error: "Start Capital is required",
        invalid_type_error: "Start Capital must be a number",
    }).positive("Start Capital must be a positive number"),
}).refine((data) => data.endDate > data.startDate, {
    path: ["endDate"],
    message: "End Date must be after Start Date",
});

export function BuyAndHoldSimulationDialog() {
    const {mutate} = useBuyAndHold()

    const { control, handleSubmit, formState: {errors}} = useForm<BuyAndHoldSimulationRequest>({
        resolver: zodResolver(simulationRequestSchema),
        defaultValues: {
            csvFileName: '',
            startDate: new Date(),
            endDate: new Date(),
            startCapital: 100
        }
    })

    const onSubmitHandler = (data: BuyAndHoldSimulationRequest) => {
        mutate(data);
    }

    return (
        <Dialog open={true}>
            <form onSubmit={handleSubmit(onSubmitHandler)}>
                <DialogTitle>Buy And Hold Simulation</DialogTitle>
                <DialogContent>
                    <DialogContentText>Fill in the form to simulate a buy and hold</DialogContentText>
                    <Box display="flex" flexDirection="column" gap={2} mt={2}>
                        {fields.map((field) => (
                            <Controller
                                key={field.name}
                                name={field.name as keyof BuyAndHoldSimulationRequest}
                                control={control}
                                render={({ field: controllerField }) => {
                                    return (
                                        <TextField
                                            {...controllerField}
                                            type={field.type}
                                            fullWidth
                                            placeholder={field.placeHolder}
                                            label={field.placeHolder}
                                            slotProps={{
                                                inputLabel: field.type === "date" ? {shrink: true} : undefined
                                            }}
                                            error={!!errors[field.name as keyof BuyAndHoldSimulationRequest]}
                                            helperText={errors[field.name as keyof BuyAndHoldSimulationRequest]?.message}
                                            required={field.required || false}
                                        />
                                    );
                                }}
                            />
                        ))}
                    </Box>
                </DialogContent>
            </form>
        </Dialog>
    )
}