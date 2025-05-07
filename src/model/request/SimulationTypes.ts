export enum SimulationTypes {
    RISK_BASED = "RISK_BASED",
    BUY_AND_HOLD = "BUY_AND_HOLD",
    NONE = "NONE",
}

export const simulationTypeOptions = [
    {label: "Risk Based", value: SimulationTypes.RISK_BASED},
    {label: "Buy and Hold", value: SimulationTypes.BUY_AND_HOLD},
]