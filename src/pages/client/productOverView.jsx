import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa6";
import getCart, { addToCart } from "../../utils/cart";

// ⭐ Enhanced Star Rating Component (merged version)
function StarRating({ productId, initialRating }) {
  const [rating, setRating] = useState(initialRating || 0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [average, setAverage] = useState(initialRating || 0);
  

  // ✅ Send rating to backend & update average
  async function handleRate(value) {
    if (loading) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/product/${productId}/rate`,
        { rating: value }
      );
      setAverage(res.data.averageRating);
      setRating(value);
      toast.success("Thanks for your rating!");
    } catch (err) {
      toast.error("Failed to rate product");
    } finally {
      setLoading(false);
    }
  }

  const handleClick = (index) => {
    let newRating;
    if (rating === index + 0.5) newRating = index + 1; // half → full
    else if (rating === index + 1) newRating = 0; // full → empty
    else newRating = index + 0.5; // empty → half

    setRating(newRating);
    handleRate(newRating); // 🔥 Send to backend
  };

  return (
    <div className="flex flex-col gap-1 mt-2">
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => {
          const isHalf = rating === i + 0.5;
          const isFull = rating >= i + 1;
          return (
            <div
              key={i}
              onMouseEnter={() => setHover(i + 1)}
              onMouseLeave={() => setHover(0)}
              onClick={() => handleClick(i)}
              className="relative cursor-pointer w-8 h-8"
            >
              {/* Empty Star (Gray) */}
              <FaStar
                className={`absolute inset-0 transition-all ${
                  hover > i || isFull ? "text-pink-500" : "text-gray-300"
                }`}
                size={32}
              />
              {/* Half Fill Layer */}
              {isHalf && (
                <div className="absolute top-0 left-0 w-1/2 overflow-hidden h-full">
                  <FaStar className="text-pink-500" size={32} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <span className="text-sm text-gray-600">
        ⭐ Average: {average.toFixed(1)} / 5
      </span>
    </div>
  );
}

// 🛍️ Main Component
export default function ProductOverView() {
  const params = useParams();
  const navigate = useNavigate();

  if (params.id == null) {
    window.location.href = "/products";
  }

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    if (status === "loading") {
      axios
        .get(import.meta.env.VITE_URL + "/api/product/" + params.id)
        .then((res) => {
          const fetchedProduct = res.data.product || res.data;
          setProduct(fetchedProduct);
          setSelectedImage(fetchedProduct.images?.[0]);
          setStatus("loaded");
        })
        .catch(() => {
          toast.error("Product is not available");
          setStatus("error");
        });
    }
  }, [status]);

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-1 sm:py-6 lg:px-8">
      {status === "loading" && <Loader />}

      {status === "error" && (
        <div className="text-red-500 font-semibold text-base sm:text-lg text-center">
          ⚠️ Product not found or failed to load.
        </div>
      )}

      {status === "loaded" && product && (
        <div className="max-w-7xl w-full bg-white rounded-2xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
          {/* Left: Product Images */}
          <div className="flex flex-col items-center order-1 lg:order-1">
            {/* Mobile Product Name - Only visible on small screens */}
            <div className="block sm:hidden w-full mb-4 text-center">
              <h1 className="text-xl font-bold leading-tight">{product.name}</h1>
              <h2 className="text-gray-600 font-medium text-sm mt-1">
                {product.altName.join(" | ")}
              </h2>
            </div>
            
            {/* Background Box for Images and Thumbnails */}
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 w-full flex flex-col items-center">
              <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg h-[300px] sm:h-[350px] lg:h-[400px] xl:h-[450px] rounded-lg sm:rounded-xl overflow-hidden border border-gray-300">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-4 overflow-x-auto pb-2 w-full justify-center">
                {product.images?.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Thumbnail ${i}`}
                    className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 object-cover rounded-md sm:rounded-lg border-2 cursor-pointer transition-all ${
                      selectedImage === img
                        ? "border-[var(--color-accent)] text-[var(--color-accent)] scale-105"
                        : "border-gray-300"
                    }`}
                    onClick={() => setSelectedImage(img)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col justify-between space-y-4 sm:space-y-6 order-2 lg:order-2 ">
            <div>
              <p className="text-gray-500 mt-2 text-xs sm:text-sm">
                Product ID: {product.productId}
              </p>
              {/* Desktop/Tablet Product Name - Hidden on mobile */}
              <h1 className="hidden sm:block text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">{product.name}</h1>

              <h2 className="hidden sm:block text-gray-600 font-semibold text-sm sm:text-base mt-1">
                {product.altName.join(" | ")}
              </h2>
            </div>

            {/* ⭐ Star Rating (backend connected now) */}
            <StarRating
              productId={product.productId}
              initialRating={product.averageRating}
            />

            <div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-semibold text-pink-500">
                Rs {product.price?.toFixed(2)}
                {product.labeledPrice && product.labeledPrice > product.price && (
                  <span className="text-gray-400 line-through text-base sm:text-lg ml-2">
                    Rs {product.labeledPrice.toFixed(2)}
                  </span>
                )}
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              {product.description || "No description available."}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
              <button className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-lg sm:rounded-xl shadow-md transition-all cursor-pointer text-sm sm:text-base" onClick={
                ()=>{
                  addToCart(product,1)
                  toast.success("product added to cart")
                  console.log(getCart())
                }
              }>
                Add to Cart
              </button>
              <button
                  onClick={()=>{
                    navigate("/checkout",{
                      state : {
                        items : [
                          {
                              productId : product.productId,
                              name : product.name,
                              altName : product.altName,   // singular, matches backend field name
                              price : product.price,
                              labeledPrice : product.labeledPrice,
                              image : product.images[0],
                              quantity : 1
                          }
                        ]
                      }
                    })
                  }}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-700 hover:bg-black text-white font-medium rounded-lg sm:rounded-xl shadow-md transition-all cursor-pointer text-sm sm:text-base">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
