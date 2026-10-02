import { useEffect, useState } from "react";
import axios from "axios";
import "./Admin.css";
import Navbar from "../Navbar";
import AnnouncementBar from "../AnnouncementBar";

function Admin() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [openStatusId, setOpenStatusId] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "Men's Shoes",
    price: "",
    oldPrice: "",
    images: [],
    description: "",
    colors: [""],
    sizes: ["7", "8", "9", "10"],
    gender: "Men",
    stock: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setOrders(response.data))
      .catch((error) => console.log("Admin orders error:", error));

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setProducts(response.data))
      .catch((error) => console.log("Admin products error:", error));
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      setIsAuthorized(false);
      return;
    }

    const user = JSON.parse(savedUser);

    if (user.role !== "admin") {
      setIsAuthorized(false);
      return;
    }

    setIsAuthorized(true);
  }, []);

  if (isAuthorized === null) {
    return <div>Checking access...</div>;
  }

  if (!isAuthorized) {
    window.location.href = "/";
    return null;
  }

  const handleAddProduct = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!newProduct.images.length) {
        alert("Please select at least one product image");
        return;
      }

      const formData = new FormData();

      formData.append("name", newProduct.name);
      formData.append("category", newProduct.category);
      formData.append("price", Number(newProduct.price));
      formData.append("oldPrice", Number(newProduct.oldPrice));
      formData.append("description", newProduct.description);
      formData.append("gender", newProduct.gender);
      formData.append("stock", Number(newProduct.stock));

      formData.append("colors", JSON.stringify(newProduct.colors));
      formData.append("sizes", JSON.stringify(newProduct.sizes));

      newProduct.images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/products`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts((prevProducts) => [
        ...prevProducts,
        response.data.product,
      ]);

      setShowAddProduct(false);

      setNewProduct({
        name: "",
        category: "Men's Shoes",
        price: "",
        oldPrice: "",
        images: [],
        description: "",
        colors: [""],
        sizes: ["7", "8", "9", "10"],
        gender: "Men",
        stock: "",
      });

      alert("Product added successfully!");
    } catch (error) {
      console.log("Add product error:", error);
      alert(
        error.response?.data?.message || "Failed to add product"
      );
    }
  };

  const handleUpdateProduct = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/admin/products/${editingProduct._id}`,
        {
          name: editingProduct.name,
          category: editingProduct.category,
          price: editingProduct.price,
          stock: editingProduct.stock,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === editingProduct._id
            ? response.data.product
            : product
        )
      );

      setEditingProduct(null);
    } catch (error) {
      console.log("Update product error:", error);
      alert("Failed to update product");
    }
  };

  const handleDeleteProduct = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${product.name}?`
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/products/${product._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProducts((prevProducts) =>
        prevProducts.filter((item) => item._id !== product._id)
      );
    } catch (error) {
      console.log("Delete product error:", error);
      alert("Failed to delete product");
    }
  };

  const handleOrderStatusChange = async (order, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/admin/orders/${order._id}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((prevOrders) =>
        prevOrders.map((item) =>
          item._id === order._id
            ? response.data.order
            : item
        )
      );
    } catch (error) {
      console.log("Status update error:", error);
      alert("Failed to update order status");
    }
  };

  const handleDeleteOrder = async (order) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/orders/${order._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((prevOrders) =>
        prevOrders.filter((item) => item._id !== order._id)
      );

      setOpenStatusId(null);

      alert("Order deleted successfully");
    } catch (error) {
      console.error("Delete order error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete order"
      );
    }
  };

  return (
    <>
      <Navbar />
      <AnnouncementBar />

      <div className="admin-page">
        <h1>Admin Dashboard</h1>

        <div className="admin-stats">
          <div className="admin-stat">
            <span>Total Orders</span>
            <strong>{orders.length}</strong>
          </div>

          <div className="admin-stat">
            <span>Pending Orders</span>
            <strong>
              {
                orders.filter(
                  (order) => order.status === "Pending"
                ).length
              }
            </strong>
          </div>

          <div className="admin-stat">
            <span>Delivered Orders</span>
            <strong>
              {
                orders.filter(
                  (order) => order.status === "Delivered"
                ).length
              }
            </strong>
          </div>
        </div>

        <div className="admin-orders">
          <h2>Recent Orders</h2>

          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            orders.map((order) => (
              <div className="admin-order" key={order._id}>
                <div>
                  <h3>
                    Order #
                    {order._id.slice(-6).toUpperCase()}
                  </h3>

                  <p>
                    Customer:{" "}
                    {order.userId?.name || "Unknown"}
                  </p>

                  <p>
                    Email:{" "}
                    {order.userId?.email || "Unknown"}
                  </p>
                </div>

                <div>
                  <p>Items: {order.items.length}</p>

                  <p>
                    Total: ₹
                    {order.totalAmount.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                  <div className="status-dropdown">
                    <button
                      type="button"
                      className="status-dropdown-btn"
                      onClick={() =>
                        setOpenStatusId(
                          openStatusId === order._id
                            ? null
                            : order._id
                        )
                      }
                    >
                      <span>{order.status}</span>

                      <span className="status-arrow">
                        ⌄
                      </span>
                    </button>

                    {openStatusId === order._id && (
                      <div className="status-dropdown-menu">
                        {[
                          "Pending",
                          "Confirmed",
                          "Shipped",
                          "Delivered",
                          "Cancelled",
                        ].map((status) => (
                          <button
                            type="button"
                            key={status}
                            className={`status-option ${
                              order.status === status
                                ? "active"
                                : ""
                            }`}
                            onClick={() => {
                              handleOrderStatusChange(
                                order,
                                status
                              );
                              setOpenStatusId(null);
                            }}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="delete-order-btn"
                    onClick={() =>
                      handleDeleteOrder(order)
                    }
                  >
                    Delete Order
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="admin-products">
          <div className="products-heading">
            <h2>Products</h2>

            <button
              className="add-product-button"
              onClick={() => setShowAddProduct(true)}
            >
              + Add Product
            </button>
          </div>

          {products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div className="admin-products-grid">
              {products.map((product) => (
                <div
                  className="admin-product"
                  key={product._id}
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                  />

                  <div className="admin-product-info">
                    <h3>{product.name}</h3>
                    <p>{product.category}</p>

                    <p>
                      ₹
                      {product.price.toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    <p>Stock: {product.stock}</p>
                  </div>

                  <button
                    className="edit-product-button"
                    onClick={() =>
                      setEditingProduct(product)
                    }
                  >
                    Edit Product
                  </button>

                  <button
                    className="delete-product-button"
                    onClick={() =>
                      handleDeleteProduct(product)
                    }
                  >
                    Delete Product
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddProduct && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>Add Product</h2>

              <button
                className="admin-modal-close"
                onClick={() =>
                  setShowAddProduct(false)
                }
              >
                ×
              </button>
            </div>

            <div className="admin-modal-body">
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    name: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Category"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    category: e.target.value,
                  })
                }
              />

              <input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    price: e.target.value,
                  })
                }
              />

              <input
                type="number"
                placeholder="Old Price"
                value={newProduct.oldPrice}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    oldPrice: e.target.value,
                  })
                }
              />

              <div className="product-image-upload">
                <label htmlFor="product-images">
                  Product Images
                </label>

                <input
                  id="product-images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      images: Array.from(e.target.files),
                    })
                  }
                />

                {newProduct.images.length > 0 && (
                  <p>
                    {newProduct.images.length} image
                    {newProduct.images.length > 1
                      ? "s"
                      : ""}{" "}
                    selected
                  </p>
                )}
              </div>

              <input
                type="text"
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    description: e.target.value,
                  })
                }
              />

              <input
                type="text"
                placeholder="Color"
                value={newProduct.colors[0]}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    colors: [e.target.value],
                  })
                }
              />

              <input
                type="number"
                placeholder="Stock"
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    stock: e.target.value,
                  })
                }
              />

              <div className="edit-product-actions">
                <button onClick={handleAddProduct}>
                  Add Product
                </button>

                <button
                  onClick={() =>
                    setShowAddProduct(false)
                  }
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingProduct && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2>Edit Product</h2>

              <button
                className="admin-modal-close"
                onClick={() =>
                  setEditingProduct(null)
                }
              >
                ×
              </button>
            </div>

            <div className="admin-modal-body">
              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    name: e.target.value,
                  })
                }
                placeholder="Product Name"
              />

              <input
                type="text"
                value={editingProduct.category}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    category: e.target.value,
                  })
                }
                placeholder="Category"
              />

              <input
                type="number"
                value={editingProduct.price}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    price: Number(e.target.value),
                  })
                }
                placeholder="Price"
              />

              <input
                type="number"
                value={editingProduct.stock}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    stock: Number(e.target.value),
                  })
                }
                placeholder="Stock"
              />

              <div className="edit-product-actions">
                <button onClick={handleUpdateProduct}>
                  Save Changes
                </button>

                <button
                  onClick={() =>
                    setEditingProduct(null)
                  }
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Admin;