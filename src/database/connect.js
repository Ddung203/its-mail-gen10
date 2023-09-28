import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect("mongodb://127.0.0.1:27017/ctvgen10", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Connected to Mongodb successfuly!`);
  } catch (err) {
    console.error(
      `Error when connecting to DB connect.js (13): ${err.message}`
    );
  }
};

export default connectDB;
