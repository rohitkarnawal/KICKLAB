import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Navbar";
import AnnouncementBar from "../../AnnouncementBar";
import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("default");

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

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory = category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "low") {
      return a.price - b.price;
    }

    if (sort === "high") {
      return b.price - a.price;
    }

    return 0;
  });
  return (
    <>
      <Navbar />
      <AnnouncementBar />

      <div className="products-page">
        <h1>All Shoes</h1>

        <div className="product-filters">
          <input
            type="text"
            placeholder="Search shoes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Men's Shoes">Men's Shoes</option>
            <option value="Women's Shoes">Women's Shoes</option>
            <option value="Kids' Shoes">Kids' Shoes</option>
          </select>

          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="default">Sort By</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>
        <div className="products-grid">
          {sortedProducts.map((product) => (
            <Link
              to={`/product/${product._id}`}
              className="product-card"
              key={product._id}
            >
              <div className="product-image">
                <img src={product.images[0]} alt={product.name} />
              </div>

              <h3>{product.name}</h3>

              <p>{product.category}</p>

              <span>₹{product.price.toLocaleString("en-IN")}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default Products;
