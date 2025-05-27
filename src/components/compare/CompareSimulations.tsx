import {useLocation} from "react-router-dom";
import {Grid, Typography} from "@mui/material";
import {SimulationResult} from "../../model/simulation/SimulationResult.ts";
import {MetricsComparison} from "./MetricsComparison.tsx";
import {ComparisonBarCharts} from "./ComparisonBarCharts.tsx";
import {NormalizedPortfolioValues} from "./ComparisonNormalizedPortfolioGraph.tsx";


const canvasColors = [
    "#1f77b4", // Blue – Simulation 1
    "#ff7f0e", // Orange – Simulation 2
    "#2ca02c", // Green – Simulation 3
    "#d62728", // Red – Simulation 4
    "#9467bd"  // Purple – Simulation 5
];

interface CompareSimulationsProps {
    results: SimulationResult[]
}

export function CompareSimulations() {
    const location = useLocation();
    const inputState = location.state as CompareSimulationsProps;
    const results = inputState.results;

    return (
        <Grid container spacing={2} padding={2}>
            <Grid size={{xs: 12}}>
                <Typography variant="h4" gutterBottom>
                    Simulation Comparison
                </Typography>
            </Grid>

            <MetricsComparison results={results} colors={canvasColors}/>
            <NormalizedPortfolioValues results={results} colors={canvasColors}/>
            <ComparisonBarCharts results={results} colors={canvasColors}/>
        </Grid>
    );
}