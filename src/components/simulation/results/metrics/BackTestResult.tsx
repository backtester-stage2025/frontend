import {SvgIconComponent} from "@mui/icons-material";
import {ReactNode} from "react";
import {Box, Grid, Typography} from "@mui/material";

interface BackTestResultProps {
    icon: SvgIconComponent;
    title: string;
    children: ReactNode;
}

export function BackTestResult({icon: Icon, title, children}: Readonly<BackTestResultProps>) {
    return (
        <Grid size={{xs: 12, sm: 4}} sx={{p: 2}}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 1}}>
                <Icon color="primary" fontSize="small"/>
                <Typography variant="subtitle2" color="text.secondary">
                    {title}
                </Typography>
            </Box>
            {children}
        </Grid>
    );
}