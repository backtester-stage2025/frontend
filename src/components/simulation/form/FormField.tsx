import {ControllerRenderProps} from "react-hook-form";
import {SimulationRequest} from "../../../model/request/SimulationRequest.ts";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {Autocomplete, Checkbox, FormControlLabel, MenuItem, TextField} from "@mui/material";
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
            id={field.name}
            select
            fullWidth
            label={field.placeholder}
            required={field.required}
            error={error}
            helperText={helperText}
        >
            {optionsReady ? (
                field.options!.map((opt) =>
                    typeof opt === "string" ? (
                        <MenuItem key={opt} value={opt}>
                            {opt}
                        </MenuItem>
                    ) : (
                        <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </MenuItem>
                    )
                )
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
                    id={field.name}
                    required={field.required}
                />
            }
            label={field.placeholder}
        />
    );
}

export function FormAutoComplete(
    {field, controllerField, error, helperText}: Readonly<FormFieldRenderProps>
){

    const optionLabels = Array.isArray(field.options) && typeof field.options[0] === "object" && "label" in field.options[0]
        ? (field.options as { label: string; value: unknown }[]).map(opt => opt.label)
        : (field.options as string[] || [])

    const optionValues = controllerField.value !== null && controllerField.value !== undefined
        ? controllerField.value.toString()
        : null

    return (
        <Autocomplete
            options={optionLabels}
            value={optionValues}
            onChange={(_, newValue) => {
                controllerField.onChange(newValue);
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={field.placeholder}
                    required={field.required}
                    error={error}
                    helperText={helperText}
                    fullWidth
                />
            )}
        />
    );
}