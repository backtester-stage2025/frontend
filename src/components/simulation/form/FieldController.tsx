import {Control, Controller, FieldError, FieldErrors, FieldValues} from "react-hook-form";
import {IconButton, InputAdornment, TextField} from "@mui/material";
import get from "lodash/get";
import {FormAutoComplete, FormCheckbox, FormDatePicker, FormDropdown, FormField} from "./FormField.tsx";
import {TooltipHtml} from "../../util/TooltipHtml.tsx";
import InfoIcon from "@mui/icons-material/Info";

interface FieldControllerProps<T extends FieldValues> {
    errors: FieldErrors<T> | undefined;
    control: Control<T>
    field: FormField<T>
}

export function FieldController<T extends FieldValues>({control, errors, field}: Readonly<FieldControllerProps<T>>) {
    if (field.shouldRender === false) return null;

    const errorObj = get(errors, field.name) as FieldError | undefined;
    const error = Boolean(errorObj);
    const helperText = errorObj?.message;

    const inputProps = field.tooltip
        ? {
            InputProps: {
                endAdornment: (
                    <InputAdornment position="end">
                        <TooltipHtml
                            title={field.tooltip.title ?? ""}
                            description={field.tooltip.description}
                            link={field.tooltip.link}
                        >
                            <IconButton sx={{ marginRight: 1, color: 'rgba(0, 0, 0, 0.3)'}}>
                                <InfoIcon sx={{ fontSize: '1.6rem' }} />
                            </IconButton>
                        </TooltipHtml>
                    </InputAdornment>
                ),
            },
        }
        : {};

    return (
        <Controller
            name={field.name}
            control={control}
            render={({field: controllerField}) => {

                if (field.type === "date")
                    return <FormDatePicker field={field} controllerField={controllerField} error={error}
                                           helperText={helperText}/>

                if (field.type === "select")
                    return <FormDropdown field={field} controllerField={controllerField} error={error}
                                         helperText={helperText} inputProps={inputProps}/>

                if (field.type === "checkbox")
                    return <FormCheckbox field={field} controllerField={controllerField} error={error}
                                         helperText={helperText}/>

                if (field.type === "autocomplete") {
                    return <FormAutoComplete field={field} controllerField={controllerField} error={error}
                                             helperText={helperText}/>
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
                        {...inputProps}
                    />
                );
            }}
        />
    )
}