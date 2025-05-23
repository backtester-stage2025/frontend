import {
    Box,
    CssBaseline,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Toolbar
} from "@mui/material";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import CircleIcon from '@mui/icons-material/Circle';
import {JSX, useState} from "react";
import {DefaultInfo} from "./DefaultInfo.tsx";
import {MovingAverageCrossoverInfo} from "./MovingAverageCrossoverInfo.tsx";
import {BreakoutInfo} from "./BreakoutInfo.tsx";

const panelWidth = 240;

export function InfoPage() {
    const [openIndicators, setOpenIndicators] = useState(false);
    const [selectedIndicator, setSelectedIndicator] = useState<string | null>(null);

    const handleToggleIndicators = () => {
        setOpenIndicators(!openIndicators);
    };

    const handleSelectIndicator = (indicator: string) => {
        setSelectedIndicator(indicator);
    };

    const indicatorComponents: Record<string, JSX.Element> = {
        "Moving Average Crossover": <MovingAverageCrossoverInfo/>,
        "Breakout": <BreakoutInfo/>,
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
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleToggleIndicators}>
                                <ListItemIcon>
                                    <QueryStatsIcon sx={{ color: 'primary.main' }} />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Indicators"
                                    slotProps={{
                                        primary: {
                                            fontSize: '1.2rem',
                                            fontWeight: '550'
                                        }
                                    }}
                                />
                                {openIndicators ? <ExpandLess/> : <ExpandMore/>}
                            </ListItemButton>
                        </ListItem>
                        {openIndicators && (
                            <List component="div" disablePadding sx={{pl: 4}}>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        sx={{alignItems: 'center'}}
                                        onClick={() => handleSelectIndicator("Moving Average Crossover")}
                                    >
                                        <ListItemIcon sx={{minWidth: '24px'}}>
                                            <CircleIcon sx={{fontSize: '0.5rem'}}/>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Moving Average Crossover"
                                            slotProps={{
                                                primary: {
                                                    fontSize: '1rem',
                                                }
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        sx={{alignItems: 'center'}}
                                        onClick={() => handleSelectIndicator("Breakout")}
                                    >
                                        <ListItemIcon sx={{minWidth: '24px'}}>
                                            <CircleIcon sx={{fontSize: '0.5rem'}}/>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Breakout"
                                            slotProps={{
                                                primary: {
                                                    fontSize: '1rem',
                                                }
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
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
                    marginLeft: `${panelWidth + 20}px`
                }}
            >
                <Toolbar/>
                {selectedIndicator ? indicatorComponents[selectedIndicator] : <DefaultInfo/>}
            </Box>
        </Box>
    );
}