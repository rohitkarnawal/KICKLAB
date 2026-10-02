import { useState } from "react";
import AnnouncementBar from "../../AnnouncementBar";
import Navbar from "../../Navbar";
import "./Wishlist.css";

function Wishlist() {
  const [wishlist, setWishlist] = useState(() => {
    return JSON.parse(localStorage.getItem("wishlist")) || [];
  });

  return (
    <>
      <Navbar />
      <AnnouncementBar />

      <div className="wishlist-page">
        <h1>Wishlist</h1>

        {wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <h2>Your wishlist is empty.</h2>
            <p>Save your favourite products here.</p>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((item) => (
              <div className="wishlist-card" key={item.productId}>
                <img src={item.image} alt={item.name} />

                <h3>{item.name}</h3>
                <p>{item.category || "Men's Shoes"}</p>

                <span>
                  ₹{item.price.toLocaleString("en-IN")}
                </span>

                <button
                  className="wishlist-add"
                  onClick={() => {
                    const cart =
                      JSON.parse(localStorage.getItem("cart")) || [];

                    const existingItem = cart.find(
                      (cartItem) =>
                        cartItem.productId === item.productId &&
                        cartItem.size === item.size
                    );

                    let updatedCart;

                    if (existingItem) {
                      updatedCart = cart.map((cartItem) =>
                        cartItem.productId === item.productId &&
                        cartItem.size === item.size
                          ? {
                              ...cartItem,
                              quantity: cartItem.quantity + 1,
                            }
                          : cartItem
                      );
                    } else {
                      updatedCart = [...cart, item];
                    }

                    localStorage.setItem(
                      "cart",
                      JSON.stringify(updatedCart)
                    );

                    window.dispatchEvent(new Event("cartUpdated"));

                    alert("Added to bag");
                  }}
                >
                  Add to Bag
                </button>

                <button
                  className="wishlist-remove"
                  onClick={() => {
                    const updatedWishlist = wishlist.filter(
                      (wishlistItem) =>
                        wishlistItem.productId !== item.productId
                    );

                    setWishlist(updatedWishlist);

                    localStorage.setItem(
                      "wishlist",
                      JSON.stringify(updatedWishlist)
                    );
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Wishlist;