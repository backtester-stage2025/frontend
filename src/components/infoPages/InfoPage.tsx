import {Box, CssBaseline, List, Paper} from "@mui/material";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import FindInPageIcon from '@mui/icons-material/FindInPage';
import CircleIcon from '@mui/icons-material/Circle';
import {JSX, useEffect, useState} from "react";
import {DefaultInfo} from "./pages/DefaultInfo.tsx";
import {MovingAverageCrossoverInfo} from "./pages/MovingAverageCrossoverInfo.tsx";
import {BreakoutInfo} from "./pages/BreakoutInfo.tsx";
import {IndicatorInfo} from "./pages/IndicatorInfo.tsx";
import {StockMetricsInfo} from "./pages/StockMetricsInfo.tsx";
import {ReturnsInfo} from "./pages/ReturnsInfo";
import {RiskInfo} from "./pages/RiskInfo";
import {DrawdownInfo} from "./pages/DrawdownInfo";
import {SkewnessInfo} from "./pages/SkewnessInfo";
import {useSearchParams} from "react-router-dom";
import {TopLevelListItem} from "./TopLevelListItem";
import {SubListItem} from "./SubListItem";
import BarChartIcon from "@mui/icons-material/BarChart";
import {MacdInfo} from "./pages/MacdInfo.tsx";
import {PositionAdjustmentInfo} from "./pages/PositionAdjustmentInfo.tsx";
import {RiskBasedInfo} from "./pages/RiskBasedInfo.tsx";
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import {BuyAndHoldInfo} from "./pages/BuyAndHoldInfo.tsx";

const panelWidth = 240;

export function InfoPage() {
    const [searchParams] = useSearchParams();
    const [openIndicators, setOpenIndicators] = useState(false);
    const [openStockMetrics, setOpenStockMetrics] = useState(false);
    const [openPositionAdjustment, setOpenPositionAdjustment] = useState(false);
    const [activeTab, setActiveTab] = useState<string | null>(null);

    useEffect(() => {
        const section = searchParams.get("section");
        if (section) {
            setActiveTab(section);

            if (["moving-average-crossover", "breakout", "indicator-types", "macd"].includes(section)) {
                setOpenIndicators(true);
            } else if (["returns", "risk", "drawdown", "skewness", "stock-metrics"].includes(section)) {
                setOpenStockMetrics(true);
            } else if (["position-adjustment", "risk-based"].includes(section)) {
                setOpenPositionAdjustment(true);
            }
        }
    }, [searchParams]);

    const handleToggleIndicators = () => {
        setOpenIndicators(!openIndicators);
    };
    const handleToggleStockMetrics = () => {
        setOpenStockMetrics(!openStockMetrics);
    };
    const handleTogglePositionAdjustment = () => {
        setOpenPositionAdjustment(!openPositionAdjustment);
    };

    const handleSelectTab = (tab: string) => {
        setActiveTab(tab);
    };

    const tabComponents: Record<string, JSX.Element> = {
        "indicator-types": <IndicatorInfo/>,
        "moving-average-crossover": <MovingAverageCrossoverInfo/>,
        "breakout": <BreakoutInfo/>,
        "macd": <MacdInfo/>,
        "default": <DefaultInfo/>,
        "stock-metrics": <StockMetricsInfo/>,
        "returns": <ReturnsInfo/>,
        "risk": <RiskInfo/>,
        "drawdown": <DrawdownInfo/>,
        "skewness": <SkewnessInfo/>,
        "position-adjustment": <PositionAdjustmentInfo/>,
        "buy-and-hold": <BuyAndHoldInfo/>,
        "risk-based": <RiskBasedInfo/>
    };

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <Paper
                elevation={3}
                sx={{
                    width: panelWidth,
                    height: '80vh',
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
                            icon={<FindInPageIcon sx={{color: 'primary.main'}}/>}
                            text="Info Page"
                            onNavigate={() => handleSelectTab("default")}
                        />
                        <TopLevelListItem
                            icon={<QueryStatsIcon sx={{color: "primary.main"}}/>}
                            text="Indicators"
                            onNavigate={() => {
                                handleSelectTab("indicator-types");
                                setOpenIndicators(true);
                            }}
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
                                <SubListItem
                                    icon={<CircleIcon sx={{fontSize: '0.5rem'}}/>}
                                    text="MACD"
                                    onClick={() => handleSelectTab("macd")}
                                />
                            </List>
                        )}
                        <TopLevelListItem
                            icon={<BarChartIcon sx={{color: "primary.main"}}/>}
                            text="Stock Metrics"
                            onNavigate={() => {
                                handleSelectTab("stock-metrics");
                                setOpenStockMetrics(true);
                            }}
                            onToggleDropdown={handleToggleStockMetrics}
                            expandable
                            expanded={openStockMetrics}
                        />
                        {openStockMetrics && (
                            <List component="div" disablePadding sx={{pl: 4}}>
                                <SubListItem
                                    icon={<CircleIcon sx={{fontSize: "0.5rem"}}/>}
                                    text="Returns"
                                    onClick={() => handleSelectTab("returns")}
                                />
                                <SubListItem
                                    icon={<CircleIcon sx={{fontSize: "0.5rem"}}/>}
                                    text="Risk"
                                    onClick={() => handleSelectTab("risk")}
                                />
                                <SubListItem
                                    icon={<CircleIcon sx={{fontSize: "0.5rem"}}/>}
                                    text="Drawdown"
                                    onClick={() => handleSelectTab("drawdown")}
                                />
                                <SubListItem
                                    icon={<CircleIcon sx={{fontSize: "0.5rem"}}/>}
                                    text="Skewness"
                                    onClick={() => handleSelectTab("skewness")}
                                />
                            </List>
                        )}
                        <TopLevelListItem
                            icon={<CurrencyExchangeIcon sx={{color: "primary.main"}}/>}
                            text="Position Adjustment"
                            onNavigate={() => {
                                handleSelectTab("position-adjustment");
                                setOpenPositionAdjustment(true);
                            }}
                            onToggleDropdown={handleTogglePositionAdjustment}
                            expandable
                            expanded={openPositionAdjustment}
                        />
                        {openPositionAdjustment && (
                            <List component="div" disablePadding sx={{pl: 4}}>
                                <SubListItem
                                    icon={<CircleIcon sx={{fontSize: "0.5rem"}}/>}
                                    text="Buy and Hold"
                                    onClick={() => handleSelectTab("buy-and-hold")}
                                />
                                <SubListItem
                                    icon={<CircleIcon sx={{fontSize: "0.5rem"}}/>}
                                    text="Risk Based"
                                    onClick={() => handleSelectTab("risk-based")}
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
                {activeTab ? tabComponents[activeTab] : <DefaultInfo/>}
            </Box>
        </Box>
    );
}
