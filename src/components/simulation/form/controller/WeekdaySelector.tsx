import {Control, Controller, ControllerRenderProps, FieldValues, Path} from "react-hook-form";
import {Weekday, weekdayOptions} from "../../../../model/Weekday.ts";
import {Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel} from "@mui/material";

interface WeekdaySelectorProps<T extends FieldValues> {
    name: Path<T>;
    control: Control<T>;
}

export const WeekdaySelector = <T extends FieldValues>({name, control}: WeekdaySelectorProps<T>) => {

    const handleChange = (day: Weekday, checked: boolean, field: ControllerRenderProps<T, Path<T>>) => {
        const current: Weekday[] = field.value ?? []
        const updated = checked
            ? [...current, day]
            : current.filter((d) => d !== day)
        field.onChange(updated)
    }

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <FormControl component="fieldset" variant="standard">
                    <FormLabel component="legend">{"Trading week days"}</FormLabel>
                    <FormGroup>
                        {weekdayOptions.map((option) => (
                            <FormControlLabel
                                key={option.label}
                                control={
                                    <Checkbox
                                        checked={field.value?.includes(option.value)}
                                        onChange={(e) =>
                                            handleChange(option.value, e.target.checked, field)
                                        }
                                        name={option.value}
                                    />
                                }
                                label={option.label}
                            />
                        ))}
                    </FormGroup>
                </FormControl>
            )}
        />
    );
}