import {Box, Grid, InputAdornment, MenuItem, Select, TextField, Typography} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

interface ToolbarProps {
    searchTerm: string;
    setSearchTerm: (v: string) => void;
    sortBy: 'date' | 'value';
    setSortBy: (v: 'date' | 'value') => void;
    sortOrder: 'asc' | 'desc';
    setSortOrder: (v: 'asc' | 'desc') => void;
    rowsPerPage: number;
    setRowsPerPage: (v: number) => void;
    paginatedCount: number;
    totalCount: number;
}
export function TransactionHistoryToolbar({
                                              searchTerm,
                                              setSearchTerm,
                                              sortBy,
                                              setSortBy,
                                              sortOrder,
                                              setSortOrder,
                                              paginatedCount,
                                              totalCount
                                          }: Readonly<ToolbarProps>) {
    return (
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
                    Showing {paginatedCount} of {totalCount} transactions
                </Typography>
            </Grid>
        </Grid>
    );
}