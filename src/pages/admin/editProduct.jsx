// admin/editProduct.jsx
import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useLocation } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload"; // CHANGED: added mediaUpload to handle file uploads

export default function EditProductForm() {
  const location = useLocation(); // CHANGED: receive product from navigate(..., { state: product })
  const productFromState = location.state || null; // may be null if user navigated directly
  const navigate = useNavigate();

  // CHANGED: use single product object to bind form fields
  const [product, setProduct] = useState(
    productFromState || {
      productId: "",
      name: "",
      altNames: "", // CHANGED: keep altNames as comma string initially for the input
      price: "",
      labeledPrice: "",
      description: "",
      stock: "",
      images: [], // may contain urls (strings) or FileList (when user selects files)
    }
  );

  const [loading, setLoading] = useState(false);

  // CHANGED: If user arrives with no state, warn (you could fetch by id here)
  useEffect(() => {
    if (!productFromState) {
      console.warn("No product data passed through location.state.");
    }
  }, [productFromState]);

  // CHANGED: generic handler for text/number inputs bound to product fields
  function handleChange(e) {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  }

  // CHANGED: handle file selection => set product.images to FileList
  function handleFileChange(e) {
    const files = e.target.files;
    if (files && files.length > 0) {
      setProduct((prev) => ({ ...prev, images: files }));
    } else {
      setProduct((prev) => ({ ...prev, images: [] }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to update a product.");
        setLoading(false);
        return;
      }

      // Prepare images: if images is a FileList (user selected new files), upload them
      let existingImageUrls = [];
      let newUploadedUrls = [];

      // If productFromState existed and provided image URLs and user hasn't selected new files,
      // product.images will already contain those URLs (strings). If user selected files, product.images is a FileList.
      if (product.images && product.images.length > 0) {
        const first = product.images[0];
        if (first instanceof File) {
          // CHANGED: upload new files
          const promises = [];
          for (let i = 0; i < product.images.length; i++) {
            promises.push(mediaUpload(product.images[i]));
          }
          newUploadedUrls = await Promise.all(promises);
        } else {
          // images are existing URLs
          existingImageUrls = product.images;
        }
      }

      // If there were existing URLs in productFromState and admin selected new files,
      // you might want to append or replace — here we append new uploads to existing URLs
      // CHANGED: handle case where initial productFromState had images stored separately
      if (productFromState && Array.isArray(productFromState.images) && !(product.images && product.images[0] instanceof File)) {
        // admin didn't pick new files; keep original URLs from productFromState
        existingImageUrls = productFromState.images;
      } else if (productFromState && Array.isArray(productFromState.images) && (product.images && product.images[0] instanceof File)) {
        // admin picked new files; append newUploadedUrls to existing from state
        existingImageUrls = productFromState.images;
      }

      const combinedImages = [...existingImageUrls, ...newUploadedUrls];

      // CHANGED: convert altNames string to array (trim entries) for backend
      const altNamesArray =
        typeof product.altNames === "string"
          ? product.altNames.split(",").map((s) => s.trim()).filter(Boolean)
          : Array.isArray(product.altNames)
          ? product.altNames
          : [];

      // Build payload (omit images if empty)
      const payload = {
        productId: product.productId,
        name: product.name,
        altNames: altNamesArray,
        price: product.price,
        labeledPrice: product.labeledPrice,
        description: product.description,
        stock: product.stock,
        images: combinedImages,
      };

      // CHANGED: Log payload for debugging
      console.log("PUT payload:", payload);

      // Make sure backend expects PUT /api/product/:productId
      const url = `${import.meta.env.VITE_URL}/api/product/${product.productId}`;

      const res = await axios.put(url, payload, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });

      console.log("PUT response:", res);
      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch (error) {
      console.error("Update error (full):", error);
      if (error.response) {
        console.error("Server response data:", error.response.data);
        console.error("Server response status:", error.response.status);
        toast.error(
          error.response.data?.message ||
            `Error updating product (status ${error.response.status})`
        );
      } else if (error.request) {
        console.error("No response received, request:", error.request);
        toast.error("No response from server — check backend/CORS or server logs");
      } else {
        console.error("Error setting up request:", error.message);
        toast.error("Error updating product: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full h-full rounded-lg flex justify-center items-center">
      <div className="w-[500px] h-[600px] bg-white rounded-lg shadow-lg flex flex-col items-center overflow-auto">
        <h1 className="text-3xl font-bold text-gray-700 m-[10px]">Edit Product</h1>

        {/* CHANGED: Product ID input */}
        <input
          name="productId"
          value={product.productId ?? ""}
          onChange={handleChange}
          className="w-[400px] h-[50px] border border-gray-500 rounded-xl text-center m-[5px]"
          placeholder="Product ID"
        />

        {/* CHANGED: Product Name */}
        <input
          name="name"
          value={product.name ?? ""}
          onChange={handleChange}
          className="w-[400px] h-[50px] border border-gray-500 rounded-xl text-center m-[5px]"
          placeholder="Product Name"
        />

        {/* CHANGED: Alternative Names (display comma string) */}
        <input
          name="altNames"
          value={
            Array.isArray(product.altNames)
              ? product.altNames.join(",")
              : product.altNames ?? ""
          }
          onChange={handleChange}
          className="w-[400px] h-[50px] border border-gray-500 rounded-xl text-center m-[5px]"
          placeholder="Alternative Names"
        />

        {/* CHANGED: Price */}
        <input
          name="price"
          value={product.price ?? ""}
          onChange={handleChange}
          type="number"
          className="w-[400px] h-[50px] border border-gray-500 rounded-xl text-center m-[5px]"
          placeholder="Price"
        />

        {/* CHANGED: Labeled Price */}
        <input
          name="labeledPrice"
          value={product.labeledPrice ?? ""}
          onChange={handleChange}
          type="number"
          className="w-[400px] h-[50px] border border-gray-500 rounded-xl text-center m-[5px]"
          placeholder="Labeled Price"
        />

        {/* CHANGED: Description */}
        <textarea
          name="description"
          value={product.description ?? ""}
          onChange={handleChange}
          className="w-[400px] h-[100px] border border-gray-500 rounded-xl text-center m-[5px]"
          placeholder="Description"
        />

        {/* CHANGED: File input for images */}
        <input
          type="file"
          onChange={handleFileChange}
          multiple
          className="w-[400px] h-[50px] border border-gray-500 rounded-xl text-center m-[5px]"
          placeholder="Product Images"
        />

        {/* CHANGED: preview existing image URLs if present and not FileList */}
        {product.images &&
          product.images.length > 0 &&
          !(product.images[0] instanceof File) && (
            <div className="w-[400px] flex flex-wrap gap-2 my-2 justify-center">
              {product.images.map((imgUrl, idx) => (
                <img
                  key={idx}
                  src={imgUrl}
                  alt={`img-${idx}`}
                  className="w-16 h-16 object-cover rounded-md"
                />
              ))}
            </div>
          )}

        {/* CHANGED: Stock */}
        <input
          name="stock"
          value={product.stock ?? ""}
          onChange={handleChange}
          type="number"
          className="w-[400px] h-[50px] border border-gray-500 rounded-xl text-center m-[5px]"
          placeholder="Stock"
        />

        <div className="w-[400px] h-[100px] flex justify-between items-center rounded-lg">
          <Link
            to={"/admin/products"}
            className="bg-red-500 text-white p-[10px] w-[180px] text-center rounded-lg hover:bg-red-600 transition duration-300"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-500 disabled:opacity-50 text-white p-[10px] w-[180px] text-center rounded-lg cursor-pointer hover:bg-blue-600 transition duration-300"
          >
            {loading ? "Saving..." : "Edit Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
