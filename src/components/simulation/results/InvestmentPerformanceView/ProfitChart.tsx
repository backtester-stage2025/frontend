import {UserPortfolio} from "../../../../model/simulation/UserPortfolio.ts";
import {useMemo} from "react";
import {Box, Typography} from "@mui/material";
import {Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {formatCurrency, formatLargeNumber, getNiceStep} from "../../../../services/formatService.ts";

interface ProfitChartProps {
    portfolioData: UserPortfolio[];
    currencyLabel?: string;
    currencyPreference?: string;
}

export function ProfitChart({portfolioData, currencyLabel, currencyPreference}: Readonly<ProfitChartProps>) {
    const chartData = useMemo(() => {
        if (!portfolioData || portfolioData.length === 0) return [];

        const initialValue = portfolioData[0].totalPortfolioValue;

        return portfolioData.map(item => {
            const profit = item.totalPortfolioValue - initialValue;
            return {
                date: item.date,
                profit,
                profitPositive: profit >= 0 ? profit : null,
                profitNegative: profit < 0 ? profit : null,
            };
        });
    }, [portfolioData]);

    const dataMax = Math.max(...(chartData.length > 0 ? chartData.map(item => item.profit) : [0]));
    const dataMin = Math.min(...(chartData.length > 0 ? chartData.map(item => item.profit) : [0]));
    const range = dataMax - dataMin;

    const step = getNiceStep(range / 8);
    const roundedMin = step ? Math.floor(dataMin / step) * step : 0;
    const roundedMax = step ? Math.ceil(dataMax / step) * step : 0;
    const yAxisDomain = [roundedMin, roundedMax];

    return (
        chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
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
                        tickFormatter={(value) => formatLargeNumber(value)}
                        width={60}
                        tickCount={8}
                    />
                    <Tooltip
                        formatter={(value: number) => [formatCurrency(value, currencyPreference), `Profit (${currencyLabel})`]}
                        labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Area
                        type="monotone"
                        dataKey="profitPositive"
                        stroke="#388e3c"
                        fill="#388e3c"
                        fillOpacity={0.3}
                        dot={false}
                        activeDot={{r: 6}}
                        name="Profit"
                    />
                    <Area
                        type="monotone"
                        dataKey="profitNegative"
                        stroke="#d32f2f"
                        fill="#d32f2f"
                        fillOpacity={0.3}
                        dot={false}
                        activeDot={{r: 6}}
                        name="Loss"
                    />
                </AreaChart>
            </ResponsiveContainer>
        ) : (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400}}>
                <Typography variant="body1" color="text.secondary">
                    No profit data available
                </Typography>
            </Box>
        )
    )
}
