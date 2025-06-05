import {Box, Divider, Grid, Paper, Typography} from "@mui/material";
import {Fragment} from "react";
import {SimulationResult} from "../../model/simulation/SimulationResult.ts";
import {
    DISPLAY_NONE,
    extractRequestDetails,
    extractResults
} from "../../services/comparison/comparisonMetricsFormatService.ts";

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
                contents={results.map(r => extractRequestDetails(r))}
                colors={colors}
            />
            <MetricsCard
                name={"Results"}
                contents={results.map(r => extractResults(r))}
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
    const filteredKeys = keys.filter(key => contents
        .some(record => record[key] != DISPLAY_NONE));

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
            {filteredKeys.map((key) => (
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


            {values
                .map((metricsForSimulation, simulationIndex) => (
                    <MetricCell
                        key={`${metricKey}_${simulationIndex}`}
                        value={metricsForSimulation[metricKey]}
                        simulationIndex={simulationIndex}
                        colors={colors}
                    />
                ))}
        </Fragment>
    );
}

interface MetricCellProps {
    value: string;
    simulationIndex: number;
    colors: string[];
}

function MetricCell({value, simulationIndex, colors}: Readonly<MetricCellProps>) {
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
            <Typography variant="body2">{value}</Typography>

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
