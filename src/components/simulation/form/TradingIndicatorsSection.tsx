import { Box, Button, Divider, Paper, Stack, Typography} from "@mui/material";
import {IndicatorDetails, SimulationRequest} from "../../../model/request/SimulationRequest.ts";
import {IndicatorForm} from "./IndicatorForm.tsx";
import {IndicatorType} from "../../../model/request/IndicatorType.ts";
import {Control, FieldErrors, useFieldArray} from "react-hook-form";
import {InfoAlert} from "../../util/Alerts.tsx";

interface TradingIndicatorSectionProps {
    control: Control<SimulationRequest>
    errors: FieldErrors<SimulationRequest>
}

export default function TradingIndicatorsSection({ control, errors: simulationRequestFieldErrors } : Readonly<TradingIndicatorSectionProps>) {
    const {
        fields: indicatorFields,
        append,
        remove,
        update
    } = useFieldArray({ control, name: "indicators" });

    const addIndicator = () => {
        append({
            indicator: IndicatorType.NONE,
            movingAverageShortDays: undefined,
            movingAverageLongDays: undefined,
            breakoutDays: undefined
        });
    };

    const updateIndicator = (index: number, changes: Partial<IndicatorDetails>) => {
        const updated = { ...indicatorFields[index], ...changes };
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
                                updateIndicator={(partialIndicator) =>
                                    updateIndicator(index, partialIndicator)}
                                errors={simulationRequestFieldErrors.indicators?.[index]}
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