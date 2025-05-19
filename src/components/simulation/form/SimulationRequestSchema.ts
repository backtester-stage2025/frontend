import {EnumLike, z} from "zod";
import {SimulationTypes} from "../../../model/request/SimulationTypes.ts";
import {IndicatorType} from "../../../model/request/IndicatorType.ts";

const coerceNumber = (description: string) => {
    return z.coerce.number({
        required_error: `${description} is required`,
        invalid_type_error: `${description} is invalid`,
    });
};

const coercePositiveNumber = (description: string) => coerceNumber(description).positive(`${description} must be positive.`);

const coerceEnum = <T extends EnumLike>(values: T, description: string) => {
    return z.nativeEnum(values, {
        required_error: `${description} is required`,
        invalid_type_error: `${description} is invalid`
    });
}

const indicatorSchema = z.object({
    indicator: coerceEnum(IndicatorType, "Indicator Type"),
    movingAverageShortDays: coerceNumber("Short moving average day count").optional(),
    movingAverageLongDays: coerceNumber("Long moving average day count").optional(),
    breakoutDays: coerceNumber("Breakout day count").optional(),
});


export const simulationRequestSchema = z.object({
    stockName: z.string().nonempty("Stock name is required"),
    brokerName: z.string().nonempty("Broker name is required"),
    startDate: z.coerce.date({required_error: "Start Date is required"}),
    endDate: z.coerce.date({required_error: "End Date is required"}),
    startCapital: coercePositiveNumber("Start Capital"),
    simulationType: coerceEnum(SimulationTypes, "Simulation Type"),
    indicators: z.array(indicatorSchema),
    riskTolerance: coerceNumber("Risk Tolerance").optional(),
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

        data.indicators.forEach((ind, idx) => {
            if (ind.indicator === IndicatorType.MOVING_AVERAGE_CROSSOVER) {
                if (ind.movingAverageShortDays === undefined) {
                    ctx.addIssue({
                        path: ["indicators", idx, "movingAverageShortDays"],
                        message: "Short MA days required for crossover",
                        code: z.ZodIssueCode.custom,
                    });
                } else if (ind.movingAverageShortDays <= 0) {
                    ctx.addIssue({
                        path: ["indicators", idx, "movingAverageShortDays"],
                        message: "Short MA must be positive",
                        code: z.ZodIssueCode.custom,
                    });
                }

                if (ind.movingAverageLongDays === undefined) {
                    ctx.addIssue({
                        path: ["indicators", idx, "movingAverageLongDays"],
                        message: "Long MA days required for crossover",
                        code: z.ZodIssueCode.custom,
                    });
                } else if (ind.movingAverageLongDays <= 0) {
                    ctx.addIssue({
                        path: ["indicators", idx, "movingAverageLongDays"],
                        message: "Long MA must be positive",
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

            if (ind.indicator === IndicatorType.BREAKOUT) {
                if (ind.breakoutDays === undefined) {
                    ctx.addIssue({
                        path: ["indicators", idx, "breakoutDays"],
                        message: "Breakout days required for breakout indicator",
                        code: z.ZodIssueCode.custom,
                    });
                } else if (ind.breakoutDays <= 0) {
                    ctx.addIssue({
                        path: ["indicators", idx, "breakoutDays"],
                        message: "Breakout days must be positive",
                        code: z.ZodIssueCode.custom,
                    });
                }
            }
        });
    });
