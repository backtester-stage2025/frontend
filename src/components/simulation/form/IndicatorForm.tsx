import {Box, Grid, IconButton, MenuItem, TextField, Typography} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {IndicatorType} from "../../../model/request/IndicatorType.ts";
import {useState} from "react";
import {Indicator, IndicatorDetails} from "../../../model/request/SimulationRequest.ts";
import {FieldErrors} from "react-hook-form";

type IndicatorValue = string | number;

interface IndicatorFormProps {
    indicators: Indicator[];
    addIndicator: () => void;
    removeIndicator: (id: string) => void;
    updateIndicator: (changes: Partial<IndicatorDetails>) => void;
    errors?: FieldErrors<IndicatorDetails>;
}

export function IndicatorForm({
                                  indicators,
                                  removeIndicator,
                                  updateIndicator,
                                  errors,
                              }: Readonly<IndicatorFormProps>) {
    const [localValues, setLocalValues] = useState<Record<string, {
        movingAverageShortDays: IndicatorValue;
        movingAverageLongDays: IndicatorValue;
        breakoutDays: IndicatorValue;
    }>>(() =>
        indicators.reduce((acc, indicator) => {
            acc[indicator.id] = {
                movingAverageShortDays: indicator.movingAverageShortDays ?? '',
                movingAverageLongDays: indicator.movingAverageLongDays ?? '',
                breakoutDays: indicator.breakoutDays ?? '',
            };
            return acc;
        }, {} as Record<string, {
            movingAverageShortDays: IndicatorValue;
            movingAverageLongDays: IndicatorValue;
            breakoutDays: IndicatorValue;
        }>)
    );

    const handleLocalChange = (id: string, key: string, value: string) => {
        setLocalValues((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [key]: value,
            },
        }));
    };

    const handleBlur = (key: string, value: string) => {
        const parsedValue = value === '' ? undefined : parseInt(value, 10) || undefined;
        updateIndicator({[key]: parsedValue});
    };

    return (
        <Box>
            {indicators.map((indicator) => (
                <Grid container key={indicator.id} spacing={2} alignItems="center">
                    <Grid size={{xs: 12, sm: 6}}>
                        <TextField
                            select
                            label="Indicator Type"
                            value={indicator.indicator}
                            onChange={(e) => updateIndicator({["indicator"]: e.target.value as IndicatorType})}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            error={!!errors?.indicator}
                            helperText={errors?.indicator?.message}
                        >
                            {Object.values(IndicatorType).map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option.replace(/_/g, ' ')}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid size={{xs: 12, sm: 5}}>
                        {indicator.indicator === IndicatorType.MOVING_AVERAGE_CROSSOVER && (
                            <Box sx={{display: 'flex', gap: 2}}>
                                <TextField
                                    type="text"
                                    label="Short MA Days"
                                    value={localValues[indicator.id]?.movingAverageShortDays}
                                    onChange={(e) =>
                                        handleLocalChange(indicator.id, "movingAverageShortDays", e.target.value)
                                    }
                                    onBlur={(e) =>
                                        handleBlur("movingAverageShortDays", e.target.value)
                                    }
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    error={!!errors?.movingAverageShortDays}
                                    helperText={errors?.movingAverageShortDays?.message}
                                    slotProps={{
                                        input: {
                                            inputProps: {
                                                min: 1,
                                            }
                                        }
                                    }}/>
                                <TextField
                                    type="text"
                                    label="Long MA Days"
                                    value={localValues[indicator.id]?.movingAverageLongDays}
                                    onChange={(e) =>
                                        handleLocalChange(indicator.id, "movingAverageLongDays", e.target.value)
                                    }
                                    onBlur={(e) =>
                                        handleBlur("movingAverageLongDays", e.target.value)
                                    }
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    error={!!errors?.movingAverageLongDays}
                                    helperText={errors?.movingAverageLongDays?.message}
                                    slotProps={{
                                        input: {
                                            inputProps: {
                                                min: 1,
                                            }
                                        }
                                    }}/>
                            </Box>
                        )}
                        {indicator.indicator === IndicatorType.BREAKOUT && (
                            <TextField
                                type="text"
                                label="Breakout Days"
                                value={localValues[indicator.id]?.breakoutDays}
                                onChange={(e) =>
                                    handleLocalChange(indicator.id, "breakoutDays", e.target.value)
                                }
                                onBlur={(e) =>
                                    handleBlur("breakoutDays", e.target.value)
                                }
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                error={!!errors?.breakoutDays}
                                helperText={errors?.breakoutDays?.message}
                                slotProps={{
                                    input: {
                                        inputProps: {
                                            min: 1,
                                        }
                                    }
                                }}/>
                        )}
                        {indicator.indicator === IndicatorType.NONE && (
                            <Typography variant="body2" color="textSecondary" sx={{mt: 2}}>
                                No additional configuration needed
                            </Typography>
                        )}
                    </Grid>

                    <Grid size={{xs: 12, sm: 1}}
                          sx={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
                        <IconButton
                            onClick={() => removeIndicator(indicator.id)}
                            color="error"
                            size="large"
                            sx={{mt: {xs: 0, sm: 2}}}
                        >
                            <Delete/>
                        </IconButton>
                    </Grid>
                </Grid>
            ))}
        </Box>
    );
}