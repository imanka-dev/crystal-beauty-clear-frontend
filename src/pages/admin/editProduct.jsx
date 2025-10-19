import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useLocation } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload"; // handles uploading new images

export default function EditProductForm() {
  const location = useLocation();
  const productFromState = location.state || null;
  const navigate = useNavigate();

  const [product, setProduct] = useState(
    productFromState || {
      productId: "",
      name: "",
      altNames: "",
      price: "",
      labeledPrice: "",
      description: "",
      stock: "",
      images: [],
    }
  );

  const [loading, setLoading] = useState(false);
  const [newImages, setNewImages] = useState([]);

  // 🧭 Redirect if no product passed (e.g. direct URL access)
  useEffect(() => {
    if (!productFromState) {
      toast.error("Invalid access — please select a product to edit.");
      setTimeout(() => {
        window.location.href = "/admin/products"; // ✅ redirect using window.location.href
      }, 1500);
    }
  }, [productFromState]);

  function handleChange(e) {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e) {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setNewImages((prev) => [...prev, ...files]);
    }
  }

  function handleDeleteImage(index) {
    setProduct((prev) => {
      const updated = { ...prev };
      updated.images = prev.images.filter((_, i) => i !== index);
      return updated;
    });
  }

  function handleDeleteNewImage(index) {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
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

      // Upload new images
      let uploadedNewUrls = [];
      if (newImages.length > 0) {
        const uploads = newImages.map((file) => mediaUpload(file));
        uploadedNewUrls = await Promise.all(uploads);
      }

      const combinedImages = [
        ...(Array.isArray(product.images) ? product.images : []),
        ...uploadedNewUrls,
      ];

      const altNamesArray =
        typeof product.altNames === "string"
          ? product.altNames.split(",").map((s) => s.trim()).filter(Boolean)
          : Array.isArray(product.altNames)
          ? product.altNames
          : [];

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

      console.log("PUT payload:", payload);

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
      console.error("Update error:", error);
      if (error.response) {
        toast.error(
          error.response.data?.message ||
            `Error updating product (status ${error.response.status})`
        );
      } else if (error.request) {
        toast.error("No response from server — check backend or CORS");
      } else {
        toast.error("Error updating product: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full h-full rounded-lg flex justify-center items-center">
      <div className="w-[500px] h-[600px] bg-white rounded-lg shadow-lg flex flex-col items-center overflow-auto p-2">
        <h1 className="text-3xl font-bold text-gray-700 m-[10px]">
          Edit Product
        </h1>

        <input
          disabled
          name="productId"
          value={product.productId ?? ""}
          onChange={handleChange}
          className="w-[400px] h-[50px] border border-gray-500 rounded-xl text-center m-[5px]"
          placeholder="Product ID"
        />

        <input
          name="name"
          value={product.name ?? ""}
          onChange={handleChange}
          className="w-[400px] h-[50px] border border-gray-500 rounded-xl text-center m-[5px]"
          placeholder="Product Name"
        />

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

        <input
          name="price"
          value={product.price ?? ""}
          onChange={handleChange}
          type="number"
          className="w-[400px] h-[50px] border border-gray-500 rounded-xl text-center m-[5px]"
          placeholder="Price"
        />

        <input
          name="labeledPrice"
          value={product.labeledPrice ?? ""}
          onChange={handleChange}
          type="number"
          className="w-[400px] h-[50px] border border-gray-500 rounded-xl text-center m-[5px]"
          placeholder="Labeled Price"
        />

        <textarea
          name="description"
          value={product.description ?? ""}
          onChange={handleChange}
          className="w-[400px] h-[100px] border border-gray-500 rounded-xl text-center m-[5px]"
          placeholder="Description"
        />

        {/* Image Section */}
        <div className="w-[400px] mt-3 mb-2">
          <h2 className="text-lg font-semibold mb-1 text-gray-700">
            Product Images
          </h2>

          {/* Existing Images */}
          {product.images && product.images.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mb-2">
              {product.images.map((imgUrl, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={imgUrl}
                    alt={`img-${idx}`}
                    className="w-16 h-16 object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(idx)}
                    className="absolute top-[-6px] right-[-6px] bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5"
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* New Images */}
          {newImages.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mb-2">
              {newImages.map((file, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`new-${idx}`}
                    className="w-16 h-16 object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteNewImage(idx)}
                    className="absolute top-[-6px] right-[-6px] bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5"
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            type="file"
            onChange={handleFileChange}
            multiple
            className="w-[400px] h-[50px] border border-gray-500 rounded-xl text-center"
          />
        </div>

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
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
