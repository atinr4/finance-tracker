import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, FAB, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, MonthlyBudget } from '@finance-tracker/shared/src/types';
import { COLORS } from '@finance-tracker/shared/src/constants';

const DashboardScreen = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthlyBudget, setMonthlyBudget] = useState<MonthlyBudget | null>(null);
  const navigation = useNavigation();
  const theme = useTheme();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedTransactions = await AsyncStorage.getItem('transactions');
      const storedBudget = await AsyncStorage.getItem('monthlyBudget');
      
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }
      if (storedBudget) {
        setMonthlyBudget(JSON.parse(storedBudget));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const calculateTotals = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    return {
      income: monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0),
      expenses: monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0),
      investments: monthlyTransactions
        .filter(t => t.type === 'investment')
        .reduce((sum, t) => sum + t.amount, 0),
    };
  };

  const totals = calculateTotals();

  return (
    <View style={styles.container}>
      <ScrollView>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Monthly Overview</Title>
            <View style={styles.statsContainer}>
              <View style={styles.stat}>
                <Paragraph style={styles.statLabel}>Income</Paragraph>
                <Title style={{ color: COLORS.success }}>${totals.income}</Title>
              </View>
              <View style={styles.stat}>
                <Paragraph style={styles.statLabel}>Expenses</Paragraph>
                <Title style={{ color: COLORS.error }}>${totals.expenses}</Title>
              </View>
              <View style={styles.stat}>
                <Paragraph style={styles.statLabel}>Investments</Paragraph>
                <Title style={{ color: COLORS.primary }}>${totals.investments}</Title>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Recent Transactions</Title>
            {transactions.slice(0, 5).map((transaction, index) => (
              <View key={index} style={styles.transaction}>
                <Paragraph>{transaction.description}</Paragraph>
                <Title
                  style={{
                    color:
                      transaction.type === 'income'
                        ? COLORS.success
                        : transaction.type === 'expense'
                        ? COLORS.error
                        : COLORS.primary,
                  }}
                >
                  ${transaction.amount}
                </Title>
              </View>
            ))}
          </Card.Content>
        </Card>
      </ScrollView>

      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={() => navigation.navigate('AddTransaction')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#666',
  },
  transaction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default DashboardScreen;
