import {Box, Button, Divider, Paper, Stack, Typography} from "@mui/material";
import {SimulationRequest} from "../../../model/request/SimulationRequest.ts";
import {Control, FieldErrors, useFieldArray} from "react-hook-form";
import {InfoAlert} from "../../util/Alerts.tsx";
import {IndicatorRow} from "./IndicatorRow.tsx";
import {IndicatorType} from "../../../model/request/IndicatorType.ts";

interface TradingIndicatorsSectionProps {
    control: Control<SimulationRequest>;
    errors: FieldErrors<SimulationRequest>;
}

export function TradingIndicatorsSection({control, errors}: Readonly<TradingIndicatorsSectionProps>) {
    const {fields, append, remove} = useFieldArray({
        control,
        name: "indicators"
    });

    const addIndicator = () =>
        append({
            indicator: IndicatorType.BREAKOUT,
            movingAverageShortDays: 12,
            movingAverageLongDays: 26,
            breakoutDays: 30,
            macdShortDays: 12,
            macdLongDays: 26
        });

    return (
        <Box mt={3}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1
            }}>
                <Typography variant="h6">Trading Indicators</Typography>
            </Box>
            <Divider sx={{mb: 2}}/>

            {fields.length === 0 && (
                <InfoAlert message="No indicators added yet. Add one to get started."/>
            )}

            <Stack spacing={3} sx={{mb: 3}}>
                {fields.map((fieldItem, index) => (
                    <Paper
                        key={fieldItem.id}
                        elevation={2}
                        sx={{
                            p: 3,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1
                        }}
                    >
                        <IndicatorRow
                            index={index}
                            control={control}
                            errors={errors}
                            onRemove={() => remove(index)}
                        />
                    </Paper>
                ))}
            </Stack>

            <Button
                onClick={addIndicator}
                variant="outlined"
                startIcon={<span>+</span>}
                sx={{
                    mt: 1,
                    fontWeight: 'medium',
                }}
            >
                Add Indicator
            </Button>
        </Box>
    );
}