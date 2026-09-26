import mongoose from 'mongoose';

export const connectToDatabase = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.log('No MONGO_URI configured. Running with in-memory demo data.');
    return false;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully.');
    return true;
  } catch (error) {
    console.warn('MongoDB connection failed. Falling back to demo in-memory data.', error.message);
    return false;
  }
};
