import AnnouncementBar from "../../AnnouncementBar";
import Navbar from "../../Navbar";
import { useState } from "react";
import "./Cart.css";

function Cart() {
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });

  const bagTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  return (
    <>
      <Navbar />
      <AnnouncementBar />

      <div className="cart-page">
        <div className="cart-left">
          <h1>Bag</h1>

          {cart.length === 0 ? (
            <div className="empty-cart">
              <h2>Your bag is empty.</h2>
              <p>When you add products, they'll appear here.</p>

              <button onClick={() => (window.location.href = "/")}>
                Shop Now
              </button>
            </div>
          ) : (
            <div className="cart-items">
              {cart.map((item) => (
                <div
                  className="cart-item"
                  key={`${item.productId}-${item.size}`}
                >
                  <img src={item.image} alt={item.name} />

                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p>{item.category || "Men's Shoes"}</p>
                    <p>Size: {item.size}</p>
                    <div className="cart-controls">
                      <button
                        onClick={() => {
                          const updatedCart = cart
                            .map((cartItem) => {
                              if (
                                cartItem.productId === item.productId &&
                                cartItem.size === item.size
                              ) {
                                return {
                                  ...cartItem,
                                  quantity: cartItem.quantity - 1,
                                };
                              }

                              return cartItem;
                            })
                            .filter((cartItem) => cartItem.quantity > 0);

                          setCart(updatedCart);
                          localStorage.setItem(
                            "cart",
                            JSON.stringify(updatedCart),
                          );
                        }}
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() => {
                          const updatedCart = cart.map((cartItem) => {
                            if (
                              cartItem.productId === item.productId &&
                              cartItem.size === item.size
                            ) {
                              return {
                                ...cartItem,
                                quantity: cartItem.quantity + 1,
                              };
                            }

                            return cartItem;
                          });

                          setCart(updatedCart);
                          localStorage.setItem(
                            "cart",
                            JSON.stringify(updatedCart),
                          );
                          window.dispatchEvent(new Event("cartUpdated"));
                        }}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="remove-button"
                      onClick={() => {
                        const updatedCart = cart.filter(
                          (cartItem) =>
                            !(
                              cartItem.productId === item.productId &&
                              cartItem.size === item.size
                            ),
                        );

                        setCart(updatedCart);
                        localStorage.setItem(
                          "cart",
                          JSON.stringify(updatedCart),
                        );
                        window.dispatchEvent(new Event("cartUpdated"));
                        window.dispatchEvent(new Event("cartUpdated"));
                      }}
                    >
                      🗑
                    </button>

                    <button
                      className="wishlist-button m-2"
                      onClick={() => {
                        const wishlist =
                          JSON.parse(localStorage.getItem("wishlist")) || [];

                        const alreadyAdded = wishlist.some(
                          (wishlistItem) =>
                            wishlistItem.productId === item.productId,
                        );

                        if (!alreadyAdded) {
                          wishlist.push(item);
                          localStorage.setItem(
                            "wishlist",
                            JSON.stringify(wishlist),
                          );
                          window.dispatchEvent(new Event("cartUpdated"));
                          alert("Added to wishlist");
                        } else {
                          alert("Already in wishlist");
                        }
                      }}
                    >
                      ♡
                    </button>
                  </div>

                  <span className="cart-item-price">
                    ₹{item.price.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="cart-summary">
          <h2>Summary</h2>

          <div className="summary-row">
            <span>Bag Total</span>
            <span>₹{bagTotal.toLocaleString("en-IN")}</span>
          </div>

          <div className="summary-row">
            <span>Sub Total</span>
            <span>₹{bagTotal.toLocaleString("en-IN")}</span>
          </div>

          <div className="summary-row">
            <span>Shipping Charges</span>
            <span className="free">Free</span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-row total">
            <span>You Pay</span>
            <span>₹{bagTotal.toLocaleString("en-IN")}</span>
          </div>

          <button
            className="checkout-button"
            onClick={() => (window.location.href = "/checkout")}
          >
            Proceed to Buy
          </button>
        </div>
      </div>
    </>
  );
}

export default Cart;
