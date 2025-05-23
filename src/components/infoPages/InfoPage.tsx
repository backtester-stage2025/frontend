import {Box, CssBaseline, List, Paper, Toolbar} from "@mui/material";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import FindInPageIcon from '@mui/icons-material/FindInPage';
import CircleIcon from '@mui/icons-material/Circle';
import {JSX, useEffect, useState} from "react";
import {DefaultInfo} from "./pages/DefaultInfo.tsx";
import {MovingAverageCrossoverInfo} from "./pages/MovingAverageCrossoverInfo.tsx";
import {BreakoutInfo} from "./pages/BreakoutInfo.tsx";
import {IndicatorInfo} from "./pages/IndicatorInfo.tsx";
import {StockMetricsInfo} from "./pages/StockMetricsInfo.tsx";
import {useSearchParams} from "react-router-dom";
import {TopLevelListItem} from "./TopLevelListItem";
import {SubListItem} from "./SubListItem";
import BarChartIcon from "@mui/icons-material/BarChart";

const panelWidth = 240;


export function InfoPage() {
    const [searchParams] = useSearchParams();
    const [openIndicators, setOpenIndicators] = useState(false);
    const [openStockMetrics, setOpenStockMetrics] = useState(false);
    const [activeTab, setActiveTab] = useState<string | null>(null);

    useEffect(() => {
        const section = searchParams.get("section");
        if (section) {
            setActiveTab(section);
        }
    }, [searchParams]);

    const handleToggleIndicators = () => {
        setOpenIndicators(!openIndicators);
    };
    const handleToggleStockMetrics = () => {
        setOpenStockMetrics(!openStockMetrics);
    };

    const handleSelectTab = (tab: string) => {
        setActiveTab(tab);
    };

    const tabComponents: Record<string, JSX.Element> = {
        "indicator-types": <IndicatorInfo/>,
        "moving-average-crossover": <MovingAverageCrossoverInfo/>,
        "breakout": <BreakoutInfo/>,
        "default": <DefaultInfo/>,
        "stock-metrics": <StockMetricsInfo/>,
    };

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <Paper
                elevation={3}
                sx={{
                    width: panelWidth,
                    height: '65vh',
                    position: 'fixed',
                    top: '10vh',
                    left: '1vw',
                    display: 'flex',
                    flexDirection: 'column',
                    boxSizing: 'border-box',
                    borderRadius: 2,
                }}
            >
                <Box sx={{overflow: 'auto', flexGrow: 1}}>
                    <List>
                        <TopLevelListItem
                            icon={<FindInPageIcon sx={{color: 'primary.main'}} />}
                            text="Info Page"
                            onNavigate={() => handleSelectTab("default")}
                        />
                        <TopLevelListItem
                            icon={<QueryStatsIcon sx={{ color: "primary.main" }} />}
                            text="Indicators"
                            onNavigate={() => handleSelectTab("indicator-types")}
                            onToggleDropdown={handleToggleIndicators}
                            expandable
                            expanded={openIndicators}
                        />
                        {openIndicators && (
                            <List component="div" disablePadding sx={{pl: 4}}>
                                <SubListItem
                                    icon={<CircleIcon sx={{fontSize: '0.5rem'}}/>}
                                    text="Moving Average Crossover"
                                    onClick={() => handleSelectTab("moving-average-crossover")}
                                />
                                <SubListItem
                                    icon={<CircleIcon sx={{fontSize: '0.5rem'}}/>}
                                    text="Breakout"
                                    onClick={() => handleSelectTab("breakout")}
                                />
                            </List>
                        )}
                        <TopLevelListItem
                            icon={<BarChartIcon sx={{ color: "primary.main" }} />}
                            text="Stock Metrics"
                            onNavigate={() => handleSelectTab("stock-metrics")}
                            onToggleDropdown={handleToggleStockMetrics}
                            expandable
                            expanded={openStockMetrics}
                        />
                        {openStockMetrics && (
                            <List component="div" disablePadding sx={{ pl: 4 }}>
                                <SubListItem
                                    icon={<CircleIcon sx={{ fontSize: "0.5rem" }} />}
                                    text="Metric 1"
                                    onClick={() => handleSelectTab("metric-1")}
                                />
                                <SubListItem
                                    icon={<CircleIcon sx={{ fontSize: "0.5rem" }} />}
                                    text="Metric 2"
                                    onClick={() => handleSelectTab("metric-2")}
                                />
                            </List>
                        )}
                    </List>
                </Box>
            </Paper>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    marginLeft: `${panelWidth + 20}px`,
                }}
            >
                <Toolbar/>
                {activeTab ? tabComponents[activeTab] : <DefaultInfo/>}
            </Box>
        </Box>
    );
}