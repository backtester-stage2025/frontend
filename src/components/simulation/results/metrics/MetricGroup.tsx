import {Box, Divider, Grid, Paper, Typography} from "@mui/material";
import {Metric, MetricProps} from "./Metric.tsx";

export interface MetricGroupProps {
    title: string;
    properties: MetricProps[];
    color?: string;
}

export function MetricGroup({title, properties}: Readonly<MetricGroupProps>) {
    return (
        <Grid size={{xs: 12, md: 6}} sx={{p: 2, boxShadow: '5px'}}>
            <Paper elevation={1} sx={{p: 2, height: '100%', borderRadius: 2}}>
                <Typography variant="subtitle2" color="text.secondary" mb={2}>
                    {title}
                </Typography>
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    {properties.map((property, index) => (
                        <Box key={index}>
                            <Metric {...property} />
                            {index < properties.length - 1 && <Divider sx={{my: 1.5}}/>}
                        </Box>
                    ))}
                </Box>
            </Paper>
        </Grid>
    );
}