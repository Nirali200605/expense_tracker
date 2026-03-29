import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setMobileMenuOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand" onClick={() => setMobileMenuOpen(false)}>
                    Expense Tracker
                </Link>

                <button 
                    className="mobile-menu-btn"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    ☰
                </button>

                <ul className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
                    {user ? (
                        <>
                            <li className="navbar-item">
                                <Link 
                                    to="/" 
                                    className={`navbar-link ${isActive('/') ? 'active' : ''}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Home
                                </Link>
                            </li>
                            <li className="navbar-item">
                                <Link 
                                    to="/add-expense" 
                                    className={`navbar-link ${isActive('/add-expense') ? 'active' : ''}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Add Expense
                                </Link>
                            </li>
                            <li className="navbar-item">
                                <Link 
                                    to="/history" 
                                    className={`navbar-link ${isActive('/history') ? 'active' : ''}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    History
                                </Link>
                            </li>
                            <li className="navbar-item">
                                <Link 
                                    to="/dashboard" 
                                    className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                            </li>
                            <li className="navbar-item">
                                <Link 
                                    to="/profile" 
                                    className={`navbar-link ${isActive('/profile') ? 'active' : ''}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                            </li>
                            <li className="navbar-item">
                                <div className="user-info">
                                    <div className="user-avatar">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <button onClick={handleLogout} className="btn btn-danger">
                                        Logout
                                    </button>
                                </div>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="navbar-item">
                                <Link 
                                    to="/login" 
                                    className={`navbar-link ${isActive('/login') ? 'active' : ''}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                            </li>
                            <li className="navbar-item">
                                <Link 
                                    to="/register" 
                                    className={`navbar-link ${isActive('/register') ? 'active' : ''}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Register
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;