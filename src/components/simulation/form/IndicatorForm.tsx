import {Box, Grid, IconButton, MenuItem, TextField, Typography} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {Indicator} from "../../../model/request/Indicator.ts";
import {useState} from "react";

type IndicatorValue = string | number;

interface IndicatorFormProps {
    indicators: {
        id: string;
        indicator: Indicator;
        movingAverageShortDays?: number;
        movingAverageLongDays?: number;
        breakoutDays?: number;
    }[];
    addIndicator: () => void;
    removeIndicator: (id: string) => void;
    updateIndicator: (id: string, key: string, value: Indicator | number | undefined) => void;
    errors?: Record<string, {
        movingAverageShortDays?: { message: string };
        movingAverageLongDays?: { message: string };
        breakoutDays?: { message: string };
        indicator?: { message: string };
    }>;
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

    const handleBlur = (id: string, key: string, value: string) => {
        const parsedValue = value === '' ? undefined : parseInt(value, 10) || undefined;
        updateIndicator(id, key, parsedValue);
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
                            onChange={(e) => updateIndicator(indicator.id, "indicator", e.target.value as Indicator)}
                            fullWidth
                            variant="outlined"
                            margin="normal"
                            error={!!errors?.[0]?.indicator}
                            helperText={errors?.[0]?.indicator?.message}
                        >
                            {Object.values(Indicator).map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option.replace(/_/g, ' ')}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid size={{xs: 12, sm: 5}}>
                        {indicator.indicator === Indicator.MOVING_AVERAGE_CROSSOVER && (
                            <Box sx={{display: 'flex', gap: 2}}>
                                <TextField
                                    type="text"
                                    label="Short MA Days"
                                    value={localValues[indicator.id]?.movingAverageShortDays}
                                    onChange={(e) =>
                                        handleLocalChange(indicator.id, "movingAverageShortDays", e.target.value)
                                    }
                                    onBlur={(e) =>
                                        handleBlur(indicator.id, "movingAverageShortDays", e.target.value)
                                    }
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    error={!!errors?.[0]?.movingAverageShortDays}
                                    helperText={errors?.[0]?.movingAverageShortDays?.message}
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
                                        handleBlur(indicator.id, "movingAverageLongDays", e.target.value)
                                    }
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    error={!!errors?.[0]?.movingAverageLongDays}
                                    helperText={errors?.[0]?.movingAverageLongDays?.message}
                                    slotProps={{
                                        input: {
                                            inputProps: {
                                                min: 1,
                                            }
                                        }
                                    }}/>
                            </Box>
                        )}
                        {indicator.indicator === Indicator.BREAKOUT && (
                            <TextField
                                type="text"
                                label="Breakout Days"
                                value={localValues[indicator.id]?.breakoutDays}
                                onChange={(e) =>
                                    handleLocalChange(indicator.id, "breakoutDays", e.target.value)
                                }
                                onBlur={(e) =>
                                    handleBlur(indicator.id, "breakoutDays", e.target.value)
                                }
                                fullWidth
                                variant="outlined"
                                margin="normal"
                                error={!!errors?.[0]?.breakoutDays}
                                helperText={errors?.[0]?.breakoutDays?.message}
                                slotProps={{
                                    input: {
                                        inputProps: {
                                            min: 1,
                                        }
                                    }
                                }}/>
                        )}
                        {indicator.indicator === Indicator.NONE && (
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