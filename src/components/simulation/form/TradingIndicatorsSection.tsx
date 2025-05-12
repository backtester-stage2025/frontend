import { Box, Button, Divider, Paper, Stack, Typography} from "@mui/material";
import {IndicatorDetails, SimulationRequest} from "../../../model/request/SimulationRequest.ts";
import {IndicatorForm} from "./IndicatorForm.tsx";
import {Indicator} from "../../../model/request/Indicator.ts";
import {Control, FieldErrors, useFieldArray} from "react-hook-form";
import {InfoAlert} from "../../util/Alerts.tsx";

interface TradingIndicatorSectionProps {
    control: Control<SimulationRequest>
    errors: FieldErrors<SimulationRequest>
}

export default function TradingIndicatorsSection({ control, errors } : Readonly<TradingIndicatorSectionProps>) {
    const {
        fields: indicatorFields,
        append,
        remove,
        update
    } = useFieldArray({ control, name: "indicators" });

    const addIndicator = () => {
        append({
            indicator: Indicator.NONE,
            movingAverageShortDays: undefined,
            movingAverageLongDays: undefined,
            breakoutDays: undefined
        });
    };

    const updateIndicator = (index: number, field: keyof IndicatorDetails, value: number | Indicator | undefined) => {
        const updated = { ...indicatorFields[index], [field]: value };
        update(index, updated);
    };

    return (
        <Box mt={3}>
            <Typography variant="h6" gutterBottom>Trading Indicators</Typography>
            <Divider sx={{ mb: 2 }} />

            {indicatorFields.length > 0 ? (
                <Stack spacing={2}>
                    {indicatorFields.map((field, index: number) => (
                        <Paper key={field.id} elevation={2} sx={{ p: 2 }}>
                            <IndicatorForm
                                indicators={[field]}
                                addIndicator={() => {}}
                                removeIndicator={() => remove(index)}
                                updateIndicator={(_, fieldKey, value) =>
                                    updateIndicator(index, fieldKey as keyof IndicatorDetails, value)
                                }
                                errors={errors.indicators?.[index] ? { 0: errors.indicators[index] } : undefined}
                            />
                        </Paper>
                    ))}
                </Stack>
            ) : <InfoAlert message={"No indicators added yet. Add an indicator to enhance your strategy."}/>}

            <Button onClick={addIndicator} variant="outlined" color="primary" sx={{ mt: 2 }}>
                Add Indicator
            </Button>
        </Box>
    );
}