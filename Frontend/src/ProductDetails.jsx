import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./ProductDetails.css";
import axios from "axios";
import Navbar from "./Navbar";
import AnnouncementBar from "./AnnouncementBar";
import Footer from "./Footer";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedStart, setRelatedStart] = useState(0);
  const [relatedVisible, setRelatedVisible] = useState(
    window.innerWidth <= 700 ? 2 : 3
  );
  const [selectedSize, setSelectedSize] = useState(null);

  const [isFavourite, setIsFavourite] = useState(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    return wishlist.some((item) => item.productId === id);
  });

  /* =========================
     FETCH PRODUCT
  ========================= */

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/products/${id}`)
      .then((response) => {
        setProduct(response.data);
        setSelectedImage(0);
      })
      .catch((error) => {
        console.log("Error fetching product:", error);
      });
  }, [id]);

  /* =========================
     FETCH RELATED PRODUCTS
  ========================= */

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/products`)
      .then((response) => {
        const filteredProducts = response.data.filter(
          (item) => item._id !== id
        );

        setRelatedProducts(filteredProducts);
        setRelatedStart(0);
      })
      .catch((error) => {
        console.log("Error fetching related products:", error);
      });
  }, [id]);

  /* =========================
     RESPONSIVE
  ========================= */

  useEffect(() => {
    const handleResize = () => {
      setRelatedVisible(window.innerWidth <= 700 ? 2 : 3);
      setRelatedStart(0);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!product) {
    return <p>Loading...</p>;
  }

  const maxRelatedStart = Math.max(
    relatedProducts.length - relatedVisible,
    0
  );

  const moveRelatedProducts = (direction) => {
    setRelatedStart((prev) => {
      if (direction === "next") {
        return Math.min(prev + 1, maxRelatedStart);
      }

      return Math.max(prev - 1, 0);
    });
  };

  return (
    <>
      <Navbar />

      <AnnouncementBar />

      {/* =========================
          PRODUCT DETAILS
      ========================= */}

      <div className="product-details">
        <div className="product-gallery">
          <div className="thumbnail-list">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`thumbnail ${
                  selectedImage === index ? "active" : ""
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                />
              </button>
            ))}
          </div>

          <div className="main-image">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
            />

            <button
              className="gallery-arrow prev"
              onClick={() =>
                setSelectedImage(
                  selectedImage === 0
                    ? product.images.length - 1
                    : selectedImage - 1
                )
              }
            >
              ‹
            </button>

            <button
              className="gallery-arrow next"
              onClick={() =>
                setSelectedImage(
                  selectedImage === product.images.length - 1
                    ? 0
                    : selectedImage + 1
                )
              }
            >
              ›
            </button>
          </div>
        </div>

        {/* =========================
            PRODUCT INFO
        ========================= */}

        <div className="product-info">
          <p className="product-status">Just In</p>

          <h1>{product.name}</h1>

          <p className="product-category">
            {product.category}
          </p>

          <p className="product-price">
            ₹{product.price.toLocaleString("en-IN")}
          </p>

          <p className="tax-info">
            Inclusive of all taxes
          </p>

          <div className="stock-info">
            {product.stock > 0 ? (
              <span>{product.stock} left in stock</span>
            ) : (
              <span>Out of stock</span>
            )}
          </div>

          {/* =========================
              SIZE
          ========================= */}

          <div className="size-section">
            <div className="size-header">
              <h3>Select Size</h3>
              <span>Size Guide</span>
            </div>

            <div className="size-grid">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`size-button ${
                    selectedSize === size ? "selected" : ""
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* =========================
              ACTIONS
          ========================= */}

          <div className="product-actions">
            <button
              className="add-to-bag"
              disabled={product.stock === 0}
              onClick={() => {
                if (!selectedSize) {
                  alert("Please select a size");
                  return;
                }

                const existingCart =
                  JSON.parse(localStorage.getItem("cart")) || [];

                const cartItem = {
                  productId: product._id,
                  name: product.name,
                  image: product.images[0],
                  price: product.price,
                  size: selectedSize,
                  quantity: 1,
                };

                const updatedCart = [
                  ...existingCart,
                  cartItem,
                ];

                localStorage.setItem(
                  "cart",
                  JSON.stringify(updatedCart)
                );

                window.dispatchEvent(
                  new Event("cartUpdated")
                );

                alert("Added to bag");
              }}
            >
              {product.stock === 0
                ? "Out of Stock"
                : "Add to Bag"}
            </button>

            <button
              className="favourite-button"
              onClick={() => {
                const wishlist =
                  JSON.parse(
                    localStorage.getItem("wishlist")
                  ) || [];

                if (isFavourite) {
                  const updatedWishlist = wishlist.filter(
                    (item) =>
                      item.productId !== product._id
                  );

                  localStorage.setItem(
                    "wishlist",
                    JSON.stringify(updatedWishlist)
                  );

                  setIsFavourite(false);
                } else {
                  const wishlistItem = {
                    productId: product._id,
                    name: product.name,
                    image: product.images[0],
                    price: product.price,
                    category: product.category,
                    size: selectedSize,
                    quantity: 1,
                  };

                  const updatedWishlist = [
                    ...wishlist,
                    wishlistItem,
                  ];

                  localStorage.setItem(
                    "wishlist",
                    JSON.stringify(updatedWishlist)
                  );

                  setIsFavourite(true);
                }
              }}
            >
              Favourite {isFavourite ? "♥" : "♡"}
            </button>
          </div>

          {/* =========================
              DESCRIPTION
          ========================= */}

          <div className="product-description">
            <p>{product.description}</p>

            <div className="delivery-info">
              <h3>Delivery & Returns</h3>

              <p>
                Free delivery on orders over ₹5,000.
              </p>

              <p>
                Easy returns within 30 days.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          MORE PRODUCTS
      ========================= */}

      <div className="more-products">
        <div className="more-products-header">
          <h2>More From Men Lifestyle</h2>

          <div className="more-products-arrows">
            <button
              onClick={() => moveRelatedProducts("prev")}
              disabled={relatedStart === 0}
              aria-label="Previous products"
            >
              ‹
            </button>

            <button
              onClick={() => moveRelatedProducts("next")}
              disabled={relatedStart >= maxRelatedStart}
              aria-label="Next products"
            >
              ›
            </button>
          </div>
        </div>

        <div className="more-products-slider">
          <div
            className="more-products-track"
            style={{
              transform:
                window.innerWidth > 700
                  ? `translateX(-${
                      relatedStart *
                      (100 / relatedVisible)
                    }%)`
                  : "none",
            }}
          >
            {relatedProducts.map((item) => (
              <Link
                to={`/product/${item._id}`}
                className="more-product-card"
                key={item._id}
              >
                <div className="more-product-image">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                  />
                </div>

                <h3>{item.name}</h3>

                <p>{item.category}</p>

                <span>
                  ₹{item.price.toLocaleString("en-IN")}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <hr />

      <Footer />
    </>
  );
}

export default ProductDetails;