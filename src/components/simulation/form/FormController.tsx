import {Control, Controller, FieldErrors, FieldValues} from "react-hook-form";
import {TextField} from "@mui/material";
import {
    FormAutoComplete,
    FormCheckbox,
    FormDatePicker,
    FormDropdown, FormField
} from "./FormField.tsx";

interface FieldControllerProps<T extends FieldValues> {
    errors: FieldErrors<T> | undefined;
    control: Control<T>
    field: FormField<T>
}

export function FieldController<T extends FieldValues>({control, errors, field}: Readonly<FieldControllerProps<T>>) {
    if (field.shouldRender === false) return null;
    return (
        <Controller
            name={field.name}
            control={control}
            render={({field: controllerField}) => {
                const error = !!errors?.[field.name];
                const helperText = errors?.[field.name]?.message as string | undefined;

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