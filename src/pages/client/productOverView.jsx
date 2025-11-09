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
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      {status === "loading" && <Loader />}

      {status === "error" && (
        <div className="text-red-500 font-semibold text-lg">
          ⚠️ Product not found or failed to load.
        </div>
      )}

      {status === "loaded" && product && (
        <div className="max-w-6xl w-full  bg-white rounded-2xl shadow-lg p-8 grid md:grid-cols-2 gap-10">
          {/* Left: Product Images */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md h-[400px] rounded-xl overflow-hidden border">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 mt-4">
              {product.images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Thumbnail ${i}`}
                  className={`w-20 h-20 object-cover rounded-lg border-2 cursor-pointer transition-all ${
                    selectedImage === img
                      ? "border-pink-500 scale-105"
                      : "border-gray-300"
                  }`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col justify-between space-y-6 ">
            <div>
              <p className="text-gray-500 mt-2 text-sm">
                Product ID: {product.productId}
              </p>
              <h1 className="text-4xl font-bold">{product.name}</h1>

              <h2 className="text-gray-600 font-semibold">
                {product.altName.join(" | ")}
              </h2>
            </div>

            {/* ⭐ Star Rating (backend connected now) */}
            <StarRating
              productId={product.productId}
              initialRating={product.averageRating}
            />

            <div>
              <p className="text-2xl font-semibold text-pink-500">
                Rs {product.price?.toFixed(2)}
                {product.labeledPrice && product.labeledPrice > product.price && (
                  <span className="text-gray-400 line-through text-lg ml-2">
                    Rs {product.labeledPrice.toFixed(2)}
                  </span>
                )}
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed">
              {product.description || "No description available."}
            </p>

            <div className="flex gap-4 mt-6">
              <button className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-medium rounded-xl shadow-md transition-all cursor-pointer" onClick={
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
                  className="px-6 py-3 bg-gray-700 hover:bg-black text-white font-medium rounded-xl shadow-md transition-all cursor-pointer">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
