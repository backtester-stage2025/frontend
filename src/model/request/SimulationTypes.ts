export enum SimulationTypes {
    RISK_BASED = "RISK_BASED",
    BUY_AND_HOLD = "BUY_AND_HOLD",
    STATIC = "STATIC",
}

export const simulationTypeOptions = [
    {label: "Risk Based", value: SimulationTypes.RISK_BASED},
    {label: "Buy and Hold", value: SimulationTypes.BUY_AND_HOLD},
    {label: "Static", value: SimulationTypes.STATIC}
]