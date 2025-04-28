import {Control, Controller, FieldErrors} from "react-hook-form";
import {BuyAndHoldSimulationRequest} from "../../model/BuyAndHoldSimulationRequest.ts";
import {TextField} from "@mui/material";
import {FormDatePicker, FormDropdown} from "./FormFieldRender.tsx";

export interface FormField {
    name: string;
    type: string;
    placeholder: string;
    required: boolean;
    options?: string[];
}

interface FieldControllerProps {
    errors: FieldErrors<BuyAndHoldSimulationRequest>
    control: Control<BuyAndHoldSimulationRequest>
    field: FormField
}

export function FieldController({control, errors, field}: Readonly<FieldControllerProps>) {
    return (
        <Controller
            name={field.name as keyof BuyAndHoldSimulationRequest}
            control={control}
            render={({field: controllerField}) => {
                const error = !!errors[field.name as keyof BuyAndHoldSimulationRequest];
                const helperText = errors[field.name as keyof BuyAndHoldSimulationRequest]?.message;

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