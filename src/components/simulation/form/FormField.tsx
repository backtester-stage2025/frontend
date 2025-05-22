import {ControllerRenderProps, FieldPath, FieldValues} from "react-hook-form";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {Autocomplete, Checkbox, FormControlLabel, MenuItem, TextField} from "@mui/material";

export interface EnumOption<E extends string | number> {
    label: string;
    value: E;
}

export interface FormField<
    TFormValues extends FieldValues,
    TValue extends string | number = string
> {
    name: FieldPath<TFormValues>;
    type: "text" | "date" | "select" | "checkbox" | "autocomplete" | "number";
    placeholder?: string;
    required?: boolean;
    options?: Array<string> | Array<EnumOption<TValue>>;
    shouldRender?: boolean;
    multiple?: boolean;
    tooltip?: {
        title?: string;
        description: string;
        link?: string;
    };
}

export interface FormFieldRenderProps<T extends FieldValues> {
    field: FormField<T>;
    controllerField: ControllerRenderProps<T, FieldPath<T>>;
    error: boolean;
    helperText?: string;
    inputProps?: Record<string, unknown>;
}

function toDate(value: unknown) {
    if (value instanceof Date) {
        return value;
    }
    return null;
}

export function FormDatePicker<TFieldValues extends FieldValues>(
    {field, controllerField, error, helperText}: Readonly<FormFieldRenderProps<TFieldValues>>
) {
    return (
        <DatePicker
            label={field.placeholder}
            value={toDate(controllerField.value)}
            onChange={(date) => controllerField.onChange(date)}
            slotProps={{
                textField: {
                    fullWidth: true,
                    required: field.required,
                    error,
                    helperText,
                }
            }}
        />
    );
}

export function FormDropdown<T extends FieldValues>(
    {field, controllerField, error, helperText, inputProps}: Readonly<FormFieldRenderProps<T>>
) {
    const opts = field.options ?? [];

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
            {...inputProps}
        >
            {opts.length > 0 ? (
                opts.map((opt) =>
                    typeof opt === "string" ? (
                        <MenuItem key={opt} value={opt}>
                            {opt}
                        </MenuItem>
                    ) : (
                        <MenuItem key={String(opt.label)} value={opt.value}>
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

export function FormCheckbox<T extends FieldValues>(
    {field, controllerField}: Readonly<FormFieldRenderProps<T>>
) {
    return (
        <FormControlLabel
            control={
                <Checkbox
                    {...controllerField}
                    checked={!!controllerField.value}
                    id={field.name}
                    required={field.required}
                />
            }
            label={field.placeholder}
        />
    );
}

export function FormAutoComplete<T extends FieldValues>(
    {field, controllerField, error, helperText}: Readonly<FormFieldRenderProps<T>>
) {
    const rawOpts = field.options ?? [];
    const labels = rawOpts.map(opt => typeof opt === "string" ? opt : opt.label);

    let value;
    if (field.multiple) {
        value = Array.isArray(controllerField.value) ? controllerField.value : [];
    } else {
        value = controllerField.value || "";
    }

    return (
        <Autocomplete
            multiple={field.multiple}
            options={labels}
            value={value}
            onChange={(_, newValue) => controllerField.onChange(newValue)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={field.placeholder}
                    required={field.required}
                    error={error}
                    helperText={helperText}
                    fullWidth
                    slotProps={{
                        htmlInput: {
                            ...params.inputProps,
                            required: value.length === 0
                        }
                    }}
                />
            )}
        />
    );
}