import './App.css'
import axios from "axios";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {StockList} from "./components/StockList.tsx";
import {useState} from "react";
import {Header} from "./components/Header.tsx";
import {Navigation} from "./components/Navigation.tsx"
import {Simulation} from "./components/simulation/Simulation.tsx";
import {createTheme, ThemeProvider} from "@mui/material";
import {StockOverview} from "./components/stock/StockOverview.tsx";
import {NotFound} from "./components/NotFound.tsx";

function App() {
    axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
    const queryClient = new QueryClient()
    const [drawerOpen, setDrawerOpen] = useState(false);

    const theme = createTheme({
        palette: {
            primary: {
                main: '#725ac1', // paars
            },
            secondary: {
                main: '#242038', // zwartpaars
            },
            background: {
                default: '#ffffff', // wit
                paper: '#efefef', // grijs
            },
            text: {
                primary: '#242038', // zwartpaars
                secondary: '#725ac1', // paars
            },
        },
        typography: {
            fontFamily: 'Roboto, sans-serif',
            fontSize: 16,
        },
    });


    return (
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Header onOpenDrawer={() => setDrawerOpen(!drawerOpen)}/>
                    <Navigation isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}/>
                    <Routes>
                        <Route path="/" element={<StockList/>}/>
                        <Route path="/stock-list" element={<StockList/>}/>
                        <Route path="/stock-overview" element={<StockOverview/>}/>
                        <Route path="/strategy-tester" element={<Simulation/>}/>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </BrowserRouter>
            </QueryClientProvider>
        </ThemeProvider>
    )
}

export default App
