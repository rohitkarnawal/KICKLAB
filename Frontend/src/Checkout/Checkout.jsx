import { useEffect, useState } from "react";
import "./Checkout.css";
import Navbar from "../Navbar";
import AnnouncementBar from "../AnnouncementBar";
import axios from "axios";

function Checkout() {
  const [cart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.dispatchEvent(new Event("openLoginModal"));
    }
  }, []);

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    // User login nahi hai
    if (!token) {
      window.dispatchEvent(new Event("openLoginModal"));
      return;
    }

    try {
      const orderData = {
        items: cart,
        shippingAddress: address,
        totalAmount: total,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Order:", response.data);

      alert("Order placed successfully!");

      localStorage.removeItem("cart");

      window.location.href = "/products";
    } catch (error) {
      console.log("Order error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.dispatchEvent(new Event("openLoginModal"));
        return;
      }

      alert(
        error.response?.data?.message || "Failed to place order"
      );
    }
  };

  return (
    <>
      <Navbar />
      <AnnouncementBar />

      <div className="checkout-page">
        <div className="checkout-left">
          <h1>Checkout</h1>

          <form onSubmit={handleSubmit}>
            <h2>Delivery Information</h2>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={address.name}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={address.phone}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={address.address}
              onChange={handleChange}
              required
            />

            <div className="checkout-row">
              <input
                type="text"
                name="city"
                placeholder="City"
                value={address.city}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="state"
                placeholder="State"
                value={address.state}
                onChange={handleChange}
                required
              />
            </div>

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              value={address.pincode}
              onChange={handleChange}
              required
            />

            <button type="submit">Place Order</button>
          </form>
        </div>

        <div className="checkout-summary">
          <h2>Order Summary</h2>

          {cart.map((item) => (
            <div
              className="checkout-item"
              key={`${item.productId}-${item.size}`}
            >
              <img src={item.image} alt={item.name} />

              <div>
                <h3>{item.name}</h3>
                <p>Size: {item.size}</p>
                <p>Quantity: {item.quantity}</p>
              </div>

              <span>
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </span>
            </div>
          ))}

          <div className="checkout-divider"></div>

          <div className="checkout-total">
            <span>Total</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Checkout;