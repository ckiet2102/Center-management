const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/students', require('./routes/students'));
app.use('/api/teachers', require('./routes/teachers'));
app.use('/api/classes', require('./routes/classes'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/promotions', require('./routes/promotions'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/activity-logs', require('./routes/activityLogs'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api', require('./routes/misc'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'EngBreak API is running' });
});

// Database connection & server start
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected successfully');

        // Auto-create new auth tables if they don't exist (safe - won't alter existing tables)
        const { ActivationKey, PasswordReset } = require('./models');
        await ActivationKey.sync({ force: false });
        await PasswordReset.sync({ force: false });
        console.log('✅ Auth tables synced');

        const server = app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
            console.log(`📋 API endpoints available at http://localhost:${PORT}/api`);
        });

        server.on('error', (err) => {
            console.error('❌ Server startup error:', err);
            // Don't exit process if we just want to see the error for a sec
            // process.exit(1);
        });
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error.message);
        process.exit(1);
    }
};

startServer();
