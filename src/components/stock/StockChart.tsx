import {useStockQuotes} from '../../hooks/useStockQuotes';
import {Loader} from "../util/Loader.tsx";
import {useEffect, useState} from 'react';
import {Box, Chip, IconButton, Paper, Stack, Tooltip, Typography} from '@mui/material';
import {Analytics, Settings, ShowChart} from '@mui/icons-material';
import {ErrorAlert, WarningAlert} from "../util/Alerts.tsx";
import {MovingAverageChart} from "./MovingAverageChart.tsx";
import {MacdChart} from "./MacdChart.tsx";
import {ConfigurationDialog} from "./ConfigurationDialog.tsx";


export interface ChartSettings {
    showMovingAverages: boolean;
    showMacd: boolean;
    shortPeriod: number;
    longPeriod: number;
}

interface StockChartProps {
    stockName: string;
}

export function StockChart({stockName}: Readonly<StockChartProps>) {
    const {
        isLoading: isLoadingStockQuotes,
        isError: isErrorStockQuotes,
        stockQuotes,
        error
    } = useStockQuotes(stockName);

    const [dateRange, setDateRange] = useState<{
        startDate: string;
        endDate: string;
    }>({
        startDate: "",
        endDate: ""
    });

    const [settings, setSettings] = useState<ChartSettings>({
        showMovingAverages: true,
        showMacd: false,
        shortPeriod: 12,
        longPeriod: 26
    });

    const [configDialogOpen, setConfigDialogOpen] = useState(false);
    const [tempSettings, setTempSettings] = useState<ChartSettings>(settings);

    useEffect(() => {
        if (stockQuotes && stockQuotes.length > 0) {
            const longPeriodPadding = Math.max(settings.shortPeriod, settings.longPeriod) + 10;

            const firstDate = new Date(stockQuotes[0].dateTime);
            const paddedStartDate = new Date(firstDate);
            paddedStartDate.setDate(paddedStartDate.getDate() - longPeriodPadding);

            const lastDate = new Date(stockQuotes[stockQuotes.length - 1].dateTime);

            setDateRange({
                startDate: paddedStartDate.toISOString().split('T')[0],
                endDate: lastDate.toISOString().split('T')[0],
            });
        }
    }, [stockQuotes, settings.shortPeriod, settings.longPeriod]);

    if (isLoadingStockQuotes)
        return <Loader message={`Loading stock analysis for ${stockName}`}/>;

    if (isErrorStockQuotes)
        return <ErrorAlert message={`Error loading stock data for ${stockName}: ${error?.message}`}/>;

    if (!stockQuotes || stockQuotes.length === 0)
        return <WarningAlert message={`No stock quotes available for ${stockName}. Please try a different stock.`}/>

    const getActiveIndicators = () => {
        const indicators = [];
        if (settings.showMovingAverages) {
            indicators.push(`MA (${settings.shortPeriod}/${settings.longPeriod})`);
        }
        if (settings.showMacd) {
            indicators.push(`MACD (${settings.shortPeriod}/${settings.longPeriod})`);
        }
        return indicators;
    };

    return (
        <Paper elevation={3} sx={{p: 3, borderRadius: 2, mt: 14, mb: 2}}>
            {/* Header */}
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, width: '75vw'}}>
                <Typography variant="h5" component="h2" sx={{display: 'flex', alignItems: 'center'}}>
                    <ShowChart sx={{mr: 1}}/> {stockName} Technical Analysis
                </Typography>

                <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                    <Stack direction="row" spacing={1}>
                        {getActiveIndicators().map((indicator, index) => (
                            <Chip
                                key={index}
                                label={indicator}
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                        ))}
                        {getActiveIndicators().length === 0 && (
                            <Chip
                                label="No indicators active"
                                size="small"
                                color="default"
                                variant="outlined"
                            />
                        )}
                    </Stack>

                    <Tooltip title="Configure Chart Settings">
                        <IconButton
                            onClick={() => setConfigDialogOpen(true)}
                            color="primary"
                            sx={{
                                bgcolor: 'primary.light',
                                color: 'primary.contrastText',
                                '&:hover': {bgcolor: 'primary.main'}
                            }}
                        >
                            <Settings/>
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* Price Chart with moving averages*/}
            <Box sx={{mb: settings.showMacd ? 3 : 0}}>
                <MovingAverageChart stockName={stockName} stockQuotes={stockQuotes} dateRange={dateRange}
                                    settings={settings}/>
            </Box>

            {/* MACD Chart */}
            {settings.showMacd && (
                <Box sx={{
                    border: '1px solid #E0E0E0',
                    borderRadius: 1,
                    p: 2,
                    bgcolor: '#FAFAFA'
                }}>
                    <Typography variant="h6" sx={{display: 'flex', alignItems: 'center', mb: 2}}>
                        <Analytics sx={{mr: 1, color: 'primary.main'}}/>
                        MACD Indicator
                    </Typography>
                    <MacdChart stockName={stockName} stockQuotes={stockQuotes} dateRange={dateRange}
                               settings={settings}/>

                </Box>
            )}

            {/* Configuration Dialog */}
            <ConfigurationDialog configDialogOpen={configDialogOpen} setConfigDialogOpen={setConfigDialogOpen}
                                 settings={settings} setSettings={setSettings} tempSettings={tempSettings}
                                 setTempSettings={setTempSettings}/>

        </Paper>
    );
}