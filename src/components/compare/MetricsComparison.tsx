import {Box, Divider, Grid, Paper, Typography} from "@mui/material";
import {Fragment} from "react";
import {SimulationResult} from "../../model/simulation/SimulationResult.ts";
import {extractMetrics} from "../../services/comparisonFormatService.ts";

interface MetricsComparisonProps {
    results: SimulationResult[];
    colors: string[];
}

export function MetricsComparison({results, colors}: Readonly<MetricsComparisonProps>) {
    if (results.length === 0) {
        return null;
    }

    const metricsPerSimulation = results.map(extractMetrics);
    const metricKeys = Object.keys(metricsPerSimulation[0])

    return (
        <Grid size={{xs: 12}}>
            <Paper elevation={3} sx={{padding: 2}}>
                <Typography variant="h6" gutterBottom>
                    Metrics
                </Typography>
                <Divider sx={{mb: 2}}/>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: `1fr repeat(${results.length}, 1fr)`,
                        gap: 2,
                        alignItems: 'stretch',
                    }}
                >
                    <MetricsHeader metricsPerSimulation={metricsPerSimulation} results={results} colors={colors}/>
                    {metricKeys.map((key) => (
                        <MetricRow
                            key={key}
                            metricKey={key}
                            metricsPerSimulation={metricsPerSimulation}
                            colors={colors}
                        />
                    ))}
                </Box>
            </Paper>
        </Grid>
    );
}

interface MetricsHeaderProps {
    metricsPerSimulation: Record<string, string>[];
    results: SimulationResult[];
    colors: string[];
}

function MetricsHeader({metricsPerSimulation, results, colors}: Readonly<MetricsHeaderProps>) {
    return <>
        <Box/> {/* Empty box for left-side label */}
        {metricsPerSimulation.map((_,i)=><Box
            key={`header_${results[i].id}`}
            sx={{
                mb: 1,
                textAlign: 'center',
                fontWeight: 'bold',
                borderBottom: `4px solid ${colors[i % colors.length]}`,
                pb: '4px'
            }}
        >
            Simulation {i + 1}
        </Box>)}
    </>;
}

interface MetricColumnProps {
    metricKey: string;
    metricsPerSimulation: Record<string, string>[];
    colors: string[];
}

function MetricRow({metricKey, metricsPerSimulation, colors}: Readonly<MetricColumnProps>) {
    return (
        <Fragment>
            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                height: "100%",
                textAlign: "center"
            }}>
                {metricKey}
            </Box>

            {metricsPerSimulation.map((metricsForSimulation, simulationIndex) => (
                <MetricCell
                    key={`${metricKey}_${simulationIndex}`}
                    metricsForSimulation={metricsForSimulation}
                    metricKey={metricKey}
                    simulationIndex={simulationIndex}
                    colors={colors}
                />
            ))}
        </Fragment>
    );
}

interface MetricCellProps {
    metricsForSimulation: Record<string, string>;
    metricKey: string;
    simulationIndex: number;
    colors: string[];
}

function MetricCell({metricsForSimulation, metricKey, simulationIndex, colors}: Readonly<MetricCellProps>) {
    return (
        <Box sx={{
            p: 1,
            whiteSpace: "pre-line",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            textAlign: "center",
        }}>
            <Typography variant="body2">{metricsForSimulation[metricKey]}</Typography>

            <Divider
                sx={{
                    mt: 1,
                    backgroundColor: colors[simulationIndex % colors.length],
                    height: "1px",
                    alignSelf: "stretch",
                }}
            />
        </Box>);
}