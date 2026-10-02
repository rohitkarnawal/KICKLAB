import { useEffect, useState } from "react";
import axios from "axios";
import "./Orders.css";
import Navbar from "../Navbar";
import AnnouncementBar from "../AnnouncementBar";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.log("Error fetching orders:", error);
      });
  }, []);

  return (
    <>
      <Navbar />
      <AnnouncementBar />

      <div className="orders-page">
        <h1>My Orders</h1>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <h2>No orders yet.</h2>
            <p>Your placed orders will appear here.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order._id}>
                <div className="order-header">
                  <div>
                    <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                    <p>
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  <span className="order-status">{order.status}</span>
                </div>

                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div
                      className="order-item"
                      key={`${item.productId}-${item.size}-${index}`}
                    >
                      <img src={item.image} alt={item.name} />

                      <div>
                        <h4>{item.name}</h4>
                        <p>Size: {item.size}</p>
                        <p>Quantity: {item.quantity}</p>
                      </div>

                      <span>
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <span>Total</span>
                  <strong>₹{order.totalAmount.toLocaleString("en-IN")}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Orders;
