import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api'; 
import '../styles/pages.css';

const Home = () => {
    const [stats, setStats] = useState(null);
    const [recentExpenses, setRecentExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            // Fetch dashboard stats
            const statsResponse = await api.get('/api/expenses/dashboard/stats');
            setStats(statsResponse.data);

            // Fetch recent expenses
            const expensesResponse = await api.get('/api/expenses');
            setRecentExpenses(expensesResponse.data.slice(0, 5));
        } catch (err) {
            setError('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    if (loading) return <div className="spinner"></div>;
    if (error) return <div className="alert alert-error">{error}</div>;

    return (
        <div className="page-container">
            <h1 className="page-title">Dashboard Overview</h1>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">💰</div>
                    <div className="stat-content">
                        <h3>Total Expenses</h3>
                        <p className="stat-value">{formatCurrency(stats?.totalExpenses || 0)}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                        <h3>Total Transactions</h3>
                        <p className="stat-value">{stats?.totalCount || 0}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📈</div>
                    <div className="stat-content">
                        <h3>Average Expense</h3>
                        <p className="stat-value">{formatCurrency(stats?.averageExpense || 0)}</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🏷️</div>
                    <div className="stat-content">
                        <h3>Categories Used</h3>
                        <p className="stat-value">
                            {Object.keys(stats?.categoryTotals || {}).length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <Link to="/add-expense" className="btn btn-primary">
                    ➕ Add New Expense
                </Link>
                <Link to="/history" className="btn btn-secondary">
                    📋 View All Expenses
                </Link>
                <Link to="/dashboard" className="btn btn-success">
                    📊 View Detailed Dashboard
                </Link>
            </div>

            {/* Recent Expenses */}
            <div className="recent-expenses card">
                <h2>Recent Expenses</h2>
                {recentExpenses.length > 0 ? (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentExpenses.map((expense) => (
                                <tr key={expense._id}>
                                    <td>
                                        {new Date(expense.date).toLocaleDateString()}
                                    </td>
                                    <td>{expense.title}</td>
                                    <td>
                                        <span className={`category-badge category-${expense.category.toLowerCase()}`}>
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td className="amount">{formatCurrency(expense.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No expenses recorded yet. Start by adding your first expense!</p>
                )}
                <div className="text-right mt-3">
                    <Link to="/history" className="btn btn-secondary">
                        View All Expenses →
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;