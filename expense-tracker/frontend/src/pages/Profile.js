import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api'; 
import '../styles/pages.css';

const Profile = () => {
    const { user, logout } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState(null);

    useEffect(() => {
        if (user) {
            fetchUserData();
            fetchUserStats();
        }
    }, [user]);

    const fetchUserData = async () => {
        try {
            const response = await api.get('/api/auth/profile');
            setUserData(response.data);
        } catch (err) {
            setError('Failed to fetch profile data');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserStats = async () => {
        try {
            const response = await api.get('/api/expenses/dashboard/stats');
            setStats(response.data);
        } catch (err) {
            console.error('Failed to fetch user stats');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) return <div className="spinner"></div>;
    if (error) return <div className="alert alert-error">{error}</div>;

    return (
        <div className="page-container">
            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-avatar">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <h1 className="page-title">{user?.name}</h1>
                    <p className="text-muted">{user?.email}</p>
                </div>

                <div className="profile-info card">
                    <div className="info-item">
                        <span className="info-label">Member Since:</span>
                        <span className="info-value">
                            {formatDate(userData?.createdAt)}
                        </span>
                    </div>
                    
                    <div className="info-item">
                        <span className="info-label">Total Expenses:</span>
                        <span className="info-value">
                            {stats?.totalCount || 0} transactions
                        </span>
                    </div>
                    
                    <div className="info-item">
                        <span className="info-label">Total Spent:</span>
                        <span className="info-value">
                            {new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR'
                            }).format(stats?.totalExpenses || 0)}
                        </span>
                    </div>
                    
                    <div className="info-item">
                        <span className="info-label">Categories Used:</span>
                        <span className="info-value">
                            {Object.keys(stats?.categoryTotals || {}).length}
                        </span>
                    </div>
                </div>

                <div className="mt-4 flex justify-center">
                    <button onClick={logout} className="btn btn-danger">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;