import { FaStar } from "react-icons/fa6";

export default function StarDisplay({ rating }) {
  return (
    <div className="flex gap-[2px] mt-1">
      {[...Array(5)].map((_, i) => {
        const isFull = rating >= i + 1;
        const isHalf = rating >= i + 0.5 && rating < i + 1;

        return (
          <div key={i} className="relative w-4 h-4">
            {/* Gray empty star */}
            <FaStar className="text-gray-300 absolute inset-0" size={16} />

            {/* Red fill for full/half */}
            <div
              className={`absolute top-0 left-0 h-full overflow-hidden ${
                isFull ? "w-full" : isHalf ? "w-1/2" : "w-0"
              }`}
            >
              <FaStar className="text-red-500" size={16} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
