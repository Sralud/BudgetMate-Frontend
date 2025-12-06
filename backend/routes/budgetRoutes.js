const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const { validateBudget } = require('../middleware/validationMiddleware');

// Endpoint 1: Get Budget Settings
// GET /api/budget
// Uses 'authMiddleware' to ensure only logged-in users can see their own budget
router.get('/', authMiddleware, async (req, res) => {
    try {
        // Find the user in the DB by ID (from the token)
        // .select(...) picks only the fields we need to send back
        const user = await User.findById(req.user.id).select('monthlyIncome paymentFrequency spendingCategories targetSavingsRate emergencyFundGoal annualSavingsGoal');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send the data back to the frontend
        res.json(user);
    } catch (err) {
        console.error('Error fetching budget:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Endpoint 2: Update Budget Settings
// PUT /api/budget
// Updates fields like Income, Goals, etc.
router.put('/', [authMiddleware, validateBudget], async (req, res) => {
    try {
        // Destructure (unpack) the new values sent from the frontend
        const {
            monthlyIncome,
            paymentFrequency,
            spendingCategories,
            targetSavingsRate,
            emergencyFundGoal,
            annualSavingsGoal
        } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Only update fields that were actually sent (undefined check)
        if (monthlyIncome !== undefined) user.monthlyIncome = monthlyIncome;
        if (paymentFrequency !== undefined) user.paymentFrequency = paymentFrequency;
        if (spendingCategories !== undefined) user.spendingCategories = spendingCategories;
        if (targetSavingsRate !== undefined) user.targetSavingsRate = targetSavingsRate;
        if (emergencyFundGoal !== undefined) user.emergencyFundGoal = emergencyFundGoal;
        if (annualSavingsGoal !== undefined) user.annualSavingsGoal = annualSavingsGoal;

        // Save changes to MongoDB
        await user.save();

        // Send back the updated budget object
        res.json({
            message: 'Budget settings updated',
            budget: {
                monthlyIncome: user.monthlyIncome,
                paymentFrequency: user.paymentFrequency,
                spendingCategories: user.spendingCategories,
                targetSavingsRate: user.targetSavingsRate,
                emergencyFundGoal: user.emergencyFundGoal,
                annualSavingsGoal: user.annualSavingsGoal
            }
        });
    } catch (err) {
        console.error('Error updating budget:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
