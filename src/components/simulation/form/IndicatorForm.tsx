import {Button, IconButton, MenuItem, TextField} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {Indicator} from "../../../model/request/Indicator.ts";

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

export function IndicatorForm({
                                  indicators,
                                  addIndicator,
                                  removeIndicator,
                                  updateIndicator,
                              }: Readonly<IndicatorFormProps>) {
    return (
        <div>
            {indicators.map((indicator) => (
                <div key={indicator.id}>
                    <TextField
                        select
                        label="Indicator Type"
                        value={indicator.indicator}
                        onChange={(e) => updateIndicator(indicator.id, "indicator", e.target.value as Indicator)}
                        fullWidth
                    >
                        {Object.values(Indicator).map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
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
                </div>
            ))}
            <Button onClick={addIndicator} variant="contained" color="primary">
                Add Indicator
            </Button>
        </div>
    );
}