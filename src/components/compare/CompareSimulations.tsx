import {useLocation} from "react-router-dom";
import {Grid, Typography} from "@mui/material";
import {MetricsComparison} from "./MetricsComparison.tsx";
import {ComparisonBarCharts} from "./ComparisonBarCharts.tsx";
import {NormalizedPortfolioValues} from "./ComparisonNormalizedPortfolioGraph.tsx";
import {SimulationSummary} from "../../model/simulation/SimulationSummary.ts";
import {useGetSimulationsByIds} from "../../hooks/useSimulationHistory.ts";
import {Loader} from "../util/Loader.tsx";
import {ErrorAlert} from "../util/Alerts.tsx";

const canvasColors = [
    "#1f77b4", // Blue – Simulation 1
    "#ff7f0e", // Orange – Simulation 2
    "#2ca02c", // Green – Simulation 3
    "#d62728", // Red – Simulation 4
    "#9467bd"  // Purple – Simulation 5
];

interface CompareSimulationsProps {
    results: SimulationSummary[]
}

export function CompareSimulations() {
    const location = useLocation();
    const inputState = location.state as CompareSimulationsProps;
    const results = inputState.results;

    const {isLoading, isError, simulations} = useGetSimulationsByIds(results.map(r => r.id));

    if (isLoading) {
        return <Loader message="Loading all simulations"/>
    }

    if (isError || !simulations) {
        return <ErrorAlert message="Error while fetching simulations"/>;
    }

    return (
        <Grid container spacing={2} padding={2}>
            <Grid size={{xs: 12}}>
                <Typography variant="h4" gutterBottom>
                    Simulation Comparison
                </Typography>
            </Grid>

            <MetricsComparison results={simulations} colors={canvasColors}/>
            <NormalizedPortfolioValues results={simulations} colors={canvasColors}/>
            <ComparisonBarCharts results={simulations} colors={canvasColors}/>
        </Grid>
    );
}