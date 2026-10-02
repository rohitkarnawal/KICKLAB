const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  oldPrice: {
    type: Number,
  },

  images: {
    type: [String],
    required: true,
  },

  description: {
    type: String,
  },

  colors: {
    type: [String],
  },

  sizes: {
    type: [String],
  },

  gender: {
    type: String,
  },

  stock: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Product", productSchema);