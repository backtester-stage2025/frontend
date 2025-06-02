import {ChangeEvent, useEffect, useState} from 'react';
import {Box, Button, Grid, InputAdornment, TextField, Typography} from '@mui/material';
import {TooltipHtml} from "../util/TooltipHtml.tsx";
import {TOOLTIP_MESSAGES} from '../../constants/tooltipMessages';

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

export function PeriodControls({
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

    const validateShortPeriod = (value: number | null): string => {
        if (value === null) return "";
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

    const validateLongPeriod = (value: number | null): string => {
        if (value === null) return "";
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
        const rawValue = e.target.value;

        const value = rawValue === '' ? null : parseInt(rawValue);
        setInputPeriods(prev => ({...prev, shortPeriod: value ?? 0}));
        setInputErrors(prev => ({...prev, shortPeriod: validateShortPeriod(value)}));
    };

    const handleLongPeriodChange = (e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;

        const value = rawValue === '' ? null : parseInt(rawValue);
        setInputPeriods(prev => ({...prev, longPeriod: value ?? 0}));
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
            <Grid container spacing={2} alignItems="top">
                <Grid size={{xs: 15, md: 5}}>
                    <TooltipHtml
                        title={TOOLTIP_MESSAGES.movingAverageControls.shortMATitle}
                        description={TOOLTIP_MESSAGES.movingAverageControls.shortMAInfo}>
                        <TextField
                            id="shortPeriod"
                            label="Short MA Period"
                            type="number"
                            value={inputPeriods.shortPeriod === 0 ? '' : inputPeriods.shortPeriod}
                            onChange={handleShortPeriodChange}
                            slotProps={{
                                htmlInput: {min: MIN_SHORT_PERIOD, max: MAX_SHORT_PERIOD},
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">days</InputAdornment>
                                    ),
                                }
                            }}
                            error={!!inputErrors.shortPeriod}
                            fullWidth
                            variant="outlined"
                            size="small"
                            sx={{mb: 0.5}}
                        />
                    </TooltipHtml>
                    {inputErrors.shortPeriod && (
                        <Typography color="error" variant="caption" sx={{display: 'block', ml: 2}}>
                            {inputErrors.shortPeriod}
                        </Typography>
                    )}
                </Grid>
                <Grid size={{xs: 15, md: 5}}>
                    <TooltipHtml
                        title={TOOLTIP_MESSAGES.movingAverageControls.longMATitle}
                        description={TOOLTIP_MESSAGES.movingAverageControls.longMAInfo}>
                        <TextField
                            id="longPeriod"
                            label="Long MA Period"
                            type="number"
                            value={inputPeriods.longPeriod === 0 ? '' : inputPeriods.longPeriod}
                            onChange={handleLongPeriodChange}
                            slotProps={{
                                htmlInput: {min: MIN_LONG_PERIOD, max: MAX_LONG_PERIOD},
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">days</InputAdornment>
                                    ),
                                }
                            }}
                            error={!!inputErrors.longPeriod}
                            fullWidth
                            variant="outlined"
                            size="small"
                            sx={{mb: 0.5}}
                        />
                    </TooltipHtml>
                    {inputErrors.longPeriod && (
                        <Typography color="error" variant="caption" sx={{display: 'block', ml: 2}}>
                            {inputErrors.longPeriod}
                        </Typography>
                    )}
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