import {Control, Controller, FieldErrors} from "react-hook-form";
import {SimulationRequest} from "../../../model/request/SimulationRequest.ts";
import {TextField} from "@mui/material";
import {
    FormAutoComplete,
    FormCheckbox,
    FormDatePicker,
    FormDropdown
} from "./FormField.tsx";
import {SimulationTypes} from "../../../model/request/SimulationTypes.ts";

export interface FormField {
    name: string;
    type: "text" | "number" | "date" | "select" | "checkbox" | "autocomplete";
    placeholder: string;
    required: boolean;
    options?: string[] | { label: string; value: SimulationTypes }[];
    shouldRender?: boolean;
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

                if (field.type === "date")
                    return <FormDatePicker field={field} controllerField={controllerField} error={error} helperText={helperText}/>

                if (field.type === "select")
                    return <FormDropdown field={field} controllerField={controllerField} error={error} helperText={helperText}/>

                if (field.type === "checkbox")
                    return <FormCheckbox field={field} controllerField={controllerField} error={error} helperText={helperText}/>

                if (field.type === "autocomplete") {
                    return <FormAutoComplete field={field} controllerField={controllerField} error={error} helperText={helperText}/>
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