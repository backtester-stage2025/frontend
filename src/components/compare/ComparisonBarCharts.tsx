import {SimulationResult} from "../../model/simulation/SimulationResult.ts";
import {
    getMetricsForBarCharts,
    getSingleMetricChartOptions
} from "../../services/comparison/comparisonBarChartsService.ts";
import {Grid, Paper} from "@mui/material";
import CanvasJSReact from "@canvasjs/react-stockcharts";

interface ComparisonBarChartsProps {
    results: SimulationResult[];
    colors: string[];
}

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

export function ComparisonBarCharts({results, colors}: Readonly<ComparisonBarChartsProps>) {
    const metrics = getMetricsForBarCharts(results);

    return (
        <Grid size={{xs: 12}} container spacing={2}>
            {metrics.map(({label, values}) => (
                <Grid size={{xs: 12, md: 6, xl: 4}} key={label}>
                    <Paper elevation={3} sx={{padding: 2}}>
                        <CanvasJSChart options={getSingleMetricChartOptions(label, values, colors)}/>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    )
}