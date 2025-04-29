import {ChangeEvent, useEffect, useState} from 'react';
import {Box, Button, Grid, TextField} from '@mui/material';

export const MIN_SHORT_PERIOD = 5;
export const MAX_SHORT_PERIOD = 100;
export const MIN_LONG_PERIOD = 10;
export const MAX_LONG_PERIOD = 200;

interface MovingAverageControlsProps {
    initialShortPeriod: number;
    initialLongPeriod: number;
    onPeriodsChange: (shortPeriod: number, longPeriod: number) => void;
}

interface PeriodErrors {
    shortPeriod: string;
    longPeriod: string;
}

export function MovingAverageControls({
                                          initialShortPeriod,
                                          initialLongPeriod,
                                          onPeriodsChange
                                      }: Readonly<MovingAverageControlsProps>) {
    const [inputPeriods, setInputPeriods] = useState({
        shortPeriod: initialShortPeriod,
        longPeriod: initialLongPeriod
    });

    const [inputErrors, setInputErrors] = useState<PeriodErrors>({
        shortPeriod: "",
        longPeriod: ""
    });

    const validateShortPeriod = (value: number): string => {
        if (value < MIN_SHORT_PERIOD) {
            return `Short period must be at least ${MIN_SHORT_PERIOD}`;
        }
        if (value > MAX_SHORT_PERIOD) {
            return `Short period must be at most ${MAX_SHORT_PERIOD}`;
        }
        if (value >= inputPeriods.longPeriod) {
            return "Short period must be less than long period";
        }
        return "";
    };

    const validateLongPeriod = (value: number): string => {
        if (value < MIN_LONG_PERIOD) {
            return `Long period must be at least ${MIN_LONG_PERIOD}`;
        }
        if (value > MAX_LONG_PERIOD) {
            return `Long period must be at most ${MAX_LONG_PERIOD}`;
        }
        if (value <= inputPeriods.shortPeriod) {
            return "Long period must be greater than short period";
        }
        return "";
    };

    const handleShortPeriodChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 0;
        setInputPeriods(prev => ({...prev, shortPeriod: value}));
        setInputErrors(prev => ({...prev, shortPeriod: validateShortPeriod(value)}));
    };

    const handleLongPeriodChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 0;
        setInputPeriods(prev => ({...prev, longPeriod: value}));
        setInputErrors(prev => ({...prev, longPeriod: validateLongPeriod(value)}));
    };

    const handleApplyClick = () => {
        const shortError = validateShortPeriod(inputPeriods.shortPeriod);
        const longError = validateLongPeriod(inputPeriods.longPeriod);

        if (shortError || longError) {
            setInputErrors({
                shortPeriod: shortError,
                longPeriod: longError
            });
            return;
        }

        onPeriodsChange(inputPeriods.shortPeriod, inputPeriods.longPeriod);
    };

    useEffect(() => {
        setInputErrors({
            shortPeriod: validateShortPeriod(inputPeriods.shortPeriod),
            longPeriod: validateLongPeriod(inputPeriods.longPeriod)
        });
    }, [inputPeriods.shortPeriod, inputPeriods.longPeriod]);

    return (
        <Box component="form" sx={{mb: 3}}>
            <Grid container spacing={2} alignItems="center">
                <Grid size={{xs: 15, md: 5}}>
                    <TextField
                        id="shortPeriod"
                        label="Short MA Period"
                        type="number"
                        value={inputPeriods.shortPeriod}
                        onChange={handleShortPeriodChange}
                        slotProps={{
                            htmlInput: {min: MIN_SHORT_PERIOD, max: MAX_SHORT_PERIOD}
                        }}
                        error={!!inputErrors.shortPeriod}
                        helperText={inputErrors.shortPeriod}
                        fullWidth
                        variant="outlined"
                        size="small"
                    />
                </Grid>
                <Grid size={{xs: 15, md: 5}}>
                    <TextField
                        id="longPeriod"
                        label="Long MA Period"
                        type="number"
                        value={inputPeriods.longPeriod}
                        onChange={handleLongPeriodChange}
                        slotProps={{
                            htmlInput: {min: MIN_LONG_PERIOD, max: MAX_LONG_PERIOD}
                        }}
                        error={!!inputErrors.longPeriod}
                        helperText={inputErrors.longPeriod}
                        fullWidth
                        variant="outlined"
                        size="small"
                    />
                </Grid>
                <Grid size={{xs: 15, md: 2}}>
                    <Button
                        onClick={handleApplyClick}
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={!!inputErrors.shortPeriod || !!inputErrors.longPeriod}
                    >
                        Apply
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}