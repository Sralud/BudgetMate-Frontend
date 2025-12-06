import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/api';

/**
 * Custom hook for budget management
 * @returns {object} Budget state and methods
 */
export const useBudget = () => {
    const [budgetData, setBudgetData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Action: Load budget from phone storage first, then update from internet
    const loadBudget = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // 1. Try local storage (fastest) - this allows offline access
            const savedData = await AsyncStorage.getItem('userBudget');
            if (savedData) {
                setBudgetData(JSON.parse(savedData));
            }

            // 2. Then try backend (freshest data)
            try {
                const response = await api.get('/api/budget');
                if (response.data) {
                    const backendData = response.data;
                    // Update local storage with the new data
                    await AsyncStorage.setItem('userBudget', JSON.stringify(backendData));
                    setBudgetData(backendData);
                }
            } catch (apiError) {
                console.log('No budget data on backend or offline:', apiError.message);
            }
        } catch (err) {
            console.error('Failed to load budget:', err);
            setError('Failed to load budget data');
        } finally {
            setLoading(false);
        }
    }, []);

    // Action: Save new budget settings (like income)
    const saveBudget = async (data) => {
        try {
            // 1. Save locally (instant feedback)
            await AsyncStorage.setItem('userBudget', JSON.stringify(data));
            setBudgetData(data);

            // 2. Save to backend (sync)
            try {
                await api.post('/api/budget', data);
            } catch (apiError) {
                console.log('Failed to save to backend (will sync later):', apiError.message);
            }

            return { success: true };
        } catch (err) {
            console.error('Failed to save budget:', err);
            return { success: false, error: 'Failed to save budget' };
        }
    };

    // Update budget data
    const updateBudget = async (updates) => {
        try {
            const updatedData = { ...budgetData, ...updates };
            await saveBudget(updatedData);
            return { success: true };
        } catch (err) {
            console.error('Failed to update budget:', err);
            return { success: false, error: 'Failed to update budget' };
        }
    };

    // Helper: Calculate how much money is left to spend
    // Formula: Income - Spending (excluding Savings deposits) - Savings Goals
    const calculateAvailableBalance = (expenses = []) => {
        if (!budgetData?.monthlyIncome) return 0;

        // Sum up all spending that implies money leaving your pocket (Food, Transport, etc.)
        const totalSpent = expenses
            .filter(item => item.category !== 'Savings')
            .reduce((sum, item) => sum + item.amount, 0);

        // Sum up money moved to savings (not "spent" but also not "available" for bills)
        const emergencyFundSaved = expenses
            .filter(item => item.category === 'Savings')
            .reduce((sum, item) => sum + item.amount, 0);

        return budgetData.monthlyIncome - totalSpent - emergencyFundSaved;
    };

    // Calculate savings rate
    const calculateSavingsRate = (expenses = []) => {
        if (!budgetData?.monthlyIncome) return 0;

        const totalSpent = expenses
            .filter(item => item.category !== 'Savings')
            .reduce((sum, item) => sum + item.amount, 0);

        return ((budgetData.monthlyIncome - totalSpent) / budgetData.monthlyIncome) * 100;
    };

    // Load on mount
    useEffect(() => {
        loadBudget();
    }, [loadBudget]);

    return {
        budgetData,
        loading,
        error,
        loadBudget,
        saveBudget,
        updateBudget,
        calculateAvailableBalance,
        calculateSavingsRate,
    };
};

export default useBudget;
