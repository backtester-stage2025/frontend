import {ControllerRenderProps} from "react-hook-form";
import {BuyAndHoldSimulationRequest} from "../../model/BuyAndHoldSimulationRequest.ts";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {MenuItem, TextField} from "@mui/material";
import {FormField} from "./BuyAndHoldSimulationFieldController.tsx";

interface FormFieldRenderProps {
    field: FormField;
    controllerField: ControllerRenderProps<BuyAndHoldSimulationRequest, keyof BuyAndHoldSimulationRequest>
    error: boolean;
    helperText: string | undefined;
}

export function FormDatePicker(
    {field, controllerField, error, helperText}: Readonly<FormFieldRenderProps>
) {
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

export function FormDropdown(
    {field, controllerField, error, helperText}: Readonly<FormFieldRenderProps>
) {
    const optionsReady = field.options && field.options.length > 0;

    return (
        <TextField
            {...controllerField}
            select
            fullWidth
            label={field.placeholder}
            required={field.required}
            error={error}
            helperText={helperText}
        >
            {optionsReady ? (
                field.options!.map(opt => (
                    <MenuItem key={opt} value={opt}>
                        {opt}
                    </MenuItem>
                ))
            ) : (
                <MenuItem disabled>Loading options...</MenuItem>
            )}
        </TextField>
    );
}