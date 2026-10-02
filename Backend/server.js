require("dotenv").config();


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const Order = require("./models/Order");
const authMiddleware = require("./middleware/authMiddleware");
const adminMiddleware = require("./middleware/adminMiddleware");

const Product = require("./models/Product");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

app.get("/", (req, res) => {
  res.send("KICKLAB Backend is running");
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch product",
    });
  }
});

// orders
app.post("/api/orders", authMiddleware, async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount } = req.body;

    // Check stock for every product
    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.name}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `${product.name} has only ${product.stock} item(s) left`,
        });
      }
    }

    // Reduce stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: {
          stock: -item.quantity,
        },
      });
    }

    // Create order
    const order = await Order.create({
      userId: req.userId,
      items,
      shippingAddress,
      totalAmount,
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.log("Order error:", error);

    res.status(500).json({
      message: "Failed to place order",
    });
  }
});

//orders
app.get("/api/orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.userId,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.log("Orders error:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
});

// signup
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Signup failed",
    });
  }
});

// login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
    });
  }
});
// admin route
app.get(
  "/api/admin/test",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    res.json({
      message: "Welcome Admin",
    });
  }
);
// admin route
app.get(
  "/api/admin/orders",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const orders = await Order.find()
        .populate("userId", "name email")
        .sort({ createdAt: -1 });

      res.json(orders);
    } catch (error) {
      console.log("Admin orders error:", error);

      res.status(500).json({
        message: "Failed to fetch orders",
      });
    }
  }
);

// DELETE ORDER (ADMIN)
app.delete(
  "/api/admin/orders/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const deletedOrder = await Order.findByIdAndDelete(req.params.id);

      if (!deletedOrder) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      res.json({
        message: "Order deleted successfully",
      });
    } catch (error) {
      console.error("Delete order error:", error);

      res.status(500).json({
        message: "Failed to delete order",
      });
    }
  }
);
// orders
app.patch(
  "/api/admin/orders/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "Pending",
        "Confirmed",
        "Shipped",
        "Delivered",
        "Cancelled",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid order status",
        });
      }

      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { returnDocument: "after" }
      );

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      res.json({
        message: "Order status updated",
        order,
      });
    } catch (error) {
      console.log("Status update error:", error);

      res.status(500).json({
        message: "Failed to update order status",
      });
    }
  }
);
//order details
app.get(
  "/api/admin/products",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });

      res.json(products);
    } catch (error) {
      console.log("Admin products error:", error);

      res.status(500).json({
        message: "Failed to fetch products",
      });
    }
  }
); 
// ADMIN edit
app.patch(
  "/api/admin/products/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { name, category, price, stock } = req.body;

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          name,
          category,
          price,
          stock,
        },
        { returnDocument: "after" }
      );

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      res.json({
        message: "Product updated successfully",
        product,
      });
    } catch (error) {
      console.log("Update product error:", error);

      res.status(500).json({
        message: "Failed to update product",
      });
    }
  }
);

// admin delete
app.delete(
  "/api/admin/products/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      res.json({
        message: "Product deleted successfully",
      });
    } catch (error) {
      console.log("Delete product error:", error);

      res.status(500).json({
        message: "Failed to delete product",
      });
    }
  }
);

// admin add products
app.post(
  "/api/admin/products",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const {
        name,
        category,
        price,
        oldPrice,
        images,
        description,
        colors,
        sizes,
        gender,
        stock,
      } = req.body;

      const product = await Product.create({
        name,
        category,
        price,
        oldPrice,
        images,
        description,
        colors,
        sizes,
        gender,
        stock,
      });

      res.status(201).json({
        message: "Product added successfully",
        product,
      });
    } catch (error) {
      console.log("Add product error:", error);

      res.status(500).json({
        message: "Failed to add product",
      });
    }
  }
);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
