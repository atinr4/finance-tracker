import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { TextInput, Button, SegmentedButtons, List } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Transaction } from '@finance-tracker/shared/src/types';
import { EXPENSE_CATEGORIES, INVESTMENT_CATEGORIES, COLORS } from '@finance-tracker/shared/src/constants';

const AddTransactionScreen = () => {
  const navigation = useNavigation();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'income' | 'expense' | 'investment'>('expense');
  const [category, setCategory] = useState('');

  const handleSave = async () => {
    if (!amount || !description || !category) {
      return;
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      amount: parseFloat(amount),
      type,
      category,
      description,
    };

    try {
      const storedTransactions = await AsyncStorage.getItem('transactions');
      const transactions = storedTransactions ? JSON.parse(storedTransactions) : [];
      transactions.unshift(newTransaction);
      await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
      navigation.goBack();
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const categories = type === 'investment' ? INVESTMENT_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <ScrollView style={styles.container}>
      <SegmentedButtons
        value={type}
        onValueChange={(value) => setType(value as typeof type)}
        buttons={[
          { value: 'income', label: 'Income' },
          { value: 'expense', label: 'Expense' },
          { value: 'investment', label: 'Investment' },
        ]}
        style={styles.segmentedButtons}
      />

      <TextInput
        label="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        style={styles.input}
      />

      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      <List.Section>
        <List.Subheader>Category</List.Subheader>
        {categories.map((cat) => (
          <List.Item
            key={cat.id}
            title={cat.name}
            left={(props) => <List.Icon {...props} icon={cat.icon} />}
            onPress={() => setCategory(cat.id)}
            style={[
              styles.categoryItem,
              category === cat.id && styles.selectedCategory,
            ]}
          />
        ))}
      </List.Section>

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
        disabled={!amount || !description || !category}
      >
        Save Transaction
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  segmentedButtons: {
    margin: 16,
  },
  input: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: COLORS.surface,
  },
  categoryItem: {
    backgroundColor: COLORS.surface,
  },
  selectedCategory: {
    backgroundColor: `${COLORS.primary}20`,
  },
  button: {
    margin: 16,
  },
});

export default AddTransactionScreen;
