import {useSearchParams} from "react-router-dom";
import {StockChart} from "./StockChart";
import {Box} from "@mui/material";

export function StockOverview() {
    const [searchParams] = useSearchParams();
    const stockName = searchParams.get("stockName");

    if (!stockName) {
        return <div>No stock selected</div>;
    }

    return (
        <Box sx={{marginTop: 5}}>
            <StockChart stockName={stockName}/>
        </Box>
    );
}