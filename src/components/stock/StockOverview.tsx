import {useSearchParams} from "react-router-dom";
import {StockChart} from "./StockChart";
import {Box, Toolbar} from "@mui/material";

export function StockOverview() {
    const [searchParams] = useSearchParams();
    const stockName = searchParams.get("stockName");

    if (!stockName) {
        return <div>No stock selected</div>;
    }

    return (
        <>
            <Toolbar/>
            <Box sx={{marginTop: 5}}>
                <StockChart stockName={stockName}/>
            </Box>
        </>
    );
}