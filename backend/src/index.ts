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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
