import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
import '../styles/pages.css';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/expenses/dashboard/stats');
            setStats(response.data);
        } catch (err) {
            setError('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getCategoryColor = (category) => {
        const colors = {
            'Food': '#ff5252',
            'Transport': '#448aff',
            'Shopping': '#ff4081',
            'Entertainment': '#ff9800',
            'Bills': '#4caf50',
            'Healthcare': '#00bcd4',
            'Education': '#9c27b0',
            'Other': '#795548'
        };
        return colors[category] || '#9e9e9e';
    };

    if (loading) return <div className="spinner"></div>;
    if (error) return <div className="alert alert-error">{error}</div>;

    return (
        <div className="page-container">
            <h1 className="page-title">Analytics Dashboard</h1>

            {/* Summary Stats */}
            <div className="stats-grid mb-4">
                <div className="stat-card">
                    <div className="stat-icon">📊</div>
                    <div className="stat-content">
                        <h3>Total Spending</h3>
                        <p className="stat-value">{formatCurrency(stats.totalExpenses)}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📝</div>
                    <div className="stat-content">
                        <h3>Transactions</h3>
                        <p className="stat-value">{stats.totalCount}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon">📈</div>
                    <div className="stat-content">
                        <h3>Average/Transaction</h3>
                        <p className="stat-value">{formatCurrency(stats.averageExpense)}</p>
                    </div>
                </div>
            </div>

            {/* Charts Container */}
            <div className="charts-container">
                {/* Category Breakdown */}
                <div className="chart-card">
                    <h3 className="chart-title">Spending by Category</h3>
                    <div className="category-breakdown">
                        {Object.entries(stats.categoryTotals || {}).map(([category, amount]) => {
                            const percentage = (amount / stats.totalExpenses * 100).toFixed(1);
                            return (
                                <div key={category} className="category-item mb-3">
                                    <div className="flex justify-between mb-1">
                                        <span>{category}</span>
                                        <span>{formatCurrency(amount)} ({percentage}%)</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div 
                                            className="progress-fill"
                                            style={{
                                                width: `${percentage}%`,
                                                backgroundColor: getCategoryColor(category)
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Monthly Spending */}
                <div className="chart-card">
                    <h3 className="chart-title">Monthly Spending</h3>
                    <div className="monthly-breakdown">
                        {Object.entries(stats.monthlyExpenses || {}).map(([month, amount]) => (
                            <div key={month} className="monthly-item mb-3">
                                <div className="flex justify-between mb-1">
                                    <span>{month}</span>
                                    <span>{formatCurrency(amount)}</span>
                                </div>
                                <div className="progress-bar">
                                    <div 
                                        className="progress-fill"
                                        style={{
                                            width: `${(amount / Math.max(...Object.values(stats.monthlyExpenses || {0: 0})) * 100)}%`,
                                            backgroundColor: '#007bff'
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Category Distribution */}
            <div className="card">
                <h3>Category Distribution</h3>
                <div className="category-distribution">
                    {Object.entries(stats.categoryTotals || {}).map(([category, amount]) => (
                        <div 
                            key={category} 
                            className="category-box"
                            style={{
                                backgroundColor: getCategoryColor(category),
                                color: 'white',
                                padding: '15px',
                                borderRadius: '8px',
                                margin: '5px'
                            }}
                        >
                            <div className="font-bold">{category}</div>
                            <div>{formatCurrency(amount)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;