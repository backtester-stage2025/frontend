import {z} from "zod";
import {SimulationTypes} from "../../../model/request/SimulationTypes.ts";
import {IndicatorType} from "../../../model/request/IndicatorType.ts";

export const simulationRequestSchema = z.object({
    stockName: z.string().nonempty("Stock name is required"),
    brokerName: z.string().nonempty("Stock name is required"),
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
        indicator: z.nativeEnum(IndicatorType, {required_error: "Indicator is required"}),
        movingAverageShortDays: z.coerce.number().optional(),
        movingAverageLongDays: z.coerce.number().optional(),
        breakoutDays: z.coerce.number().optional(),
    })),
    riskTolerance: z.coerce.number()
        .optional(),
}).strict()
    .refine((data) => data.endDate > data.startDate, {
        path: ["endDate"],
        message: "End Date must be after Start Date",
    })
    .superRefine((data, ctx) => {
        if (data.simulationType === SimulationTypes.RISK_BASED) {
            if (data.riskTolerance === undefined) {
                ctx.addIssue({
                    path: ["riskTolerance"],
                    message: "Risk Tolerance is required for Risk-Based simulation",
                    code: z.ZodIssueCode.custom,
                });
            } else if (data.riskTolerance < 0 || data.riskTolerance > 100) {
                ctx.addIssue({
                    path: ["riskTolerance"],
                    message: "Risk Tolerance must be between 0 and 100",
                    code: z.ZodIssueCode.custom
                })
            }
        }

        console.log(data.indicators)

        data.indicators.forEach((ind, idx) => {
            if (ind.indicator === IndicatorType.MOVING_AVERAGE_CROSSOVER) {
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
            if (ind.indicator === IndicatorType.BREAKOUT && ind.breakoutDays === undefined) {
                ctx.addIssue({
                    path: ["indicators", idx, "breakoutDays"],
                    message: "Breakout days required for breakout indicator",
                    code: z.ZodIssueCode.custom,
                });
            }
        });
    });