import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/HomePage/Home";
import Products from "./components/HomePage/Products";
import ProductDetails from "./ProductDetails";
import Cart from "./components/others/Cart";
import Wishlist from "./components/others/Wishlist";
import Checkout from "./Checkout/Checkout";
import Orders from "./Checkout/Orders";
import Admin from "./Admin/Admin";
import NotFound from "./pages/NotFound";


function App() {
  return (
    <BrowserRouter>
      <Routes>
       <Route path="/products" element={<Products />} />
       <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;