import {Delete} from "@mui/icons-material";
import {FormField} from "./FormField.tsx";
import {FieldController} from "./FieldController.tsx";
import {SimulationRequest} from "../../../model/request/SimulationRequest.ts";
import {Control, FieldErrors, useWatch} from "react-hook-form";
import {IndicatorType, indicatorTypeOptions} from "../../../model/request/IndicatorType.ts";
import {Box, Grid, IconButton} from "@mui/material";
import {TOOLTIP_MESSAGES} from "../../../constants/tooltipMessages.ts";

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
        options: indicatorTypeOptions,
        tooltip: TOOLTIP_MESSAGES.simulation.indicator,
    };

    const selected = useWatch({
        control,
        name: `indicators.${index}.indicator` as const
    }) as IndicatorType | undefined;

    const extraConfigs: FormField<SimulationRequest>[] = [];

    if (selected === IndicatorType.MOVING_AVERAGE_CROSSOVER) {
        extraConfigs.push(
            {
                name: `indicators.${index}.movingAverageShortDays`,
                type: "number",
                placeholder: "Short MA Days",
                required: true,
                tooltip: {
                    info: TOOLTIP_MESSAGES.simulation.indicator.maShortDays
                }
            },
            {
                name: `indicators.${index}.movingAverageLongDays`,
                type: "number",
                placeholder: "Long MA Days",
                required: true,
                tooltip: {
                    info: TOOLTIP_MESSAGES.simulation.indicator.maLongDays
                }
            }
        );
    } else if (selected === IndicatorType.BREAKOUT) {
        extraConfigs.push({
            name: `indicators.${index}.breakoutDays`,
            type: "number",
            placeholder: "Breakout Days",
            required: true,
            tooltip: {
                info: TOOLTIP_MESSAGES.simulation.indicator.breakoutDays
            }
        });
    } else if (selected === IndicatorType.MACD) {
        extraConfigs.push(
            {
                name: `indicators.${index}.macdShortDays`,
                type: "number",
                placeholder: "Short MACD Days",
                required: true,
                tooltip: {
                    info: TOOLTIP_MESSAGES.simulation.indicator.macdShortDays
                }
            },
            {
                name: `indicators.${index}.macdLongDays`,
                type: "number",
                placeholder: "Long MACD Days",
                required: true,
                tooltip: {
                    info: TOOLTIP_MESSAGES.simulation.indicator.macdLongDays
                }
            }
        );
    }

    return (
        <Box sx={{position: 'relative'}}>
            <Grid container spacing={2} alignItems="flex-start">
                <Grid size={{xs: 12, md: 6}}>
                    <FieldController<SimulationRequest>
                        control={control}
                        errors={errors}
                        field={indicatorField}
                    />
                </Grid>

                <Grid size={{xs: 12, md: 5}}>
                    <Grid container spacing={2}>
                        {extraConfigs.map((cfg) => (
                            <Grid size={{xs: 12}} key={cfg.name}>
                                <FieldController<SimulationRequest>
                                    control={control}
                                    errors={errors}
                                    field={cfg}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>

                <Grid size={{xs: 12, md: 1}} sx={{
                    display: 'flex',
                    justifyContent: {xs: 'flex-start', md: 'center'},
                    alignItems: 'center',
                    height: '100%'
                }}>
                    <IconButton
                        onClick={onRemove}
                        color="error"
                        size="small"
                        sx={{mt: {xs: 0, md: 1}}}
                    >
                        <Delete/>
                    </IconButton>
                </Grid>
            </Grid>
        </Box>
    );
}