import { Delete } from "@mui/icons-material";
import {FormField} from "./FormField.tsx";
import {FieldController} from "./FormController.tsx";
import {SimulationRequest} from "../../../model/request/SimulationRequest.ts";
import {Control, FieldErrors, useWatch} from "react-hook-form";
import {IndicatorType, indicatorTypeOptions} from "../../../model/request/IndicatorType.ts";
import {Grid, IconButton} from "@mui/material";

interface IndicatorRowProps {
    index: number;
    control: Control<SimulationRequest>;
    errors: FieldErrors<SimulationRequest>;
    onRemove: () => void;
}

export function IndicatorRow({index, control, errors, onRemove}: Readonly<IndicatorRowProps>) {
    const indicatorField: FormField<SimulationRequest> = {
        name: `indicators.${index}.indicator`,
        type: "select",
        placeholder: "Indicator Type",
        required: true,
        options: indicatorTypeOptions
    };

    const selected = useWatch({
        control,
        name: `indicators.${index}.indicator` as const
    }) as IndicatorType | undefined;

    const extraConfigs: FormField<SimulationRequest>[] = [];

    if (selected === IndicatorType.MOVING_AVERAGE_CROSSOVER) {
        extraConfigs.push(
            { name: `indicators.${index}.movingAverageShortDays`, type: "number", placeholder: "Short MA Days", required: true},
            { name: `indicators.${index}.movingAverageLongDays`, type: "number", placeholder: "Long MA Days", required: true}
        );
    } else if (selected === IndicatorType.BREAKOUT) {
        extraConfigs.push({name: `indicators.${index}.breakoutDays`, type: "number", placeholder: "Breakout Days", required: true});
    }

    return (
        <Grid container spacing={2} alignItems="center">
            <Grid size={{xs: 12, sm: 6}}>
                <FieldController<SimulationRequest>
                    control={control}
                    errors={errors}
                    field={indicatorField}
                />
            </Grid>

            <Grid size={{xs: 12, sm: 5}}>
                {extraConfigs.map((cfg) => (
                    <FieldController<SimulationRequest>
                        key={cfg.name}
                        control={control}
                        errors={errors}
                        field={cfg}
                    />
                ))}
            </Grid>

            <Grid size={{xs: 12, sm: 1}} sx={{ textAlign: "right" }}>
                <IconButton onClick={onRemove} color="error">
                    <Delete />
                </IconButton>
            </Grid>
        </Grid>
    );
}