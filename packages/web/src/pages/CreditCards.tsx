import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  IconButton,
  Stack,
  Chip,
  useTheme,
  alpha,
  Tooltip,
  LinearProgress,
  Paper,
  Divider,
  useMediaQuery,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as AccountBalanceIcon,
  CalendarToday as CalendarTodayIcon,
  Payment as PaymentIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
} from '@mui/icons-material';
import type { CreditCard } from '@finance-tracker/shared';
import CreditCardDialog from '../components/CreditCardDialog';

const CreditCards: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CreditCard | undefined>(undefined);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCardForMenu, setSelectedCardForMenu] = useState<CreditCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedCards = localStorage.getItem('creditCards');
    if (storedCards) {
      setCards(JSON.parse(storedCards));
    }
    setIsLoading(false);
  }, []);

  const handleSaveCard = (card: CreditCard) => {
    let updatedCards: CreditCard[];
    if (selectedCard) {
      updatedCards = cards.map((c) => (c.id === card.id ? card : c));
    } else {
      updatedCards = [...cards, card];
    }
    setCards(updatedCards);
    localStorage.setItem('creditCards', JSON.stringify(updatedCards));
    handleCloseDialog();
  };

  const handleEditCard = (card: CreditCard) => {
    setSelectedCard(card);
    setOpenDialog(true);
  };

  const handleDeleteCard = (cardId: string) => {
    const updatedCards = cards.filter((c) => c.id !== cardId);
    setCards(updatedCards);
    localStorage.setItem('creditCards', JSON.stringify(updatedCards));
    setMenuAnchorEl(null);
  };

  const handleCloseDialog = () => {
    setSelectedCard(undefined);
    setOpenDialog(false);
  };

  const getDaysUntilDue = (dueDate?: number): number | null => {
    if (!dueDate) return null;

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const dueDateTime = new Date(currentYear, currentMonth, dueDate);

    if (dueDateTime.getTime() < today.getTime()) {
      dueDateTime.setMonth(dueDateTime.getMonth() + 1);
    }

    const diffTime = dueDateTime.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getDaysUntilStatement = (statementDate?: number): number | null => {
    if (!statementDate) return null;

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const statementDateTime = new Date(currentYear, currentMonth, statementDate);

    if (statementDateTime.getTime() < today.getTime()) {
      statementDateTime.setMonth(statementDateTime.getMonth() + 1);
    }

    const diffTime = statementDateTime.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const renderDueStatus = (dueDate?: number) => {
    if (!dueDate) return null;

    const daysUntilDue = getDaysUntilDue(dueDate);
    if (daysUntilDue === null) return null;

    let color: 'success' | 'warning' | 'error' = 'success';
    let label = `${daysUntilDue} days until payment due`;
    let icon = <PaymentIcon fontSize="small" />;

    if (daysUntilDue <= 3) {
      color = 'error';
      icon = <NotificationsActiveIcon fontSize="small" />;
    } else if (daysUntilDue <= 7) {
      color = 'warning';
      icon = <NotificationsIcon fontSize="small" />;
    }

    return (
      <Chip
        icon={icon}
        label={label}
        color={color}
        size="small"
        sx={{
          '& .MuiChip-icon': {
            color: 'inherit',
          },
        }}
      />
    );
  };

  const renderStatementStatus = (statementDate?: number) => {
    if (!statementDate) return null;

    const daysUntilStatement = getDaysUntilStatement(statementDate);
    if (daysUntilStatement === null) return null;

    return (
      <Chip
        icon={<CalendarTodayIcon fontSize="small" />}
        label={`Statement in ${daysUntilStatement} days`}
        variant="outlined"
        size="small"
        sx={{
          borderColor: alpha(theme.palette.primary.main, 0.3),
          color: theme.palette.text.secondary,
        }}
      />
    );
  };

  const cardsByBank = useMemo(() => {
    return cards.reduce((acc, card) => {
      if (!acc[card.bank]) {
        acc[card.bank] = [];
      }
      acc[card.bank].push(card);
      return acc;
    }, {} as Record<string, CreditCard[]>);
  }, [cards]);

  return (
    <Container maxWidth="xl">
      <Box py={3}>
        {/* Header Section */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Credit Cards
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
            }}
          >
            Add Credit Card
          </Button>
        </Box>

        {/* Cards Section */}
        {Object.entries(cardsByBank).map(([bank, bankCards]) => (
          <Box key={bank} mb={4}>
            <Box display="flex" alignItems="center" mb={2}>
              <AccountBalanceIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
              <Typography variant="h6" fontWeight="medium">
                {bank}
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {bankCards.map((card) => (
                <Grid item xs={12} sm={6} md={4} key={card.id}>
                  <Card
                    sx={{
                      height: '100%',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.primary.main}05)`,
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      borderRadius: 2,
                      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                      },
                    }}
                  >
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="h6" fontWeight="medium" gutterBottom>
                            {card.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            **** **** **** {card.lastFourDigits}
                          </Typography>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={(event) => {
                            setSelectedCardForMenu(card);
                            setMenuAnchorEl(event.currentTarget);
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>

                      <Box mt={2}>
                        <Stack direction="column" spacing={1}>
                          {renderDueStatus(card.dueDate)}
                          {renderStatementStatus(card.statementDate)}
                        </Stack>
                      </Box>

                      <Box mt={2}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Payment Due
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {card.dueDate}th of month
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary" display="block">
                              Statement Date
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {card.statementDate}th of month
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}

        {/* Card Actions Menu */}
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={() => {
            setMenuAnchorEl(null);
            setSelectedCardForMenu(null);
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem
            onClick={() => {
              if (selectedCardForMenu) {
                handleEditCard(selectedCardForMenu);
              }
              setMenuAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Card</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (selectedCardForMenu) {
                handleDeleteCard(selectedCardForMenu.id);
              }
              setMenuAnchorEl(null);
            }}
            sx={{ color: theme.palette.error.main }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
            </ListItemIcon>
            <ListItemText>Delete Card</ListItemText>
          </MenuItem>
        </Menu>

        {/* Add/Edit Dialog */}
        <CreditCardDialog
          open={openDialog}
          onClose={handleCloseDialog}
          onSave={handleSaveCard}
          card={selectedCard}
        />
      </Box>
    </Container>
  );
};

export default CreditCards;
