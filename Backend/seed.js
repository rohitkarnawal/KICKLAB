const mongoose = require("mongoose");
const Product = require("./models/Product");
const products = require("./data/products");

mongoose
  .connect("mongodb://127.0.0.1:27017/kicklab")
  .then(async () => {
    console.log("MongoDB connected");

    await Product.deleteMany({});
    await Product.insertMany(products);

    console.log("Products added successfully");

    mongoose.connection.close();
  })
  .catch((err) => {
    console.log("Error:", err);
  });