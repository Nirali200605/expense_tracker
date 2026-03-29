const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Fix CORS - Allow all origins for development
app.use(cors({
    origin: '*', // Allow all origins for now
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/expenses', require('./routes/expenses'));

// Test route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Expense Tracker API is running',
        endpoints: {
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login',
                profile: 'GET /api/auth/profile'
            },
            expenses: {
                create: 'POST /api/expenses',
                list: 'GET /api/expenses',
                dashboard: 'GET /api/expenses/dashboard/stats'
            }
        }
    });
});

// Handle preflight requests
app.options('*', cors());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📝 Frontend should connect to: http://localhost:${PORT}/api`);
});