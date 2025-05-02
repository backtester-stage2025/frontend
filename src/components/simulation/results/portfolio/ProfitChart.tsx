import {UserPortfolio} from "../../../../model/simulation/UserPortfolio.ts";
import {useMemo} from "react";
import {Box, Typography} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {formatEuro} from "../../../../services/formatService.ts";

export function ProfitChart({portfolioData}: Readonly<{ portfolioData: UserPortfolio[] }>) {
    const chartData = useMemo(() => {
        if (!portfolioData || portfolioData.length === 0) return [];

        const initialValue = portfolioData[0].totalPortfolioValue;

        return portfolioData.map(item => ({
            date: item.date,
            profit: item.totalPortfolioValue - initialValue
        }));
    }, [portfolioData]);

    return (
        <Box sx={{height: 400, width: '100%', mt: 3}}>
            <Typography variant="h6" gutterBottom sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                <TrendingUpIcon color="primary"/>
                Profit Evolution (€)
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart
                    data={chartData}
                    margin={{top: 5, right: 30, left: 20, bottom: 5}}
                >
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="date"/>
                    <YAxis
                        tickFormatter={(value) => formatEuro(value).split('.')[0]}
                    />
                    <Tooltip
                        formatter={(value: number) => formatEuro(value)}
                        labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Legend/>
                    <Line
                        type="monotone"
                        dataKey="profit"
                        stroke="#1976d2"
                        strokeWidth={2}
                        activeDot={{r: 8}}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    );
}
