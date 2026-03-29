const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

// Get all expenses
router.get('/', auth, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.userId })
            .sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single expense
router.get('/:id', auth, async (req, res) => {
    try {
        const expense = await Expense.findOne({
            _id: req.params.id,
            user: req.user.userId
        });
        
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        
        res.json(expense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create expense
router.post('/', auth, async (req, res) => {
    try {
        const expense = await Expense.create({
            ...req.body,
            user: req.user.userId
        });
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update expense
router.put('/:id', auth, async (req, res) => {
    try {
        const expense = await Expense.findOneAndUpdate(
            { _id: req.params.id, user: req.user.userId },
            req.body,
            { new: true }
        );
        
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        
        res.json(expense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete expense
router.delete('/:id', auth, async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId
        });
        
        if (!expense) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        
        res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get dashboard statistics
router.get('/dashboard/stats', auth, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.userId });
        
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        const categoryTotals = expenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {});
        
        // Monthly data
        const monthlyData = expenses.reduce((acc, expense) => {
            const month = expense.date.toISOString().slice(0, 7); // YYYY-MM
            acc[month] = (acc[month] || 0) + expense.amount;
            return acc;
        }, {});
        
        res.json({
            totalExpenses,
            categoryTotals,
            monthlyData,
            totalCount: expenses.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;