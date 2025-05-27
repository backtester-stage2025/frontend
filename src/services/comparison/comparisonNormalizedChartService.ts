import {SimulationResult} from "../../model/simulation/SimulationResult.ts";
import {UserPortfolio} from "../../model/simulation/UserPortfolio.ts";

export function getNormalizedComparisonChartOptions(results: SimulationResult[], colors: string[]) {
    const normalize = (portfolios: UserPortfolio[]) => {
        const startValue = portfolios[0]?.totalPortfolioValue || 1;
        return portfolios.map((portfolio, relativeDay) => ({
            x: relativeDay,
            y: (portfolio.totalPortfolioValue / startValue) * 100,
        }));
    };

    const normalizedPortfolios = results.map(r => normalize(r.userPortfolios));
    const maxSimulationLength = Math.max(...normalizedPortfolios.map(points => points.length));
    const xInterval = Math.ceil(maxSimulationLength / 10);

    return {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: "Normalized Total Portfolio Values"
        },
        axisY: {
            title: "Portfolio Value (Normalized)",
            suffix: "%",
            stripLines: [{
                value: 100,
                color: "#888",
                showOnTop: true,
                thickness: 2,
                dashType: "dash"
            }]
        },
        axisX: {
            title: "Simulation Day",
            interval: xInterval,
            labelFormatter: function (e: { value: number }) {
                return `Day ${e.value}`;
            }
        },
        toolTip: {
            shared: true,
            contentFormatter: function (e: {
                entries: {
                    dataPoint: { x: number | Date; y: number },
                    dataSeries: { name: string; color: string }
                }[]
            }) {
                const lines = e.entries.map(entry => {
                    return `<span style="color:${entry.dataSeries.color}">${entry.dataSeries.name}</span>: ${entry.dataPoint.y.toFixed(2)}%`;
                });
                return `Day ${e.entries[0].dataPoint.x}<br/>` + lines.join("<br/>");
            }
        },
        data: normalizedPortfolios.map((dataPoints, index) => ({
            type: "line",
            name: `Simulation ${index + 1}`,
            showInLegend: true,
            dataPoints: dataPoints,
            color: colors[index % colors.length]
        }))
    };
}