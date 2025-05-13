import { Box, Button, Divider, Paper, Stack, Typography} from "@mui/material";
import {SimulationRequest} from "../../../model/request/SimulationRequest.ts";
import {IndicatorType} from "../../../model/request/IndicatorType.ts";
import {Control, FieldErrors, useFieldArray} from "react-hook-form";
import {InfoAlert} from "../../util/Alerts.tsx";
import {IndicatorRow} from "./IndicatorRow.tsx";

interface TradingIndicatorsSectionProps {
    control: Control<SimulationRequest>;
    errors: FieldErrors<SimulationRequest>;
}

export function TradingIndicatorsSection({control, errors}: Readonly<TradingIndicatorsSectionProps>) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "indicators"
    });

    const addIndicator = () =>
        append({
            indicator: IndicatorType.NONE,
            movingAverageShortDays: undefined,
            movingAverageLongDays: undefined,
            breakoutDays: undefined
        });

    return (
        <Box mt={3}>
            <Typography variant="h6">Trading Indicators</Typography>
            <Divider sx={{ mb: 2 }} />

            {fields.length === 0 && (
                <InfoAlert message="No indicators added yet. Add one to get started." />
            )}

            <Stack spacing={2}>
                {fields.map((fieldItem, index) => (
                    <Paper key={fieldItem.id} sx={{ p: 2 }}>
                        <IndicatorRow
                            index={index}
                            control={control}
                            errors={errors}
                            onRemove={() => remove(index)}
                        />
                    </Paper>
                ))}
            </Stack>

            <Button onClick={addIndicator} variant="outlined">
                Add Indicator
            </Button>
        </Box>
    );
}