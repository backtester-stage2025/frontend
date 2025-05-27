import {UserPortfolio} from "../../../model/simulation/UserPortfolio.ts";
import React, {useMemo, useState} from "react";
import Select, {SelectChangeEvent} from '@mui/material/Select';
import {Box, FormControl, MenuItem, Paper, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import TimelineIcon from "@mui/icons-material/Timeline";
import {formatCurrency, formatLargeNumber, getNiceStep} from "../../../services/formatService.ts";
import {Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {CurrencyTypeDisplay} from "../../../model/CurrencyType.ts";

interface StockHoldingChartProps {
    portfolioData: UserPortfolio[];
    currencyPreference?: string;
}

export function StockHoldingChart({portfolioData, currencyPreference}: Readonly<StockHoldingChartProps>) {
    const [selectedStock, setSelectedStock] = useState<string | null>(null);
    const [chartType, setChartType] = useState<'shares' | 'value'>('shares');
    const [viewType, setViewType] = useState<'line' | 'bar'>('line');
    const currencyLabel = currencyPreference
        ? CurrencyTypeDisplay[currencyPreference] || currencyPreference
        : "€";

    const availableStocks = useMemo(() => {
        const stockSet = new Set<string>();

        portfolioData.forEach(portfolio => {
            Object.values(portfolio.shareHoldings).forEach(holding => {
                if (holding.totalSharesOwned > 0) {
                    stockSet.add(holding.stockName);
                }
            });
        });

        return Array.from(stockSet);
    }, [portfolioData]);

    useMemo(() => {
        if (availableStocks.length > 0 && !selectedStock) {
            setSelectedStock(availableStocks[0]);
        }
    }, [availableStocks, selectedStock]);

    const chartData = useMemo(() => {
        if (!selectedStock || portfolioData.length === 0) return [];

        return portfolioData.map(portfolio => {
            const holding = Object.values(portfolio.shareHoldings)
                .find(h => h.stockName === selectedStock);

            return {
                date: portfolio.date,
                shares: holding?.totalSharesOwned ?? 0,
                value: holding ? holding.totalSharesOwned * holding.price : 0,
                // Track if there was a transaction on this day
                hasTransaction: Object.values(portfolio.sharesBought)
                    .some(t => t.stockName === selectedStock && t.totalSharesBought !== 0)
            };
        });
    }, [portfolioData, selectedStock]);

    const handleStockChange = (event: SelectChangeEvent,) => {
        setSelectedStock(event.target.value);
    };

    const handleChartTypeChange = (
        _: React.MouseEvent<HTMLElement>,
        newType: "shares" | "value" | null
    ) => {
        if (newType === "shares" || newType === "value") {
            setChartType(newType);
        }
    };

    const handleViewTypeChange = (
        _: React.MouseEvent<HTMLElement>,
        newView: "line" | "bar" | null
    ) => {
        if (newView === "line" || newView === "bar") {
            setViewType(newView);
        }
    };

    const dataMin = Math.min(...(chartData.length > 0 ? chartData.map(item => chartType === 'shares' ? item.shares : item.value) : [0]));
    const dataMax = Math.max(...(chartData.length > 0 ? chartData.map(item => chartType === 'shares' ? item.shares : item.value) : [0]));
    const range = dataMax - dataMin;
    const step = getNiceStep(range / 8);
    const roundedMin = step ? Math.floor(dataMin / step) * step : 0;
    const roundedMax = step ? Math.ceil(dataMax / step) * step : 0;
    const yAxisDomain = [roundedMin, roundedMax];

    return (
        <Paper elevation={2} sx={{p: 3, borderRadius: 2, height: '100%'}}>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3}}>
                <Typography variant="h6" gutterBottom sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <BarChartIcon color="primary"/>
                    Stock Holding Evolution
                </Typography>

                <Box sx={{display: 'flex', gap: 2}}>
                    <FormControl size="small" variant="outlined" sx={{minWidth: 150}}>
                        <Select
                            value={selectedStock ?? ''}
                            onChange={handleStockChange}
                            displayEmpty
                            inputProps={{'aria-label': 'Select stock'}}
                        >
                            {availableStocks.map(stock => (
                                <MenuItem key={stock} value={stock}>
                                    {stock}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <ToggleButtonGroup
                        size="small"
                        value={chartType}
                        exclusive
                        onChange={handleChartTypeChange}
                    >
                        <ToggleButton value="shares">Shares</ToggleButton>
                        <ToggleButton value="value">Value ({currencyLabel})</ToggleButton>
                    </ToggleButtonGroup>

                    <ToggleButtonGroup
                        size="small"
                        value={viewType}
                        exclusive
                        onChange={handleViewTypeChange}
                    >
                        <ToggleButton value="line">
                            <TimelineIcon fontSize="small"/>
                        </ToggleButton>
                        <ToggleButton value="bar">
                            <BarChartIcon fontSize="small"/>
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Box>

            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                    {viewType === 'line' ? (
                        <AreaChart
                            data={chartData}
                            margin={{top: 10, right: 30, left: 10, bottom: 40}}
                        >
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis
                                dataKey="date"
                                angle={-45}
                                textAnchor="end"
                                height={60}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                domain={yAxisDomain}
                                tickFormatter={(value) =>
                                    formatLargeNumber(value)
                                }
                                width={60}
                                tickCount={8}
                            />
                            <Tooltip
                                formatter={(value: number) =>
                                    chartType === 'shares'
                                        ? [value.toLocaleString(), 'Shares']
                                        : [formatCurrency(value, currencyPreference), `Value (${currencyLabel})`]
                                }
                                labelFormatter={(label) => `Date: ${label}`}
                            />
                            <Area
                                type="monotone"
                                dataKey={chartType}
                                stroke="#8884d8"
                                fill="#8884d8"
                                fillOpacity={0.3}
                                activeDot={({cx, cy, payload}) => (
                                    payload.hasTransaction ? (
                                        <g>
                                            <circle cx={cx} cy={cy} r={8} fill="#ff7300" fillOpacity={0.2}/>
                                            <circle cx={cx} cy={cy} r={4} fill="#ff7300"/>
                                        </g>
                                    ) : (
                                        <circle cx={cx} cy={cy} r={4} fill="#8884d8"/>
                                    )
                                )}
                                name={chartType === 'shares' ? 'Share Count' : 'Position Value'}
                            />
                        </AreaChart>
                    ) : (
                        <BarChart
                            data={chartData}
                            margin={{top: 10, right: 30, left: 10, bottom: 40}}
                        >
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis
                                dataKey="date"
                                angle={-45}
                                textAnchor="end"
                                height={60}
                                interval={Math.ceil(chartData.length / 15)}
                            />
                            <YAxis
                                domain={yAxisDomain}
                                tickFormatter={(value) =>
                                    formatLargeNumber(value)
                                }
                                width={60}
                                tickCount={8}
                            />
                            <Tooltip
                                formatter={(value: number) =>
                                    chartType === 'shares'
                                        ? [value.toLocaleString(), 'Shares']
                                        : [formatCurrency(value, currencyPreference), `Value (${currencyLabel})`]
                                }
                                labelFormatter={(label) => `Date: ${label}`}
                            />
                            <Bar
                                dataKey={chartType}
                                fill={chartType === 'shares' ? '#8884d8' : '#82ca9d'}
                                name={chartType === 'shares' ? 'Share Count' : 'Position Value'}
                            />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            ) : (
                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400}}>
                    <Typography variant="body1" color="text.secondary">
                        {availableStocks.length === 0
                            ? "No stock holdings found in the data"
                            : "Select a stock to view its holding evolution"}
                    </Typography>
                </Box>
            )}
        </Paper>
    );
}
