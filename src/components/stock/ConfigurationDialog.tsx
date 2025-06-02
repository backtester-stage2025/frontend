import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    Stack,
    Switch,
    Typography
} from "@mui/material";
import {Settings, TrendingUp} from "@mui/icons-material";
import {PeriodControls} from "./PeriodControls.tsx";
import {ChartSettings} from "./StockChart.tsx";
import {Dispatch, SetStateAction} from "react";

interface ConfigurationDialogProps {
    configDialogOpen: boolean;
    setConfigDialogOpen: (open: boolean) => void;
    settings: ChartSettings;
    setSettings: (settings: ChartSettings) => void;
    tempSettings: ChartSettings;
    setTempSettings: Dispatch<SetStateAction<ChartSettings>>;
}

export function ConfigurationDialog({
                                        configDialogOpen,
                                        setConfigDialogOpen,
                                        settings,
                                        setSettings,
                                        tempSettings,
                                        setTempSettings
                                    }: Readonly<ConfigurationDialogProps>) {

    const handleConfigSave = () => {
        setSettings(tempSettings);
        setConfigDialogOpen(false);
    };

    const handleConfigCancel = () => {
        setTempSettings(settings);
        setConfigDialogOpen(false);
    };

    const handlePeriodsChange = (shortPeriod: number, longPeriod: number) => {
        setTempSettings(prev => ({
            ...prev,
            shortPeriod,
            longPeriod
        }));
    };


    return (
        <Dialog
            open={configDialogOpen}
            onClose={handleConfigCancel}
            maxWidth="md"
            fullWidth
            slotProps={{
                paper: {
                    sx: {borderRadius: 2}
                }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'primary.main',
                color: 'primary.contrastText'
            }}>
                <Settings sx={{mr: 1}}/>
                Chart Configuration
            </DialogTitle>

            <DialogContent sx={{pt: 3}}>
                <Box sx={{mb: 4}}>
                    <Typography variant="h6" gutterBottom sx={{display: 'flex', alignItems: 'center'}}>
                        <TrendingUp sx={{mr: 1}}/>
                        Technical Indicators
                    </Typography>

                    <Stack spacing={2}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={tempSettings.showMovingAverages}
                                    onChange={(e) => setTempSettings(prev => ({
                                        ...prev,
                                        showMovingAverages: e.target.checked
                                    }))}
                                    color="primary"
                                />
                            }
                            label={
                                <Box>
                                    <Typography variant="body1" fontWeight={500}>
                                        Moving Averages
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Display short and long-term moving averages on the price chart
                                    </Typography>
                                </Box>
                            }
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={tempSettings.showMacd}
                                    onChange={(e) => setTempSettings(prev => ({
                                        ...prev,
                                        showMacd: e.target.checked
                                    }))}
                                    color="primary"
                                />
                            }
                            label={
                                <Box>
                                    <Typography variant="body1" fontWeight={500}>
                                        MACD Indicator
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Show MACD and Signal lines in a separate chart below
                                    </Typography>
                                </Box>
                            }
                        />
                    </Stack>
                </Box>

                <Divider sx={{my: 3}}/>

                <Box>
                    <Typography variant="h6" gutterBottom>
                        Period Settings
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                        Configure the periods used for moving averages and MACD calculations
                    </Typography>

                    <PeriodControls
                        initialShortPeriod={tempSettings.shortPeriod}
                        initialLongPeriod={tempSettings.longPeriod}
                        onPeriodsChange={handlePeriodsChange}
                    />
                </Box>
            </DialogContent>

            <DialogActions sx={{p: 3, pt: 0}}>
                <Button onClick={handleConfigCancel} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={handleConfigSave}
                    variant="contained"
                    color="primary"
                    sx={{minWidth: 100}}
                >
                    Apply Settings
                </Button>
            </DialogActions>
        </Dialog>
    )
}