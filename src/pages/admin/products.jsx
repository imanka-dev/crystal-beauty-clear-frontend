import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaRegTrashAlt, FaSpinner } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { GrEdit } from "react-icons/gr";
import { Link, useNavigate } from "react-router-dom";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(import.meta.env.VITE_URL + "/api/product").then((response) => {
      setProducts(response.data);
    });
  }, []);

  async function deleteProduct(id) {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to delete a product");
      return;
    }
    setDeletingId(id);
    try {
      await axios.delete(import.meta.env.VITE_URL + "/api/product/" + id, {
        headers: { Authorization: "Bearer " + token },
      });
      setProducts((prev) => prev.filter((p) => p.productId !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error deleting product");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="w-full h-full rounded-lg relative">
      <Link
        to={"/admin/addProduct"}
        className="text-white absolute bg-gray-700 p-[12px] text-3xl rounded-full cursor-pointer hover:bg-gray-300 hover:text-gray-700 right-5 bottom-5"
      >
        <FaPlus />
      </Link>

      <table className="w-full">
        <thead>
          <tr>
            <th className="p-2">Product ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Price</th>
            <th className="p-2">Labeled Price</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr
              key={index}
              className="border-b-2 border-gray-300 text-center hover:bg-gray-200"
            >
              <td className="p-2">{product.productId}</td>
              <td className="p-2">{product.name}</td>
              <td className="p-2">{product.price}</td>
              <td className="p-2">{product.labeledPrice}</td>
              <td className="p-2">{product.stock}</td>
              <td className="p-2">
                <div className="flex justify-center">
                  {deletingId === product.productId ? (
                    <FaSpinner className="text-[25px] m-[10px] animate-spin text-gray-600" />
                  ) : (
                    <FaRegTrashAlt
                      className="text-[25px] m-[10px] hover:text-red-600 cursor-pointer"
                      onClick={() => deleteProduct(product.productId)}
                    />
                  )}
                  
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
