import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to DB`);
  } catch (error) {
    console.log(`Error while connecting to DB`);
    process.exit(1);
  }
};
