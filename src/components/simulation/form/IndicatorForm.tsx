import {Box, Button, IconButton, MenuItem, TextField} from "@mui/material";
import {Add, Delete} from "@mui/icons-material";
import {Indicator, indicatorOptions} from "../../../model/request/Indicator.ts";

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
}

export function IndicatorForm({indicators, addIndicator, removeIndicator, updateIndicator}: Readonly<IndicatorFormProps>) {
    return (
        <Box mt={3}>
            <Button variant="contained" onClick={addIndicator} startIcon={<Add />}>
                Add Indicator
            </Button>
            {indicators.map((indicator) => (
                <Box key={indicator.id} display="flex" alignItems="center" gap={2} mt={2}>
                    <TextField
                        select
                        label="Indicator Type"
                        value={indicator.indicator}
                        onChange={(e) => updateIndicator(indicator.id, "indicator", e.target.value as Indicator)}
                        fullWidth
                    >
                        {indicatorOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    {indicator.indicator === Indicator.MOVING_AVERAGE_CROSSOVER && (
                        <>
                            <TextField
                                type="number"
                                label="Short MA Days"
                                value={indicator.movingAverageShortDays ?? ""}
                                onChange={(e) =>
                                    updateIndicator(indicator.id, "movingAverageShortDays", parseInt(e.target.value) || undefined)
                                }
                                fullWidth
                            />
                            <TextField
                                type="number"
                                label="Long MA Days"
                                value={indicator.movingAverageLongDays ?? ""}
                                onChange={(e) =>
                                    updateIndicator(indicator.id, "movingAverageLongDays", parseInt(e.target.value) || undefined)
                                }
                                fullWidth
                            />
                        </>
                    )}
                    {indicator.indicator === Indicator.BREAKOUT && (
                        <TextField
                            type="number"
                            label="Breakout Days"
                            value={indicator.breakoutDays ?? ""}
                            onChange={(e) =>
                                updateIndicator(indicator.id, "breakoutDays", parseInt(e.target.value) || undefined)
                            }
                            fullWidth
                        />
                    )}
                    <IconButton onClick={() => removeIndicator(indicator.id)} color="error">
                        <Delete/>
                    </IconButton>
                </Box>
            ))}
        </Box>
    );
}