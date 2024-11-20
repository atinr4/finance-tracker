import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Chip,
  Tooltip,
  LinearProgress,
  useMediaQuery,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  DateRange,
  Refresh,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { dashboardAPI, DashboardStats } from '../services/api';
import { formatCurrency, formatCompactCurrency } from '../utils/formatters';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
  ];

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await dashboardAPI.getStats();
        setStats(data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated, refreshKey]);

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4">Please login to view your dashboard</Typography>
        </Box>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={48} />
        <Typography variant="h6" color="textSecondary">
          Loading your financial overview...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        py: 8,
        backgroundColor: alpha(theme.palette.error.main, 0.1),
        borderRadius: 2,
        p: 3
      }}>
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    );
  }

  const totalBalance = (stats?.transactions?.income || 0) - (stats?.transactions?.expense || 0);
  const investmentTotal = stats?.investments?.total || 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Financial Dashboard
        </Typography>
        <Tooltip title="Refresh data">
          <IconButton onClick={handleRefresh} color="primary">
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalance sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h6">Total Balance</Typography>
              </Box>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {formatCurrency(totalBalance)}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={(totalBalance / (totalBalance + investmentTotal)) * 100}
                sx={{ mb: 1, height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" color="textSecondary">
                {totalBalance >= 0 ? 'Net Positive' : 'Net Negative'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 1, color: theme.palette.success.main }} />
                <Typography variant="h6">Income</Typography>
              </Box>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {formatCurrency(stats?.transactions?.income || 0)}
              </Typography>
              <Chip 
                icon={<ArrowUpward />} 
                label="Monthly Income" 
                color="success"
                size="small"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={0}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingDown sx={{ mr: 1, color: theme.palette.error.main }} />
                <Typography variant="h6">Expenses</Typography>
              </Box>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {formatCurrency(stats?.transactions?.expense || 0)}
              </Typography>
              <Chip 
                icon={<ArrowDownward />} 
                label="Monthly Expenses" 
                color="error"
                size="small"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Card elevation={0} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Income vs Expenses Trend</Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={[
                      { name: 'Income', value: stats?.transactions?.income || 0 },
                      { name: 'Expenses', value: stats?.transactions?.expense || 0 }
                    ]}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={theme.palette.primary.main}
                      fill={alpha(theme.palette.primary.main, 0.2)}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Investment Distribution</Typography>
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.investments?.byCategory || []}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="total"
                    >
                      {(stats?.investments?.byCategory || []).map((entry, index) => (
                        <Cell key={entry.category} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ mt: 2 }}>
                {(stats?.investments?.byCategory || []).map((category, index) => (
                  <Chip
                    key={category.category}
                    label={`${category.category}: ${formatCompactCurrency(category.total)}`}
                    sx={{ m: 0.5 }}
                    size="small"
                    style={{ backgroundColor: alpha(COLORS[index % COLORS.length], 0.2) }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12}>
          <Card elevation={0}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Recent Transactions</Typography>
              <List>
                {stats?.transactions?.recent.map((transaction, index) => (
                  <React.Fragment key={transaction._id}>
                    <ListItem>
                      <ListItemText
                        primary={transaction.description}
                        secondary={new Date(transaction.date).toLocaleDateString()}
                      />
                      <Typography
                        variant="body1"
                        color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </Typography>
                    </ListItem>
                    {index < stats.transactions.recent.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
                {stats?.transactions?.recent.length === 0 && (
                  <ListItem>
                    <ListItemText
                      primary="No recent transactions"
                      secondary="Your recent transactions will appear here"
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
