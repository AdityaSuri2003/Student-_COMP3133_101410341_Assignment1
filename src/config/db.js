const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("🔹 Connecting to MongoDB...");
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(` MongoDB Connected: ${conn.connection.host}`);
    console.log(` Using Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(" MongoDB Connection Error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
