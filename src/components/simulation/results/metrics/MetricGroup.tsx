import {Box, Divider, Grid, IconButton, Paper, Typography} from "@mui/material";
import {Metric, MetricProps} from "./Metric.tsx";
import {TooltipHtml} from "../../../util/TooltipHtml.tsx";
import InfoIcon from "@mui/icons-material/Info";

export interface MetricGroupProps {
    title: string;
    properties: MetricProps[];
    color?: string;
    tooltip?: {
        title?: string;
        info: string;
        link?: string;
    }
}

export function MetricGroup({title, properties, tooltip}: Readonly<MetricGroupProps>) {
    return (
        <Grid size={{xs: 12, md: 6}} sx={{p: 2, boxShadow: '5px'}}>
            <Paper elevation={1} sx={{p: 2, height: '100%', borderRadius: 2}}>
                <Box
                    sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', mb: 4}}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{lineHeight: 1}}>
                        {title}
                    </Typography>
                    {tooltip && (
                        <Box sx={{position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)'}}>
                            <TooltipHtml title={tooltip.title} info={tooltip.info} link={tooltip.link}>
                                <IconButton sx={{color: 'rgba(0, 0, 0, 0.3)', padding: 0}}>
                                    <InfoIcon sx={{fontSize: '1.2rem'}}/>
                                </IconButton>
                            </TooltipHtml>
                        </Box>
                    )}
                </Box>
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