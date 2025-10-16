import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function AddProductForm() {
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [altNames, setAltNames] = useState("");
  const [price, setPrice] = useState("");
  const [labeledPrice, setLabeledPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");

  function handleSubmit() {
    const altNamesInArray = altNames.split(",")
    const product = {
        productId : productId,
        name : name,
        altNames : altNamesInArray,
        price : price,
        labeledPrice : labeledPrice,
        description : description,
        stock : stock,
        images : [
            "https://picsum.photos/id/106/200/300",
            "https://picsum.photos/id/107/200/300",
            "https://picsum.photos/id/108/200/300"
        ]
    }
    const token = localStorage.getItem("token")
    console.log(token)
    axios.post(import.meta.env.VITE_URL + "/api/product", product ,{
        headers : {
            "Authorization" : "Bearer " + token
        }


    }).then(
        ()=>{
            toast.success("product added successfully")
        }
    ).catch(
        ()=>{
            toast.error("product adding failed")
        }
    )



    toast.success("Form submitted");
  }

  return (
    <div className="w-full h-full rounded-lg flex justify-center items-center">
      <div className="w-[500px] h-[600px] bg-white rounded-lg shadow-lg flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-700 m-[10px]">Add Product</h1>

        <input
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="w-[400px] h-[50px] border border-gray-500 rounded-xl text-center m-[5px]"
          placeholder="Product ID"
        />

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-[400px] h-[50px] border border-gray-500 rounded-xl text-center m-[5px]"
          placeholder="Product Name"
        />

        <input
          value={altNames}
          onChange={(e) => setAltNames(e.target.value)}
          className="w-[400px] h-[50px] border border-gray-500 rounded-xl text-center m-[5px]"
          placeholder="Alternative Names"
        />

        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          type="number"
          className="w-[400px] h-[50px] border border-gray-500 rounded-xl text-center m-[5px]"
          placeholder="Price"
        />

        <input
          value={labeledPrice}
          onChange={(e) => setLabeledPrice(e.target.value)}
          type="number"
          className="w-[400px] h-[50px] border border-gray-500 rounded-xl text-center m-[5px]"
          placeholder="Labeled Price"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-[400px] h-[100px] border border-gray-500 rounded-xl text-center m-[5px]"
          placeholder="Description"
        />

        <input
          value={stock}
          onChange={(e) => setStock(e.target.value)}
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
            className="bg-blue-500 text-white p-[10px] w-[180px] text-center rounded-lg cursor-pointer hover:bg-blue-600 transition duration-300"
          >
            Add Product
          </button>
        </div>
      </div>
    </div>
  );
}
