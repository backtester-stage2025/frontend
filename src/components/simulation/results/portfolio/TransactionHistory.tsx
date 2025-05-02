import {ChangeEvent, useEffect, useMemo, useState} from "react";
import {
    Accordion,
    AccordionSummary,
    Box,
    Checkbox,
    Chip,
    FormControlLabel,
    Grid,
    InputAdornment,
    MenuItem,
    Pagination,
    Paper,
    Select,
    TextField,
    Typography
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import {PortfolioDetails} from "./PortfolioDetails.tsx";
import {UserPortfolio} from "../../../../model/simulation/UserPortfolio.ts";
import {formatEuro} from "../../../../services/formatService.ts";

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

    const handleAccordionChange = (portfolioId: string) => {
        setExpandedId(expandedId === portfolioId ? null : portfolioId);
    };

    const renderTransactionRow = (portfolio: UserPortfolio) => {
        const portfolioId = portfolio.date;
        const hasTradesOnDay = Object.values(portfolio.sharesBought).some(st => st.totalSharesBought !== 0);

        return (
            <Accordion
                key={portfolioId}
                expanded={expandedId === portfolioId}
                onChange={() => handleAccordionChange(portfolioId)}
                disableGutters
                sx={{
                    mb: 1,
                    bgcolor: hasTradesOnDay ? 'rgba(66, 165, 245, 0.05)' : 'inherit',
                    '&:hover': {bgcolor: 'rgba(0, 0, 0, 0.04)'}
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls={`panel-${portfolioId}-content`}
                    id={`panel-${portfolioId}-header`}
                >
                    <Grid container spacing={2} alignItems="center" sx={{width: "100%"}}>
                        <Grid size={{xs: 4, sm: 3}}>
                            <Typography variant="subtitle1" fontWeight="medium">
                                {portfolio.date}
                            </Typography>
                            {hasTradesOnDay && (
                                <Chip
                                    label="Trades"
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    sx={{ml: 1, height: 20}}
                                />
                            )}
                        </Grid>
                        <Grid size={{xs: 4, sm: 3}}>
                            <Typography variant="body2">
                                Cash: {formatEuro(portfolio.cashBalance)}
                            </Typography>
                        </Grid>
                        <Grid size={{xs: 4, sm: 3}}>
                            <Typography
                                variant="body2"
                                fontWeight="bold"
                            >
                                Total: {formatEuro(portfolio.totalPortfolioValue)}
                            </Typography>
                        </Grid>
                        <Grid size={{xs: 12, sm: 3}} sx={{display: {xs: 'none', sm: 'block'}}}>
                            {Object.values(portfolio.sharesBought).some(st => st.totalSharesBought !== 0) && (
                                <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                                    {Object.values(portfolio.sharesBought)
                                        .filter(st => st.totalSharesBought !== 0)
                                        .slice(0, 3)
                                        .map(st => (
                                            <Chip
                                                key={st.stockName}
                                                label={`${st.stockName} ${st.totalSharesBought > 0 ? '+' : ''}${st.totalSharesBought}`}
                                                size="small"
                                                sx={{
                                                    bgcolor: st.totalSharesBought > 0 ? 'success.light' : 'error.light',
                                                    color: 'white',
                                                    fontSize: '0.7rem'
                                                }}
                                            />
                                        ))}
                                    {Object.values(portfolio.sharesBought)
                                        .filter(st => st.totalSharesBought !== 0)
                                        .length > 3 && (
                                        <Chip
                                            label="..."
                                            size="small"
                                            sx={{fontSize: '0.7rem'}}
                                        />
                                    )}
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </AccordionSummary>
                <PortfolioDetails portfolio={portfolio}/>
            </Accordion>
        );
    };

    return (
        <Paper elevation={2} sx={{p: 2, borderRadius: 2}}>
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3}}>
                <Typography variant="h6" component="h2">
                    Transaction History
                </Typography>

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

            {/* Search and filter toolbar */}
            <Grid container spacing={2} sx={{mb: 2}}>
                <Grid size={{xs: 12, sm: 4}}>
                    <TextField
                        placeholder="Search by date or symbol"
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small"/>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                </Grid>
                <Grid size={{xs: 6, sm: 4}}>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <FilterListIcon sx={{mr: 1, color: 'text.secondary'}}/>
                        <Select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'date' | 'value')}
                            size="small"
                            sx={{minWidth: 120, mr: 1}}
                        >
                            <MenuItem value="date">Date</MenuItem>
                            <MenuItem value="value">Portfolio Value</MenuItem>
                        </Select>
                        <Select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                            size="small"
                            sx={{minWidth: 120}}
                        >
                            <MenuItem value="asc">Ascending</MenuItem>
                            <MenuItem value="desc">Descending</MenuItem>
                        </Select>
                    </Box>
                </Grid>
                <Grid size={{xs: 6, sm: 4}} sx={{textAlign: 'right'}}>
                    <Typography variant="body2" color="text.secondary">
                        Showing {paginatedData.length} of {totalItems} transactions
                    </Typography>
                </Grid>
            </Grid>

            {filteredAndSortedData.length > 0 ? (
                <>
                    {/* Transaction list */}
                    <Box sx={{maxHeight: '60vh', overflow: 'auto'}}>
                        {paginatedData.map(renderTransactionRow)}
                    </Box>

                    {/* Pagination controls */}
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
    )
}