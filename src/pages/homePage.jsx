import { Route, Routes } from "react-router-dom";
import Header from "../components/header";
import ProductsPage from "./client/productsPage";
import ProductOverView from "./client/productOverView";

export default function HomePage() {
  return (
    <div className="w-full h-screen  ">
      <Header />

      <div className="w-full min-h-[calc(100vh-70px)] ">
        <Routes>
          {/* ✅ Use relative paths, not absolute */}
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/overview/:id" element={<ProductOverView />} />
          <Route path="/contact" element={<h1>Contact Us</h1>} />
          <Route path="/reviews" element={<h1>Reviews</h1>} />
          <Route path="/*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </div>
    </div>
  );
}
