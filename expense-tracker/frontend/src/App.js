import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Import Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AddExpense from './pages/AddExpense';
import History from './pages/History';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

// Import CSS
import './index.css';
import './styles/global.css';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="app">
                    <Navbar />
                    <main>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            {/* Protected Routes */}
                            <Route path="/" element={
                                <ProtectedRoute>
                                    <Home />
                                </ProtectedRoute>
                            } />
                            <Route path="/add-expense" element={
                                <ProtectedRoute>
                                    <AddExpense />
                                </ProtectedRoute>
                            } />
                            <Route path="/history" element={
                                <ProtectedRoute>
                                    <History />
                                </ProtectedRoute>
                            } />
                            <Route path="/dashboard" element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            } />
                            <Route path="/profile" element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            } />

                            {/* Redirect unknown routes */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </main>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;