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
  Alert,
  Snackbar,
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
import { Investment, investmentsAPI } from '../services/api';
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
import { formatCurrency } from '../utils/formatters';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const getCategoryName = (categoryId: string): string => {
  const category = INVESTMENT_CATEGORIES.find(cat => cat.id === categoryId);
  return category ? category.name : 'Unknown Category';
};

const Investments: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Fetch investments
  const fetchInvestments = async () => {
    try {
      setLoading(true);
      const data = await investmentsAPI.getAll();
      setInvestments(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching investments:', err);
      setInvestments([]);
      setError('Failed to fetch investments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  // Handle investment creation
  const handleAddInvestment = async (newInvestment: Omit<Investment, '_id' | 'user'>) => {
    try {
      await investmentsAPI.create(newInvestment);
      setSuccessMessage('Investment added successfully');
      fetchInvestments();
      setOpenAddDialog(false);
    } catch (err) {
      setError('Failed to add investment');
      console.error('Error adding investment:', err);
    }
  };

  // Handle investment update
  const handleEditInvestment = async (updatedInvestment: Partial<Investment>) => {
    if (!selectedInvestment?._id) return;
    
    try {
      await investmentsAPI.update(selectedInvestment._id, updatedInvestment);
      setSuccessMessage('Investment updated successfully');
      fetchInvestments();
      setOpenEditDialog(false);
      setSelectedInvestment(null);
    } catch (err) {
      setError('Failed to update investment');
      console.error('Error updating investment:', err);
    }
  };

  // Handle investment deletion
  const handleDeleteInvestment = async (investment: Investment) => {
    try {
      await investmentsAPI.delete(investment._id);
      setSuccessMessage('Investment deleted successfully');
      fetchInvestments();
    } catch (err) {
      setError('Failed to delete investment');
      console.error('Error deleting investment:', err);
    }
  };

  // Sort investments
  const sortedInvestments = useMemo(() => {
    if (!Array.isArray(investments)) return [];
    
    return [...investments].sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
    });
  }, [investments, sortBy, sortOrder]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (!Array.isArray(investments)) return { total: 0, byCategory: [] };
    
    const total = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
    const byCategory = INVESTMENT_CATEGORIES.map(category => ({
      category: category.name,
      amount: investments
        .filter(inv => inv.category === category.id)
        .reduce((sum, inv) => sum + (inv.amount || 0), 0)
    }));
    return { total, byCategory };
  }, [investments]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {loading ? (
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      ) : (
        <Grid container spacing={3}>
          {/* Statistics Cards */}
          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              <Card elevation={0}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Investments
                  </Typography>
                  <Typography variant="h4">
                    {formatCurrency(stats.total)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Deducted from your balance
                  </Typography>
                </CardContent>
              </Card>
              <Card elevation={0}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Investment Categories
                  </Typography>
                  <Stack spacing={1}>
                    {stats.byCategory.map((category, index) => (
                      <Box key={category.category} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: COLORS[index % COLORS.length],
                          }}
                        />
                        <Typography variant="body2" sx={{ flex: 1 }}>
                          {category.category}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatCurrency(category.amount)}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* Investment Performance */}
          <Grid item xs={12} md={8}>
            <Card elevation={0}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Investment Distribution
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.byCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="amount"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {stats.byCategory.map((entry, index) => (
                          <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value: number) => formatCurrency(value)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Investments List */}
          <Grid item xs={12}>
            <Card elevation={0}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Your Investments
                  </Typography>
                  <Box>
                    <Tooltip title="Sort">
                      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                        <SortIcon />
                      </IconButton>
                    </Tooltip>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setOpenAddDialog(true)}
                      sx={{ ml: 1 }}
                    >
                      Add Investment
                    </Button>
                  </Box>
                </Box>

                {/* Sort Menu */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem onClick={() => {
                    setSortBy('date');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    setAnchorEl(null);
                  }}>
                    <ListItemIcon>
                      {sortBy === 'date' && (sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
                    </ListItemIcon>
                    <ListItemText>Sort by Date</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => {
                    setSortBy('amount');
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    setAnchorEl(null);
                  }}>
                    <ListItemIcon>
                      {sortBy === 'amount' && (sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />)}
                    </ListItemIcon>
                    <ListItemText>Sort by Amount</ListItemText>
                  </MenuItem>
                </Menu>

                {/* Investments Grid */}
                <Grid container spacing={2}>
                  {sortedInvestments.map((investment) => (
                    <Grid item xs={12} sm={6} md={4} key={investment._id}>
                      <Card 
                        elevation={0} 
                        sx={{ 
                          height: '100%',
                          transition: 'transform 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                          }
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Typography variant="h6" gutterBottom>
                              {investment.name}
                            </Typography>
                            <Box>
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setSelectedInvestment(investment);
                                    setOpenEditDialog(true);
                                  }}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteInvestment(investment)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>
                          <Chip
                            label={getCategoryName(investment.category)}
                            size="small"
                            sx={{ mb: 1 }}
                          />
                          <Typography variant="h5" sx={{ mt: 1, color: theme.palette.primary.main }}>
                            {formatCurrency(investment.amount)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            {new Date(investment.date).toLocaleDateString()}
                          </Typography>
                          {investment.notes && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              {investment.notes}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Success Message */}
      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Dialogs */}
      <AddInvestmentDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSubmit={handleAddInvestment}
      />
      <EditInvestmentDialog
        open={openEditDialog}
        investment={selectedInvestment}
        onClose={() => {
          setOpenEditDialog(false);
          setSelectedInvestment(null);
        }}
        onSubmit={handleEditInvestment}
      />
    </Container>
  );
};

export default Investments;
