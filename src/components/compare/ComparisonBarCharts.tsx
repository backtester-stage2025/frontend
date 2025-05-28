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
                label === "Total Fees"
                    ? <BarChart
                        key={label}
                        label={label}
                        values={values}
                        colors={colors}
                        currencies={results.map(r => r.currencyType)}
                    />
                    : <BarChart
                        key={label}
                        label={label}
                        values={values}
                        colors={colors}
                    />
            ))}
        </Grid>
    )
}

interface BarChartProps {
    values: number[];
    label: string;
    colors: string[];
    currency?: string;
    currencies?: string[];
}

function BarChart({label, values, colors, currencies}: Readonly<BarChartProps>) {
    if (values.every(v => v === 0)) {
        return null;
    }

    const dataPoints = label === "Total Fees"
        ? values.map((value, index) => {
            let barLabel = "Simulation " + (index + 1);
            if (currencies?.[index]) {
                barLabel += " (" + currencies[index] + ")";
            }
            return {
                label: barLabel,
                y: value,
                color: colors[index % colors.length]
            };
        })
        : values.map((value, index) => ({
            label: `Simulation ${index + 1}`,
            y: value,
            color: colors[index % colors.length]
        }));

    return (
        <Grid size={{xs: 12, md: 6, xl: 4}}>
            <Paper elevation={3} sx={{padding: 2}}>
                <CanvasJSChart options={{
                    ...getSingleMetricChartOptions(label, values, colors),
                    data: [
                        {
                            type: "column",
                            dataPoints
                        }
                    ]
                }}/>
            </Paper>
        </Grid>
    )
}
