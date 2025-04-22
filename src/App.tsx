import './App.css'
import axios from "axios";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {StockList} from "./components/StockList.tsx";
import {StockOverview} from "./components/StockOverview/StockOverview.tsx";

function App() {
    axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
    console.log("backend url = " + import.meta.env.BACKEND_URL);
    const queryClient = new QueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/list" element={<StockList/>}/>
                    <Route path="/stock-overview" element={<StockOverview/>}/>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    )
}

export default App
