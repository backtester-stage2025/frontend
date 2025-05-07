import {Control, Controller, FieldErrors} from "react-hook-form";
import {SimulationRequest} from "../../../model/request/SimulationRequest.ts";
import {Autocomplete, TextField} from "@mui/material";
import {FormCheckbox, FormDatePicker, FormDropdown, FormTextFieldWithAdornment} from "./FormField.tsx";
import {SimulationTypes} from "../../../model/request/SimulationTypes.ts";

export interface FormField {
    name: string;
    type: "text" | "number" | "date" | "select" | "checkbox" | "autocomplete";
    placeholder: string;
    required: boolean;
    options?: string[] | { label: string; value: SimulationTypes }[];
    shouldRender?: boolean;
    checkBoxToggle?: (isChecked: boolean) => void;
}

interface FieldControllerProps {
    errors: FieldErrors<SimulationRequest>
    control: Control<SimulationRequest>
    field: FormField
}

export function FieldController({control, errors, field}: Readonly<FieldControllerProps>) {
    if (field.shouldRender === false) return null;
    return (
        <Controller
            name={field.name as keyof SimulationRequest}
            control={control}
            render={({field: controllerField}) => {
                const error = !!errors[field.name as keyof SimulationRequest];
                const helperText = errors[field.name as keyof SimulationRequest]?.message;

                if (field.type === "date") {
                    return <FormDatePicker
                        field={field}
                        controllerField={controllerField}
                        error={error}
                        helperText={helperText}
                    />
                }

                if (field.type === "select") {
                    return <FormDropdown
                        field={field}
                        controllerField={controllerField}
                        error={error}
                        helperText={helperText}
                    />
                }

                if (field.type === "checkbox") {
                    return <FormCheckbox
                        field={field}
                        controllerField={controllerField}
                        error={error}
                        helperText={helperText}
                    />
                }

                if (field.name === "movingAverageShortDays" || field.name === "movingAverageLongDays") {
                    return <FormTextFieldWithAdornment
                        field={field}
                        controllerField={controllerField}
                        error={error}
                        helperText={helperText}
                    />;
                }

                if (field.type === "autocomplete") {
                    return (
                        <Autocomplete
                            options={
                                Array.isArray(field.options) && typeof field.options[0] === "object" && "label" in field.options[0]
                                    ? (field.options as { label: string; value: unknown }[]).map(opt => opt.label)
                                    : (field.options as string[] || [])
                            }                            value={controllerField.value !== null && controllerField.value !== undefined
                                ? String(controllerField.value)
                                : null
                            }
                            onChange={(_, newValue) => {
                                // Extract the broker name before the fee information if present
                                const value = newValue?.includes('(')
                                    ? newValue.substring(0, newValue.indexOf('(')).trim()
                                    : newValue;
                                controllerField.onChange(value);
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
    )
}