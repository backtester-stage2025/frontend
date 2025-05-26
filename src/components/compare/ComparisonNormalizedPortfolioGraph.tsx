import {SimulationResult} from "../../model/simulation/SimulationResult.ts";
import {Grid, Paper} from "@mui/material";
import {getNormalizedComparisonChartOptions} from "../../services/comparison/comparisonNormalizedChartService.ts";
import CanvasJSReact from "@canvasjs/react-stockcharts";

interface NormalizedPortfolioValuesProps {
    results: SimulationResult[];
    colors: string[];
}

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export function NormalizedPortfolioValues({results, colors}: Readonly<NormalizedPortfolioValuesProps>) {
    const chartOptions = getNormalizedComparisonChartOptions(results, colors);

    return (
        <Grid size={{xs: 12}}>
            <Paper elevation={3} sx={{padding: 2}}>
                <CanvasJSChart options={chartOptions}/>
            </Paper>
        </Grid>
    )
}