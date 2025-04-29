import {Control, Controller, FieldErrors} from "react-hook-form";
import {SimulationRequest} from "../../../model/request/SimulationRequest.ts";
import {TextField} from "@mui/material";
import {FormCheckbox, FormDatePicker, FormDropdown} from "./FormField.tsx";

export interface FormField {
    name: string;
    type: "text" | "number" | "date" | "select" | "checkbox";
    placeholder: string;
    required: boolean;
    options?: string[];
}

interface FieldControllerProps {
    errors: FieldErrors<SimulationRequest>
    control: Control<SimulationRequest>
    field: FormField
}

export function FieldController({control, errors, field}: Readonly<FieldControllerProps>) {
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