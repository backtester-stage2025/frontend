export enum Indicator {
    NONE = "NONE",
    MOVING_AVERAGE_CROSSOVER = "MOVING_AVERAGE_CROSSOVER",
    BREAKOUT = "BREAKOUT",
}

export const indicatorOptions = [
    {label: "None", value: Indicator.NONE},
    {label: "Moving Average Crossover", value: Indicator.MOVING_AVERAGE_CROSSOVER},
    {label: "Breakout", value: Indicator.BREAKOUT},
];