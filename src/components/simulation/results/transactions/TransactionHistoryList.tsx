import {Box} from "@mui/material";
import {UserPortfolio} from "../../../../model/simulation/UserPortfolio.ts";
import {TransactionHistoryRow} from "./TransactionHistoryRow";

interface ListProps {
    data: UserPortfolio[];
    expandedId: string | null;
    setExpandedId: (id: string | null) => void;
}

export function TransactionHistoryList({data, expandedId, setExpandedId}: Readonly<ListProps>) {
    return (
        <Box sx={{maxHeight: '60vh', overflow: 'auto'}}>
            {data.map(portfolio =>
                <TransactionHistoryRow
                    key={portfolio.date}
                    portfolio={portfolio}
                    expanded={expandedId === portfolio.date}
                    onToggle={() => setExpandedId(expandedId === portfolio.date ? null : portfolio.date)}
                />
            )}
        </Box>
    );
}