import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./FreshDrops.css";

function FreshDrops() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/products`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.log("Error fetching products:", error);
      });
  }, []);

  const scrollProducts = (direction) => {
    const container = document.querySelector(".products-window");

    if (container) {
      container.scrollBy({
        left: direction === "next" ? 320 : -320,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="fresh-drops">
      <h2>Fresh Drops</h2>

      <div className="products-wrapper">
        <button
          className="slider-btn left"
          onClick={() => scrollProducts("prev")}
          aria-label="Previous products"
        >
          ‹
        </button>

        <div className="products-window">
          <div className="products-track">
            {products.map((product) => (
              <Link
                to={`/product/${product._id}`}
                className="product-card"
                key={product._id}
              >
                <div className="product-image">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    loading="lazy"
                  />
                </div>

                <div className="product-info">
                  <h3>{product.name}</h3>

                  <p className="category">{product.category}</p>

                  <div className="price">
                    <span>
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>

                    {product.oldPrice && (
                      <span className="old-price">
                        ₹{product.oldPrice.toLocaleString("en-IN")}
                      </span>
                    )}

                    {product.oldPrice && (
                      <span className="discount">20%</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <button
          className="slider-btn right"
          onClick={() => scrollProducts("next")}
          aria-label="Next products"
        >
          ›
        </button>
      </div>
    </section>
  );
}

export default FreshDrops;