import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./FreshDrops.css";

function FreshDrops() {
  const [products, setProducts] = useState([]);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    const distance = touchStart - touchEnd;

    if (distance > 50) {
      nextSlide();
    }

    if (distance < -50) {
      prevSlide();
    }
  };

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

  const [position, setPosition] = useState(0);

  const nextSlide = () => {
    if (position < products.length - 4) {
      setPosition(position + 1);
    }
  };

  const prevSlide = () => {
    if (position > 0) {
      setPosition(position - 1);
    }
  };

  return (
    <section className="fresh-drops">
      <h2>Fresh Drops</h2>

      <div className="products-wrapper">
        <button
          className="slider-btn left"
          onClick={prevSlide}
          disabled={position === 0}
        >
          ‹
        </button>

        <div
          className="products-window"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="products-track"
            style={{
              transform: `translateX(-${position * 25}%)`,
            }}
          >
            {products.map((product, index) => (
              <Link
                to={`/product/${product._id}`}
                className="product-card"
                key={product._id}
              >
                <div className="product-image">
                  <img src={product.images[0]} alt={product.name} />
                </div>

                <div className="product-info">
                  <h3>{product.name}</h3>

                  <p className="category">{product.category}</p>

                  <div className="price">
                    <span>₹{product.price.toLocaleString("en-IN")}</span>

                    {product.oldPrice && (
                      <span className="old-price">
                        ₹{product.oldPrice.toLocaleString("en-IN")}
                      </span>
                    )}

                    {product.oldPrice && <span className="discount">20%</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <button
          className="slider-btn right"
          onClick={nextSlide}
          disabled={position === products.length - 3}
        >
          ›
        </button>
      </div>
    </section>
  );
}

export default FreshDrops;
