const mongoose = require('mongoose');

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.error('MongoDB Connection Error: MONGO_URI is not set.');
        console.warn('Starting server without a database connection.');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error('MongoDB Connection Error:', error.message || error);
        console.warn('Starting server without a database connection.');
    }
};

module.exports = connectDB;

