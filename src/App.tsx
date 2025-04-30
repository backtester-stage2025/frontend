import './App.css'
import axios from "axios";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {StockList} from "./components/StockList.tsx";
import {useState} from "react";
import {Header} from "./components/Header.tsx";
import {Navigation} from "./components/Navigation.tsx"
import {StockOverview} from "./components/stock/StockOverview.tsx";
import {Simulation} from "./components/simulation/Simulation.tsx";

function App() {
    axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
    const queryClient = new QueryClient()
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Header onOpenDrawer={() => setDrawerOpen(!drawerOpen)}/>
                <Navigation isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}/>
                <Routes>
                    <Route path="/" element={<StockList/>}/>
                    <Route path="/stock-list" element={<StockList/>}/>
                    <Route path="/stock-overview" element={<StockOverview/>}/>
                    <Route path="/strategy-tester" element={<Simulation/>}/>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    )
}

export default App
