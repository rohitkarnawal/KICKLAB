const mongoose = require("mongoose");
const User = require("./models/User");

mongoose
  .connect("mongodb://127.0.0.1:27017/kicklab")
  .then(async () => {
    console.log("MongoDB connected");

    const email = "rohitrai3315@gmail.com";

    const user = await User.findOneAndUpdate(
      { email },
      { role: "admin" },
      { new: true }
    );

    if (!user) {
      console.log("User not found");
    } else {
      console.log(`${user.email} is now an admin`);
    }

    mongoose.connection.close();
  })
  .catch((error) => {
    console.log("Error:", error);
  });