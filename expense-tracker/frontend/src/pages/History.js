import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
import '../styles/pages.css';

const History = () => {
    const [expenses, setExpenses] = useState([]);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date-desc');

    const categories = [
        'all', 'Food', 'Transport', 'Shopping', 'Entertainment',
        'Bills', 'Healthcare', 'Education', 'Other'
    ];

    useEffect(() => {
        fetchExpenses();
    }, []);

    useEffect(() => {
        filterAndSortExpenses();
    }, [expenses, search, categoryFilter, sortBy]);

    const fetchExpenses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/expenses');
            setExpenses(response.data);
        } catch (err) {
            setError('Failed to fetch expenses');
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortExpenses = () => {
        let filtered = [...expenses];

        // Apply search filter
        if (search) {
            filtered = filtered.filter(expense =>
                expense.title.toLowerCase().includes(search.toLowerCase()) ||
                expense.description?.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Apply category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(expense => expense.category === categoryFilter);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'date-desc':
                    return new Date(b.date) - new Date(a.date);
                case 'date-asc':
                    return new Date(a.date) - new Date(b.date);
                case 'amount-desc':
                    return b.amount - a.amount;
                case 'amount-asc':
                    return a.amount - b.amount;
                default:
                    return 0;
            }
        });

        setFilteredExpenses(filtered);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            try {
                await axios.delete(`http://localhost:5000/api/expenses/${id}`);
                fetchExpenses(); // Refresh the list
            } catch (err) {
                setError('Failed to delete expense');
            }
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) return <div className="spinner"></div>;

    return (
        <div className="page-container">
            <h1 className="page-title">Expense History</h1>

            {/* Filters */}
            <div className="card mb-4">
                <div className="form-row">
                    <div className="form-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search expenses..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <select
                            className="form-control"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category === 'all' ? 'All Categories' : category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <select
                            className="form-control"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="date-desc">Newest First</option>
                            <option value="date-asc">Oldest First</option>
                            <option value="amount-desc">Amount (High to Low)</option>
                            <option value="amount-asc">Amount (Low to High)</option>
                        </select>
                    </div>
                </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            {/* Expense Table */}
            <div className="card">
                {filteredExpenses.length > 0 ? (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Amount</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExpenses.map((expense) => (
                                <tr key={expense._id}>
                                    <td>{formatDate(expense.date)}</td>
                                    <td>{expense.title}</td>
                                    <td>
                                        <span className={`category-badge category-${expense.category.toLowerCase()}`}>
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td className="amount">{formatCurrency(expense.amount)}</td>
                                    <td>{expense.description || '-'}</td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(expense._id)}
                                            className="btn btn-danger btn-sm"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="text-center p-4">
                        <p>No expenses found. {search || categoryFilter !== 'all' ? 'Try changing your filters.' : 'Add your first expense!'}</p>
                    </div>
                )}

                {/* Summary */}
                {filteredExpenses.length > 0 && (
                    <div className="mt-4 p-3 bg-light rounded">
                        <div className="flex justify-between">
                            <span>Total Expenses:</span>
                            <span className="font-bold">
                                {formatCurrency(
                                    filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)
                                )}
                            </span>
                        </div>
                        <div className="flex justify-between mt-2">
                            <span>Number of Expenses:</span>
                            <span className="font-bold">{filteredExpenses.length}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default History;