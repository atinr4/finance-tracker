import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Box,
  useTheme,
  useMediaQuery,
  Skeleton,
  IconButton,
  Tooltip,
  Fade,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  ShowChart as ShowChartIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  MoreVert as MoreVertIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { COLORS } from '@finance-tracker/shared/dist/constants';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { formatCurrency, formatCurrencyCompact } from '../utils/formatCurrency';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense' | 'investment';
}

interface Investment {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
}

interface DashboardCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend?: number;
  loading?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  color,
  trend,
  loading = false,
}) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: 2.5,
        background: 'linear-gradient(135deg, #ffffff, #f8f9fa)',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography variant="subtitle1" color="textSecondary" fontWeight="medium">
          {title}
        </Typography>
        <Box
          sx={{
            p: 1,
            borderRadius: 1,
            backgroundColor: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
      </Box>
      {loading ? (
        <Skeleton variant="rectangular" width="100%" height={60} />
      ) : (
        <>
          <Typography variant="h4" component="div" fontWeight="bold" sx={{ mb: 1 }}>
            {formatCurrency(value)}
          </Typography>
          {trend !== undefined && (
            <Box display="flex" alignItems="center">
              {trend >= 0 ? (
                <ArrowUpwardIcon sx={{ color: COLORS.success, fontSize: 16 }} />
              ) : (
                <ArrowDownwardIcon sx={{ color: COLORS.error, fontSize: 16 }} />
              )}
              <Typography
                variant="body2"
                color={trend >= 0 ? 'success.main' : 'error.main'}
                sx={{ ml: 0.5 }}
              >
                {Math.abs(trend).toFixed(1)}%
              </Typography>
            </Box>
          )}
        </>
      )}
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'1M' | '3M' | '6M' | '1Y'>('1M');
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  useEffect(() => {
    const loadData = () => {
      try {
        const storedTransactions = localStorage.getItem('transactions');
        const storedInvestments = localStorage.getItem('investments');

        setTransactions(storedTransactions ? JSON.parse(storedTransactions) : []);
        setInvestments(storedInvestments ? JSON.parse(storedInvestments) : []);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setTransactions([]);
        setInvestments([]);
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

  const calculateMonthlyTotals = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const savings = income - expenses;

    return { income, expenses, savings };
  };

  const totals = calculateMonthlyTotals();
  const totalInvestments = investments.reduce((sum, inv) => sum + inv.amount, 0);

  const getChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    return months.slice(0, currentMonth + 1).map(month => {
      const monthTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return months[date.getMonth()] === month;
      });

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        name: month,
        Income: income,
        Expenses: expenses,
        Savings: income - expenses,
      };
    });
  };

  const getCategoryDistribution = () => {
    const categories = transactions.reduce<Record<string, number>>((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0;
      }
      acc[transaction.category] += transaction.amount;
      return acc;
    }, {});

    return Object.keys(categories).map(category => ({
      name: category,
      value: categories[category],
    }));
  };

  const getRandomColor = (index: number) => {
    const colors = [
      COLORS.success,
      COLORS.error,
      COLORS.warning,
      COLORS.info,
      COLORS.primary,
    ];
    return colors[index % colors.length];
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, px: { xs: 2, sm: 3 } }}>
      <Grid container spacing={3}>
        {/* Welcome Section */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Financial Dashboard
            </Typography>
            <Box>
              {/* Time range selector */}
              {['1M', '3M', '6M', '1Y'].map((range) => (
                <Tooltip title={`Last ${range}`} key={range}>
                  <IconButton
                    size="small"
                    onClick={() => setSelectedTimeRange(range as any)}
                    sx={{
                      ml: 1,
                      backgroundColor: selectedTimeRange === range ? theme.palette.primary.main : 'transparent',
                      color: selectedTimeRange === range ? 'white' : 'inherit',
                      '&:hover': {
                        backgroundColor: selectedTimeRange === range 
                          ? theme.palette.primary.dark 
                          : theme.palette.action.hover,
                      },
                    }}
                  >
                    {range}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
          </Box>
        </Grid>

        {/* Financial Overview */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              overflow: 'visible',
            }}
            elevation={0}
          >
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Financial Overview
            </Typography>
            <Grid container spacing={3}>
              {/* Summary Cards */}
              <Grid item xs={12} sm={6} md={3}>
                <DashboardCard
                  title="Monthly Income"
                  value={calculateMonthlyTotals().income}
                  icon={<TrendingUpIcon sx={{ color: COLORS.success }} />}
                  color={COLORS.success}
                  trend={12}
                  loading={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DashboardCard
                  title="Monthly Expenses"
                  value={calculateMonthlyTotals().expenses}
                  icon={<TrendingUpIcon sx={{ color: COLORS.error }} />}
                  color={COLORS.error}
                  trend={-5}
                  loading={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DashboardCard
                  title="Monthly Savings"
                  value={calculateMonthlyTotals().savings}
                  icon={<AccountBalanceIcon sx={{ color: COLORS.info }} />}
                  color={COLORS.info}
                  trend={8}
                  loading={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DashboardCard
                  title="Investments"
                  value={investments.reduce((sum, inv) => sum + inv.amount, 0)}
                  icon={<ShowChartIcon sx={{ color: COLORS.warning }} />}
                  color={COLORS.warning}
                  trend={15}
                  loading={isLoading}
                />
              </Grid>

              {/* Charts Section */}
              <Grid item xs={12} md={8}>
                <Paper
                  sx={{
                    p: 3,
                    height: '400px',
                    background: 'linear-gradient(135deg, #ffffff, #f8f9fa)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight="medium">
                    Financial Overview
                  </Typography>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={getChartData()}
                      margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#666" />
                      <YAxis stroke="#666" />
                      <RechartsTooltip 
                        formatter={(value: number) => [formatCurrency(value), 'Amount']}
                        labelFormatter={(label) => `${label}`}
                      />
                      <Area
                        type="monotone"
                        dataKey="income"
                        stackId="1"
                        stroke={COLORS.success}
                        fill={`${COLORS.success}30`}
                      />
                      <Area
                        type="monotone"
                        dataKey="expenses"
                        stackId="1"
                        stroke={COLORS.error}
                        fill={`${COLORS.error}30`}
                      />
                      <Area
                        type="monotone"
                        dataKey="investments"
                        stackId="1"
                        stroke={COLORS.warning}
                        fill={`${COLORS.warning}30`}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>

              {/* Recent Activity & Distribution */}
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 3,
                    height: '400px',
                    background: 'linear-gradient(135deg, #ffffff, #f8f9fa)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    overflow: 'hidden',
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight="medium">
                    Expense Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getCategoryDistribution()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {getCategoryDistribution().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getRandomColor(index)} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value: number) => [formatCurrency(value), '']}
                        labelFormatter={(label) => `${label}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>

              {/* Recent Transactions */}
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 3,
                    background: 'linear-gradient(135deg, #ffffff, #f8f9fa)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <Typography variant="h6" gutterBottom fontWeight="medium">
                    Recent Transactions
                  </Typography>
                  <List>
                    {isLoading ? (
                      Array.from(new Array(5)).map((_, index) => (
                        <ListItem key={index} divider>
                          <ListItemText
                            primary={<Skeleton variant="text" width="60%" />}
                            secondary={<Skeleton variant="text" width="40%" />}
                          />
                          <ListItemSecondaryAction>
                            <Skeleton variant="text" width={100} />
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))
                    ) : (
                      transactions
                        .slice(0, 5)
                        .map((transaction) => (
                          <ListItem
                            key={transaction.id}
                            divider
                            sx={{
                              transition: 'background-color 0.2s',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                              },
                            }}
                          >
                            <ListItemText
                              primary={transaction.description}
                              secondary={formatCurrency(transaction.amount)}
                              secondaryTypographyProps={{
                                color: transaction.type === 'expense' ? 'error' : 'success.main',
                              }}
                            />
                            <ListItemSecondaryAction>
                              <Typography
                                color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                                fontWeight="medium"
                              >
                                {formatCurrency(transaction.amount)}
                              </Typography>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))
                    )}
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
