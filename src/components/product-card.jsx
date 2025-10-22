import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa6";

// ⭐ Read-only star display for product cards
function StarDisplay({ rating = 0 }) {
  return (
    <div className="flex items-center gap-1 mt-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <FaStar
          key={i}
          size={16}
          className={i <= Math.round(rating) ? "text-pink-500" : "text-gray-300"}
        />
      ))}
      <span className="text-sm text-gray-500 ml-1">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export default function ProductCard(props) {
  const product = props.product;

  return (
    <Link
      to={"/overview/" + product.productId}
      className="w-[250px] m-4 h-[350px] border shadow-2xl rounded-lg overflow-hidden hover:shadow-pink-200 transition-all"
    >
      {/* 🖼️ Product Image */}
      <img
        className="w-full h-[220px] object-cover"
        src={product.images[0]}
        alt={product.name}
      />

      {/* 📝 Product Info */}
      <div className="h-[130px] w-full flex flex-col justify-center px-4 py-2">
        <p className="text-gray-400 text-sm">{product.productId}</p>
        <p className="text-lg font-bold truncate">{product.name}</p>

        <p className="text-lg text-pink-500">
          Rs {product.price.toFixed(2)}{" "}
          <span className="line-through text-gray-400 text-sm">
            {product.price < product.labeledPrice &&
              "Rs " + product.labeledPrice.toFixed(2)}
          </span>
        </p>

        {/* ⭐ Rating (read-only) */}
        <StarDisplay rating={product.averageRating || 0} />
      </div>
    </Link>
  );
}
