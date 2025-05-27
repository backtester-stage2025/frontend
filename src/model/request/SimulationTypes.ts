export enum SimulationTypes {
    RISK_BASED = "RISK_BASED",
    BUY_AND_HOLD = "BUY_AND_HOLD",
    STATIC = "STATIC",
}

export const simulationTypeOptions = [
    {label: "Risk Based (dynamic)", value: SimulationTypes.RISK_BASED},
    {label: "Risk Based (static)", value: SimulationTypes.STATIC},
    {label: "Buy and Hold", value: SimulationTypes.BUY_AND_HOLD}
]