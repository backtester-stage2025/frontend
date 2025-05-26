import {Box, Divider, Grid, Paper, Typography} from "@mui/material";
import {Fragment} from "react";
import {SimulationResult} from "../../model/simulation/SimulationResult.ts";
import {extractRequest, extractResults} from "../../services/comparison/comparisonMetricsFormatService.ts";

interface MetricsComparisonProps {
    results: SimulationResult[];
    colors: string[];
}

export function MetricsComparison({results, colors}: Readonly<MetricsComparisonProps>) {
    if (results.length === 0) {
        return null;
    }

    return (
        <Grid size={{xs: 12}}>
            <MetricsCard
                name={"Details"}
                contents={results.map(extractRequest)}
                colors={colors}
            />
            <MetricsCard
                name={"Results"}
                contents={results.map(extractResults)}
                colors={colors}
            />
        </Grid>
    );
}

interface MetricsCardProps {
    name: string;
    contents: Record<string, string>[];
    colors: string[];
}

function MetricsCard({contents, colors, name}: Readonly<MetricsCardProps>) {
    return (
        <Paper elevation={3} sx={{padding: 2, m: 2}}>
            <Typography variant="h6" gutterBottom>
                {name}
            </Typography>
            <Divider sx={{mb: 2}}/>
            <MetricsGrid
                contents={contents}
                colors={colors}
            />
        </Paper>
    )
}

interface MetricsGridProps {
    contents: Record<string, string>[];
    colors: string[];
}

function MetricsGrid({contents, colors}: Readonly<MetricsGridProps>) {
    const keys = Object.keys(contents[0]);
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: `1fr repeat(${contents.length}, 1fr)`,
                gap: 2,
                alignItems: 'stretch',
            }}
        >
            <MetricsHeader metricsPerSimulation={contents} colors={colors}/>
            {keys.map((key) => (
                <MetricRow
                    key={key}
                    metricKey={key}
                    values={contents}
                    colors={colors}
                />
            ))}
        </Box>
    );
}

interface MetricsHeaderProps {
    metricsPerSimulation: Record<string, string>[];
    colors: string[];
}

function MetricsHeader({metricsPerSimulation, colors}: Readonly<MetricsHeaderProps>) {
    return <>
        <Box/> {/* Empty box for left-side label */}
        {metricsPerSimulation.map((_, i) => (
            <Box key={`header_${colors[i]}`}
                 sx={{
                     mb: 1,
                     textAlign: 'center',
                     fontWeight: 'bold',
                     borderBottom: `4px solid ${colors[i % colors.length]}`,
                     pb: '4px'
                 }}
            >
                Simulation {i + 1}
            </Box>
        ))}
    </>;
}

interface MetricRowProps {
    metricKey: string;
    values: Record<string, string>[];
    colors: string[];
}

function MetricRow({metricKey, values, colors}: Readonly<MetricRowProps>) {
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

            {values.map((metricsForSimulation, simulationIndex) => (
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