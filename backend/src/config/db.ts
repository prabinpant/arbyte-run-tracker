import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/arbyte-run');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err: any) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
