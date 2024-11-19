import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Stack,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Grid,
  useTheme,
  alpha,
  Divider,
  TextField,
  InputAdornment,
  Tooltip,
  Fade,
  TablePagination,
  Skeleton,
  useMediaQuery,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Download as DownloadIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@mui/icons-material';
import type {
  ExpenseCategory,
  IncomeCategory,
  InvestmentCategory,
} from '@finance-tracker/shared';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  INVESTMENT_CATEGORIES,
} from '@finance-tracker/shared';
import AddTransactionDialog from '../components/AddTransactionDialog';
import EditTransactionDialog from '../components/EditTransactionDialog';
import { formatCurrency } from '../utils/formatCurrency';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense' | 'investment';
}

interface MonthYear {
  month: number;
  year: number;
  label: string;
}

const Transactions: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [availableMonths, setAvailableMonths] = useState<MonthYear[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<MonthYear | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Transaction;
    direction: 'asc' | 'desc';
  }>({ key: 'date', direction: 'desc' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      try {
        const storedTransactions = localStorage.getItem('transactions');
        const parsedTransactions = storedTransactions ? JSON.parse(storedTransactions) : [];
        setTransactions(parsedTransactions);
        updateAvailableMonths(parsedTransactions);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading transactions:', error);
        setTransactions([]);
        updateAvailableMonths([]);
        setIsLoading(false);
      }
    };

    loadData();

    // Set up event listener for storage changes
    window.addEventListener('storage', loadData);

    return () => {
      window.removeEventListener('storage', loadData);
    };
  }, []);

  const updateAvailableMonths = (transactionList: Transaction[]) => {
    const months = new Set<string>();
    transactionList.forEach((transaction) => {
      const date = new Date(transaction.date);
      const monthYear = `${date.getFullYear()}-${date.getMonth()}`;
      months.add(monthYear);
    });

    const sortedMonths = Array.from(months)
      .map((monthYear) => {
        const [year, month] = monthYear.split('-').map(Number);
        return {
          month,
          year,
          label: new Date(year, month).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          }),
        };
      })
      .sort((a, b) => {
        const dateA = new Date(a.year, a.month);
        const dateB = new Date(b.year, b.month);
        return dateB.getTime() - dateA.getTime();
      });

    setAvailableMonths(sortedMonths);
    if (sortedMonths.length > 0 && !selectedMonth) {
      setSelectedMonth(sortedMonths[0]);
    }
  };

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((transaction) => {
        const matchesSearch = searchQuery
          ? transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
          : true;

        const matchesMonth = selectedMonth
          ? new Date(transaction.date).getMonth() === selectedMonth.month &&
            new Date(transaction.date).getFullYear() === selectedMonth.year
          : true;

        const matchesType = selectedType
          ? transaction.type === selectedType
          : true;

        return matchesSearch && matchesMonth && matchesType;
      })
      .sort((a, b) => {
        const multiplier = sortConfig.direction === 'asc' ? 1 : -1;
        if (sortConfig.key === 'date') {
          return multiplier * (new Date(a.date).getTime() - new Date(b.date).getTime());
        }
        return multiplier * (a[sortConfig.key] > b[sortConfig.key] ? 1 : -1);
      });
  }, [transactions, searchQuery, selectedMonth, selectedType, sortConfig]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredTransactions.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredTransactions, page, rowsPerPage]);

  const handleSort = (key: keyof Transaction) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleAddTransaction = (transaction: Transaction) => {
    const updatedTransactions = [...transactions, transaction];
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    updateAvailableMonths(updatedTransactions);
  };

  const handleEditTransaction = (updatedTransaction: Transaction) => {
    const updatedTransactions = transactions.map((t) =>
      t.id === updatedTransaction.id ? updatedTransaction : t
    );
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    updateAvailableMonths(updatedTransactions);
    setSelectedTransaction(null);
    setOpenEditDialog(false);
  };

  const handleEditClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setOpenEditDialog(true);
  };

  const handleExportClick = (event: React.MouseEvent<HTMLElement>) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setExportAnchorEl(null);
  };

  const exportTransactionsForMonth = (monthYear: MonthYear) => {
    // Filter transactions for the selected month
    const monthTransactions = transactions.filter((transaction) => {
      const date = new Date(transaction.date);
      return (
        date.getMonth() === monthYear.month && date.getFullYear() === monthYear.year
      );
    });

    // Sort transactions by date
    const sortedTransactions = [...monthTransactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Prepare CSV content
    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...sortedTransactions.map((t) => {
        const category = getCategoryName(t.category, t.type);
        const amount = formatCurrency(t.amount);
        return [
          t.date,
          t.type,
          category,
          `"${t.description.replace(/"/g, '""')}"`, // Escape quotes in description
          amount,
        ].join(',');
      }),
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `transactions_${monthYear.label.replace(' ', '_')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleExportClose();
  };

  const getCategoryName = (categoryId: string, type: 'income' | 'expense' | 'investment'): string => {
    let categories: (ExpenseCategory | IncomeCategory | InvestmentCategory)[];
    switch (type) {
      case 'income':
        categories = INCOME_CATEGORIES;
        break;
      case 'expense':
        categories = EXPENSE_CATEGORIES;
        break;
      case 'investment':
        categories = INVESTMENT_CATEGORIES;
        break;
      default:
        return categoryId;
    }
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  const SortableTableHeader: React.FC<{
    label: string;
    field: keyof Transaction;
  }> = ({ label, field }) => (
    <TableCell
      onClick={() => handleSort(field)}
      sx={{
        cursor: 'pointer',
        userSelect: 'none',
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.04),
        },
      }}
    >
      <Box display="flex" alignItems="center">
        <Typography variant="subtitle2" fontWeight="medium">
          {label}
        </Typography>
        {sortConfig.key === field && (
          <Box component="span" ml={0.5}>
            {sortConfig.direction === 'asc' ? (
              <KeyboardArrowUpIcon fontSize="small" />
            ) : (
              <KeyboardArrowDownIcon fontSize="small" />
            )}
          </Box>
        )}
      </Box>
    </TableCell>
  );

  return (
    <Container maxWidth="xl">
      <Box py={3}>
        {/* Header Section */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Transactions
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenAddDialog(true)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
              }}
            >
              Add Transaction
            </Button>
          </Stack>
        </Box>

        {/* Filters and Search */}
        <Card
          sx={{
            mb: 3,
            background: 'linear-gradient(135deg, #ffffff, #f8f9fa)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          }}
        >
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ bgcolor: 'background.paper' }}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    startIcon={<FilterListIcon />}
                    onClick={(e) => setFilterAnchorEl(e.currentTarget)}
                    sx={{ textTransform: 'none' }}
                  >
                    Filter
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={(e) => setExportAnchorEl(e.currentTarget)}
                    sx={{ textTransform: 'none' }}
                  >
                    Export
                  </Button>
                </Stack>
              </Grid>
            </Grid>

            {/* Active Filters */}
            {(selectedMonth || selectedType) && (
              <Box mt={2}>
                <Stack direction="row" spacing={1}>
                  {selectedMonth && (
                    <Chip
                      label={selectedMonth.label}
                      onDelete={() => setSelectedMonth(null)}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {selectedType && (
                    <Chip
                      label={selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
                      onDelete={() => setSelectedType(null)}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Stack>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card
          sx={{
            background: 'linear-gradient(135deg, #ffffff, #f8f9fa)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <SortableTableHeader label="Date" field="date" />
                  <SortableTableHeader label="Description" field="description" />
                  <SortableTableHeader label="Category" field="category" />
                  <SortableTableHeader label="Amount" field="amount" />
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  Array.from(new Array(5)).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton variant="text" /></TableCell>
                      <TableCell><Skeleton variant="text" /></TableCell>
                      <TableCell><Skeleton variant="text" /></TableCell>
                      <TableCell><Skeleton variant="text" /></TableCell>
                      <TableCell><Skeleton variant="text" /></TableCell>
                    </TableRow>
                  ))
                ) : paginatedTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Box py={3}>
                        <Typography color="textSecondary">
                          No transactions found
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTransactions.map((transaction) => (
                    <TableRow
                      key={transaction.id}
                      sx={{
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.04),
                        },
                      }}
                    >
                      <TableCell>
                        {new Date(transaction.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.category}
                          size="small"
                          sx={{
                            backgroundColor: alpha(
                              transaction.type === 'income'
                                ? theme.palette.success.main
                                : transaction.type === 'expense'
                                ? theme.palette.error.main
                                : theme.palette.warning.main,
                              0.1
                            ),
                            color:
                              transaction.type === 'income'
                                ? theme.palette.success.main
                                : transaction.type === 'expense'
                                ? theme.palette.error.main
                                : theme.palette.warning.main,
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          color={transaction.type === 'expense' ? 'error' : 'success.main'}
                          fontWeight="medium"
                        >
                          {formatCurrency(transaction.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit Transaction" arrow>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedTransaction(transaction);
                              setOpenEditDialog(true);
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredTransactions.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </Card>

        {/* Filter Menu */}
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={() => setFilterAnchorEl(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem>
            <ListItemText primary="Filter by Month" />
          </MenuItem>
          {availableMonths.map((month) => (
            <MenuItem
              key={`${month.year}-${month.month}`}
              onClick={() => {
                setSelectedMonth(month);
                setFilterAnchorEl(null);
              }}
            >
              {month.label}
            </MenuItem>
          ))}
          <Divider />
          <MenuItem>
            <ListItemText primary="Filter by Type" />
          </MenuItem>
          {['income', 'expense', 'investment'].map((type) => (
            <MenuItem
              key={type}
              onClick={() => {
                setSelectedType(type);
                setFilterAnchorEl(null);
              }}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </MenuItem>
          ))}
        </Menu>

        {/* Export Menu */}
        <Menu
          anchorEl={exportAnchorEl}
          open={Boolean(exportAnchorEl)}
          onClose={() => setExportAnchorEl(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {availableMonths.map((month) => (
            <MenuItem
              key={`${month.year}-${month.month}`}
              onClick={() => {
                exportTransactionsForMonth(month);
                setExportAnchorEl(null);
              }}
            >
              <ListItemIcon>
                <DownloadIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={`Export ${month.label}`} />
            </MenuItem>
          ))}
        </Menu>

        {/* Dialogs */}
        <AddTransactionDialog
          open={openAddDialog}
          onClose={() => setOpenAddDialog(false)}
          onAdd={handleAddTransaction}
        />
        <EditTransactionDialog
          open={openEditDialog}
          onClose={() => {
            setOpenEditDialog(false);
            setSelectedTransaction(null);
          }}
          transaction={selectedTransaction}
          onEdit={handleEditTransaction}
        />
      </Box>
    </Container>
  );
};

export default Transactions;
