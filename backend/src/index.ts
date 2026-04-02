import app from './app';
import connectDB from './config/db';
import { initCronJobs } from './services/cron.service';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const PORT = process.env.PORT || 3001;

// Connect to Database
connectDB();

// Initialize Cron Jobs
initCronJobs();

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Process Level Safety Handlers
process.on('unhandledRejection', (err: any) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err);
    server.close(() => {
        process.exit(1);
    });
});

process.on('uncaughtException', (err: any) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err);
    process.exit(1);
});
