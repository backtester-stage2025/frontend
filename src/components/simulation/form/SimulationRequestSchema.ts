import {z} from "zod";
import {SimulationTypes} from "../../../model/request/SimulationTypes.ts";
import {Indicator} from "../../../model/request/Indicator.ts";

export const simulationRequestSchema = z.object({
    brokerName: z.string().nonempty("Broker is required"),
    stockName: z.string().nonempty("Stock name is required"),
    startDate: z.coerce.date({required_error: "Start Date is required"}),
    endDate: z.coerce.date({required_error: "End Date is required"}),
    startCapital: z.coerce.number({
        required_error: "Start Capital is required",
        invalid_type_error: "Start Capital must be a number",
    }).positive("Start Capital must be a positive number"),
    simulationType: z.nativeEnum(SimulationTypes, {
        required_error: "Simulation Type is required",
        invalid_type_error: "Invalid Simulation Type",
    }),
    indicators: z.array(z.object({
        indicator: z.nativeEnum(Indicator, {required_error: "Indicator is required"}),
        movingAverageShortDays: z.number().optional(),
        movingAverageLongDays: z.number().optional(),
        breakoutDays: z.number().optional(),
    })),
    riskTolerance: z.coerce.number()
        .min(0, "Risk Tolerance must be between 0 and 100")
        .max(100, "Risk Tolerance must be between 0 and 100")
        .optional(),
}).strict()
    .refine((data) => data.endDate > data.startDate, {
        path: ["endDate"],
        message: "End Date must be after Start Date",
    })
    .superRefine((data, ctx) => {
        data.indicators.forEach((ind, idx) => {
            if (ind.indicator === Indicator.MOVING_AVERAGE_CROSSOVER) {
                if (ind.movingAverageShortDays === undefined) {
                    ctx.addIssue({
                        path: ["indicators", idx, "movingAverageShortDays"],
                        message: "Short MA days required for crossover",
                        code: z.ZodIssueCode.custom,
                    });
                }
                if (ind.movingAverageLongDays === undefined) {
                    ctx.addIssue({
                        path: ["indicators", idx, "movingAverageLongDays"],
                        message: "Long MA days required for crossover",
                        code: z.ZodIssueCode.custom,
                    });
                }
                if (
                    ind.movingAverageShortDays !== undefined &&
                    ind.movingAverageLongDays !== undefined &&
                    ind.movingAverageShortDays >= ind.movingAverageLongDays
                ) {
                    ctx.addIssue({
                        path: ["indicators", idx, "movingAverageLongDays"],
                        message: "Long MA must be greater than Short MA",
                        code: z.ZodIssueCode.custom,
                    });
                }
            }
            if (ind.indicator === Indicator.BREAKOUT && ind.breakoutDays === undefined) {
                ctx.addIssue({
                    path: ["indicators", idx, "breakoutDays"],
                    message: "Breakout days required for breakout indicator",
                    code: z.ZodIssueCode.custom,
                });
            }
        });
    });