import {
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Grid,
    Typography,
    List,
    ListItem,
    ListItemText
} from "@mui/material";
import {SimulationRequest} from "../../../model/request/SimulationRequest.ts";
import {IndicatorType} from "../../../model/request/IndicatorType.ts";
import {Weekday} from "../../../model/Weekday.ts";
import {SimulationTypes} from "../../../model/request/SimulationTypes.ts";

interface SimulationConfigurationViewProps {
    simulationRequest: SimulationRequest;
}

const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};

const getSimulationTypeLabel = (type: SimulationTypes): string => {
    switch (type) {
        case SimulationTypes.RISK_BASED:
            return "Risk Based";
        case SimulationTypes.BUY_AND_HOLD:
            return "Buy and Hold";
        default:
            return type;
    }
};

const getIndicatorTypeLabel = (type: IndicatorType): string => {
    switch (type) {
        case IndicatorType.MOVING_AVERAGE_CROSSOVER:
            return "Moving Average Crossover";
        case IndicatorType.BREAKOUT:
            return "Breakout";
        default:
            return type;
    }
};

const getWeekdayLabel = (weekday: Weekday): string => {
    return weekday.charAt(0) + weekday.slice(1).toLowerCase();
};

export function SimulationConfigurationView({simulationRequest}: Readonly<SimulationConfigurationViewProps>) {
    return (
        <Box sx={{p: 2}}>
            <Grid container spacing={3}>
                {/* Basic Configuration */}
                <Grid size={{xs:6, md:4}}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Basic Settings
                            </Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemText
                                        primary="Broker"
                                        secondary={simulationRequest.brokerName}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Simulation Type"
                                        secondary={getSimulationTypeLabel(simulationRequest.simulationType)}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Start Capital"
                                        secondary={formatCurrency(simulationRequest.startCapital)}
                                    />
                                </ListItem>
                                {simulationRequest.riskTolerance !== undefined && (
                                    <ListItem>
                                        <ListItemText
                                            primary="Risk Tolerance"
                                            secondary={`${simulationRequest.riskTolerance}%`}
                                        />
                                    </ListItem>
                                )}
                                <ListItem>
                                    <ListItemText
                                        primary="Transaction Buffer"
                                        secondary={`${simulationRequest.transactionBufferPercentage}%`}
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Date Range */}
                <Grid size={{xs:6, md:4}}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Time Period
                            </Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemText
                                        primary="Start Date"
                                        secondary={formatDate(simulationRequest.startDate)}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="End Date"
                                        secondary={formatDate(simulationRequest.endDate)}
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Duration"
                                        secondary={`${Math.ceil((new Date(simulationRequest.endDate).getTime() - new Date(simulationRequest.startDate).getTime()) / (1000 * 60 * 60 * 24))} days`}
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Indicators */}
                <Grid size={{xs:6, md:4}}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Trading Indicators ({simulationRequest.indicators.length})
                            </Typography>
                            {simulationRequest.indicators.length === 0 ? (
                                <Typography variant="body2" color="text.secondary">
                                    No indicators configured
                                </Typography>
                            ) : (
                                <Box sx={{mt: 1}}>
                                    {simulationRequest.indicators.map((indicator, index) => (
                                        <Box key={index} sx={{mb: 2}}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                {getIndicatorTypeLabel(indicator.indicator)}
                                            </Typography>
                                            <Box sx={{ml: 2}}>
                                                {indicator.movingAverageShortDays && (
                                                    <Typography variant="body2" color="text.secondary">
                                                        Short MA: {indicator.movingAverageShortDays} days
                                                    </Typography>
                                                )}
                                                {indicator.movingAverageLongDays && (
                                                    <Typography variant="body2" color="text.secondary">
                                                        Long MA: {indicator.movingAverageLongDays} days
                                                    </Typography>
                                                )}
                                                {indicator.breakoutDays && (
                                                    <Typography variant="body2" color="text.secondary">
                                                        Breakout Period: {indicator.breakoutDays} days
                                                    </Typography>
                                                )}
                                            </Box>
                                            {index < simulationRequest.indicators.length - 1 && (
                                                <Divider sx={{mt: 1}}/>
                                            )}
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Stocks */}
                <Grid size={{xs:12, md:6}}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Stock Symbols ({simulationRequest.stockNames.length})
                            </Typography>
                            <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1}}>
                                {simulationRequest.stockNames.map((stock) => (
                                    <Chip key={stock} label={stock} variant="outlined"/>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Trading Days */}
                <Grid size={{xs:12, md:6}}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Trading Days ({simulationRequest.tradingWeekdays.length})
                            </Typography>
                            <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1}}>
                                {simulationRequest.tradingWeekdays.map((day) => (
                                    <Chip key={day} label={getWeekdayLabel(day)} color="primary" variant="outlined"/>
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}