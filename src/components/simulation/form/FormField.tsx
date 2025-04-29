import {ControllerRenderProps} from "react-hook-form";
import {SimulationRequest} from "../../../model/request/SimulationRequest.ts";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {Checkbox, FormControlLabel, MenuItem, TextField} from "@mui/material";
import {FormField} from "./FormController.tsx";

interface FormFieldRenderProps {
    field: FormField;
    controllerField: ControllerRenderProps<SimulationRequest, keyof SimulationRequest>
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

export function FormCheckbox(
    {field, controllerField}: Readonly<FormFieldRenderProps>
) {
    return (
        <FormControlLabel
            control={
                <Checkbox
                    checked={!!controllerField.value}
                    onChange={(e) => controllerField.onChange(e.target.checked)}
                    required={field.required}
                />
            }
            label={field.placeholder}
        />
    );
}