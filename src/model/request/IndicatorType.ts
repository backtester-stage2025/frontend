export enum IndicatorType {
    MOVING_AVERAGE_CROSSOVER = "MOVING_AVERAGE_CROSSOVER",
    BREAKOUT = "BREAKOUT",
}

export const indicatorTypeOptions = [
    {label: "Moving Average Crossover", value: IndicatorType.MOVING_AVERAGE_CROSSOVER},
    {label: "Breakout", value: IndicatorType.BREAKOUT},
];