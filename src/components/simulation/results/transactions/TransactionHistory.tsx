import {ChangeEvent, useEffect, useMemo, useState} from "react";
import {Box, Checkbox, FormControlLabel, MenuItem, Pagination, Paper, Select, Typography} from "@mui/material";
import {TransactionHistoryToolbar} from "./TransactionHistoryToolbar";
import {TransactionHistoryList} from "./TransactionHistoryList";
import {UserPortfolio} from "../../../../model/simulation/UserPortfolio.ts";

interface TransactionHistoryProps {
    portfolioData: UserPortfolio[];
    showOnlyTradesDays: boolean;
    onToggleFilter: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function TransactionHistory({
                                       portfolioData,
                                       showOnlyTradesDays,
                                       onToggleFilter
                                   }: Readonly<TransactionHistoryProps>) {
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'value'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filteredAndSortedData = useMemo(() => {
        let filtered = portfolioData.filter(portfolio =>
            !showOnlyTradesDays || Object.values(portfolio.sharesBought).some(st => st.totalSharesBought !== 0)
        );
        if (searchTerm) {
            filtered = filtered.filter(portfolio =>
                portfolio.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
                Object.keys(portfolio.shareHoldings).some(symbol =>
                    symbol.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
        return [...filtered].sort((a, b) => {
            if (sortBy === 'date') {
                return sortOrder === 'asc'
                    ? new Date(a.date).getTime() - new Date(b.date).getTime()
                    : new Date(b.date).getTime() - new Date(a.date).getTime();
            } else {
                return sortOrder === 'asc'
                    ? a.totalPortfolioValue - b.totalPortfolioValue
                    : b.totalPortfolioValue - a.totalPortfolioValue;
            }
        });
    }, [portfolioData, showOnlyTradesDays, searchTerm, sortBy, sortOrder]);

    useEffect(() => {
        setPage(1);
    }, [searchTerm, showOnlyTradesDays]);

    const totalItems = filteredAndSortedData.length;
    const totalPages = Math.ceil(totalItems / rowsPerPage);
    const paginatedData = useMemo(() => {
        const startIndex = (page - 1) * rowsPerPage;
        return filteredAndSortedData.slice(startIndex, startIndex + rowsPerPage);
    }, [filteredAndSortedData, page, rowsPerPage]);

    const handlePageChange = (_event: unknown, newPage: number) => {
        setPage(newPage);
        setExpandedId(null);
    };

    return (
        <Paper elevation={2} sx={{p: 2, borderRadius: 2}}>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3}}>
                <Typography variant="h6" component="h2">Transaction History</Typography>
                <Box sx={{display: 'flex', gap: 2}}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={showOnlyTradesDays}
                                onChange={onToggleFilter}
                                color="primary"
                                size="small"
                            />
                        }
                        label="Show only days with trades"
                    />
                </Box>
            </Box>
            <TransactionHistoryToolbar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                paginatedCount={paginatedData.length}
                totalCount={totalItems}
            />
            {filteredAndSortedData.length > 0 ? (
                <>
                    <TransactionHistoryList
                        data={paginatedData}
                        expandedId={expandedId}
                        setExpandedId={setExpandedId}
                    />
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2}}>
                        <Select
                            value={rowsPerPage}
                            onChange={(e) => {
                                setRowsPerPage(Number(e.target.value));
                                setPage(1);
                            }}
                            size="small"
                            sx={{mr: 2}}
                        >
                            {[10, 25, 50, 100].map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option} per page
                                </MenuItem>
                            ))}
                        </Select>
                        <Pagination
                            count={totalPages}
                            page={page}
                            onChange={handlePageChange}
                            color="primary"
                            size="medium"
                            showFirstButton
                            showLastButton
                        />
                    </Box>
                </>
            ) : (
                <Box sx={{py: 4, textAlign: 'center'}}>
                    <Typography color="text.secondary" variant="body1">
                        No transactions to display. Try adjusting your filter settings.
                    </Typography>
                </Box>
            )}
        </Paper>
    );
}