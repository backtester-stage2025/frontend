import {z} from "zod";
import {SimulationTypes} from "../../../model/request/SimulationTypes.ts";

const maxMovingAverage = 1000

export const simulationRequestSchema = z.object({
    stockName: z.string().nonempty("CSV file name is required"),
    startDate: z.coerce.date({required_error: "Start Date is required"}),
    endDate: z.coerce.date({required_error: "End Date is required"}),
    startCapital: z.coerce.number({
        required_error: "Start Capital is required",
        invalid_type_error: "Start Capital must be a number",
    }).positive("Start Capital must be a positive number"),
    simulationType: z.nativeEnum(SimulationTypes, {
        required_error: "Simulation Type is required",
        invalid_type_error: "Invalid Simulation Type"
    }),
    useMovingAverageCrossover: z.boolean().optional(),
    movingAverageShortDays: z.coerce.number()
        .max(maxMovingAverage, `Short moving average days must be between 0 and ${maxMovingAverage}`)
        .positive("Short MA must be positive").optional(),
    movingAverageLongDays: z.coerce.number()
        .max(maxMovingAverage, `Long moving average days must be between 0 and ${maxMovingAverage}`)
        .positive("Long MA must be positive").optional(),
    riskTolerance: z.coerce.number()
        .min(0, "Risk Tolerance must be between 0 and 100")
        .max(100, "Risk Tolerance must be between 0 and 100")
        .optional(),
}).refine((data) => data.endDate > data.startDate, {
    path: ["endDate"],
    message: "End Date must be after Start Date",
}).refine((data) => {
    if (data.useMovingAverageCrossover) {
        return data.movingAverageShortDays !== undefined && data.movingAverageLongDays !== undefined;
    }
    return true;
}, {
    path: ["movingAverageShortDays"],
    message: "Moving Average Short and Long days are required when Moving Average Crossover is enabled",
}).refine((data) => {
    if (
        data.useMovingAverageCrossover &&
        data.movingAverageShortDays !== undefined &&
        data.movingAverageLongDays !== undefined
    ) {
        return data.movingAverageShortDays < data.movingAverageLongDays;
    }
    return true;
}, {
    path: ["movingAverageLongDays"],
    message: "Long MA must be greater than Short MA when Moving Average Crossover is enabled",
});