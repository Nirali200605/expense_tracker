import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; 
import '../styles/pages.css';

const AddExpense = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        description: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const categories = [
        'Food', 'Transport', 'Shopping', 'Entertainment',
        'Bills', 'Healthcare', 'Education', 'Other'
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const expenseData = {
                ...formData,
                amount: parseFloat(formData.amount)
            };

            await axios.post('http://localhost:5000/api/expenses', expenseData);
            
            setSuccess('Expense added successfully!');
            
            // Reset form
            setFormData({
                title: '',
                amount: '',
                category: 'Food',
                date: new Date().toISOString().split('T')[0],
                description: ''
            });

            // Redirect after 2 seconds
            setTimeout(() => navigate('/history'), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add expense');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <h1 className="page-title">Add New Expense</h1>

            <div className="expense-form card">
                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Expense Title*</label>
                            <input
                                type="text"
                                name="title"
                                className="form-control"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="e.g., Grocery shopping, Movie tickets"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Amount*</label>
                            <input
                                type="number"
                                name="amount"
                                className="form-control"
                                value={formData.amount}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Category*</label>
                            <select
                                name="category"
                                className="form-control"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Date*</label>
                            <input
                                type="date"
                                name="date"
                                className="form-control"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            name="description"
                            className="form-control"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Add any additional details about this expense..."
                        ></textarea>
                    </div>

                    <div className="flex justify-between mt-4">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/')}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Adding Expense...' : 'Add Expense'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExpense;