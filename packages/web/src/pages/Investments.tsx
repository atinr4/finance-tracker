import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  IconButton,
  useTheme,
  alpha,
  Tooltip,
  Chip,
  LinearProgress,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Skeleton,
  useMediaQuery,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  TrendingUp as TrendingUpIcon,
  ShowChart as ShowChartIcon,
  MoreVert as MoreVertIcon,
  Sort as SortIcon,
  FilterList as FilterListIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { INVESTMENT_CATEGORIES } from '@finance-tracker/shared/dist/constants';
import AddInvestmentDialog from '../components/AddInvestmentDialog';
import EditInvestmentDialog from '../components/EditInvestmentDialog';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from 'recharts';

interface Investment {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const Investments: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'amount' | 'date'>('amount');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedInvestments = localStorage.getItem('investments');
    if (storedInvestments) {
      setInvestments(JSON.parse(storedInvestments));
    }
    setIsLoading(false);
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, investment: Investment) => {
    setSelectedInvestment(investment);
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedInvestment(null);
  };

  const handleEditClick = (investment: Investment) => {
    setSelectedInvestment(investment);
    setOpenEditDialog(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    if (selectedInvestment) {
      const updatedInvestments = investments.filter(inv => inv.id !== selectedInvestment.id);
      setInvestments(updatedInvestments);
      localStorage.setItem('investments', JSON.stringify(updatedInvestments));
      handleMenuClose();
    }
  };

  const calculateTotalByCategory = (categoryId: string): number => {
    return investments
      .filter(inv => inv.category === categoryId)
      .reduce((total, inv) => total + inv.amount, 0);
  };

  const totalInvestments = useMemo(() => {
    return investments.reduce((sum, inv) => sum + inv.amount, 0);
  }, [investments]);

  const investmentsByCategory = useMemo(() => {
    return INVESTMENT_CATEGORIES.map(category => ({
      name: category.name,
      value: calculateTotalByCategory(category.id),
      riskLevel: category.riskLevel,
      id: category.id,
    }));
  }, [investments]);

  const monthlyData = useMemo(() => {
    const monthlyTotals = investments.reduce<Record<string, number>>((acc, inv) => {
      const date = new Date(inv.date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!acc[monthYear]) {
        acc[monthYear] = 0;
      }
      acc[monthYear] += inv.amount;
      return acc;
    }, {});

    return Object.entries(monthlyTotals)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, amount]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        amount,
      }));
  }, [investments]);

  const filteredInvestments = useMemo(() => {
    let filtered = selectedCategory
      ? investments.filter(inv => inv.category === selectedCategory)
      : investments;

    return filtered.sort((a, b) => {
      const multiplier = sortDirection === 'asc' ? 1 : -1;
      if (sortBy === 'amount') {
        return multiplier * (a.amount - b.amount);
      }
      return multiplier * (new Date(a.date).getTime() - new Date(b.date).getTime());
    });
  }, [investments, selectedCategory, sortBy, sortDirection]);

  const getInvestmentsByCategory = (categoryId: string): Investment[] => {
    return investments.filter((inv) => inv.category === categoryId);
  };

  const handleAddInvestment = (newInvestment: Investment) => {
    const updatedInvestments = [...investments, newInvestment];
    setInvestments(updatedInvestments);
    localStorage.setItem('investments', JSON.stringify(updatedInvestments));
  };

  const handleEditInvestment = (updatedInvestment: Investment) => {
    const updatedInvestments = investments.map((inv) =>
      inv.id === updatedInvestment.id ? updatedInvestment : inv
    );
    setInvestments(updatedInvestments);
    localStorage.setItem('investments', JSON.stringify(updatedInvestments));
    setSelectedInvestment(null);
  };

  const getRandomColor = (index: number) => {
    const colors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.error.main,
    ];
    return colors[index % colors.length];
  };

  return (
    <Container maxWidth="xl">
      <Box py={3}>
        {/* Header Section */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Investments
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
              Add Investment
            </Button>
          </Stack>
        </Box>

        {/* Summary Section */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, #ffffff, #f8f9fa)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="medium">
                  Investment Growth
                </Typography>
                <Box height={300}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" stroke="#666" />
                      <YAxis 
                        stroke="#666"
                        tickFormatter={(value) => formatCurrency(value)}
                      />
                      <RechartsTooltip 
                        formatter={(value: number) => [formatCurrency(value), 'Amount']}
                      />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke={theme.palette.primary.main}
                        fill={`${theme.palette.primary.main}20`}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, #ffffff, #f8f9fa)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom fontWeight="medium">
                  Portfolio Distribution
                </Typography>
                <Box height={300} display="flex" alignItems="center" justifyContent="center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={investmentsByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {investmentsByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getRandomColor(index)} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value: number) => [formatCurrency(value), 'Amount']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Investment Categories */}
        <Grid container spacing={3}>
          {INVESTMENT_CATEGORIES.map((category, index) => {
            const total = calculateTotalByCategory(category.id);
            const percentage = totalInvestments > 0 ? (total / totalInvestments) * 100 : 0;

            return (
              <Grid item xs={12} sm={6} md={4} key={category.id}>
                <Card
                  sx={{
                    height: '100%',
                    background: 'linear-gradient(135deg, #ffffff, #f8f9fa)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6" fontWeight="medium">
                        {category.name}
                      </Typography>
                      <Chip
                        label={category.riskLevel}
                        size="small"
                        sx={{
                          bgcolor: alpha(getRandomColor(index), 0.1),
                          color: getRandomColor(index),
                          fontWeight: 'medium',
                        }}
                      />
                    </Box>

                    <Typography variant="h4" fontWeight="bold" mb={1}>
                      {formatCurrency(total)}
                    </Typography>

                    <Box mb={1}>
                      <Typography variant="body2" color="text.secondary" mb={0.5}>
                        {percentage.toFixed(1)}% of portfolio
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: alpha(getRandomColor(index), 0.1),
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getRandomColor(index),
                            borderRadius: 3,
                          },
                        }}
                      />
                    </Box>

                    <Box mt={2}>
                      {getInvestmentsByCategory(category.id).map((investment) => (
                        <Box
                          key={investment.id}
                          sx={{
                            py: 1,
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            '&:last-child': {
                              borderBottom: 'none',
                            },
                          }}
                        >
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {investment.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(investment.date).toLocaleDateString()}
                              </Typography>
                            </Box>
                            <Box display="flex" alignItems="center">
                              <Typography variant="body2" fontWeight="medium" mr={1}>
                                {formatCurrency(investment.amount)}
                              </Typography>
                              <Tooltip title="Edit Investment">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditClick(investment)}
                                  sx={{ color: theme.palette.primary.main }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Investment List */}
        <Grid container spacing={3} mt={2}>
          {filteredInvestments.map((investment) => (
            <Grid item xs={12} sm={6} md={4} key={investment.id}>
              <Card
                sx={{
                  height: '100%',
                  background: 'linear-gradient(135deg, #ffffff, #f8f9fa)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="h6" fontWeight="medium" gutterBottom>
                        {investment.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatCurrency(investment.amount)}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(event) => handleMenuOpen(event, investment)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Action Menu */}
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={() => selectedInvestment && handleEditClick(selectedInvestment)}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Investment</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
            </ListItemIcon>
            <ListItemText>Delete Investment</ListItemText>
          </MenuItem>
        </Menu>

        {/* Dialogs */}
        <AddInvestmentDialog
          open={openAddDialog}
          onClose={() => setOpenAddDialog(false)}
          onAdd={handleAddInvestment}
        />
        <EditInvestmentDialog
          isOpen={openEditDialog}
          handleClose={() => {
            setOpenEditDialog(false);
            setSelectedInvestment(null);
          }}
          investment={selectedInvestment}
          handleSave={handleEditInvestment}
        />
      </Box>
    </Container>
  );
};

export default Investments;
