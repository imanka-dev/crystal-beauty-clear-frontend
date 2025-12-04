import { TbTrash } from "react-icons/tb"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios";
import toast from "react-hot-toast";

export default function CheckOutPage(){
    
    const location = useLocation();
    const [cart,setCart] = useState(location.state.items)
    const [cartRefresh,setCartRefresh] = useState(false)
    const [name, setName] = useState("");
    const [email,setEmail] = useState("");
    const [address,setAddress] = useState("");
    const [phoneNumber,setPhoneNumber] = useState("");

    const navigate = useNavigate();

   function placeOder(){
    const oderData = {
        name : name,
        email: email,
        address : address,
        phoneNumber : phoneNumber,
        billItem : []
         }
        for(let i = 0; i< cart.length; i++){
            oderData.billItem[i] = {
                productId : cart[i].productId,
                quantity : cart[i].quantity
            }
         }
         const token = localStorage.getItem("token");
         axios.post(import.meta.env.VITE_URL + "/api/oder", oderData, {
                    headers: {
            
            Authorization: "Bearer " + token,
            
        },

         }).then(()=>{
            toast.success("Oder Placed Successfully")
            navigate("/");

         }).catch((error)=>{
            console.log(error);
            toast.error("Oder Placement Failed");
         })
   }

    function getTotal(){
        let total = 0
        cart.forEach((item)=>{
            total += item.price * item.quantity
        })
        return total
    }

    function getTotalForLabelledPrice(){
        let total = 0
        cart.forEach((item)=>{
            total += item.labeledPrice * item.quantity
        })
        return total
    }

    return(
        <div className="w-full h-full flex justify-center p-[40px]">
            <div className="w-[1200px] flex gap-8">
                
                {/* Left Side - Customer Information Form */}
                <div className="w-[400px] bg-white shadow-2xl p-6 rounded-lg h-fit">
                    <h2 className="text-2xl font-bold mb-6 text-center">Customer Information</h2>
                    
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <label className="text-lg font-bold mb-2">Name</label>
                            <input
                                className="text-xl border-b-[2px] border-gray-300 focus:border-pink-400 outline-none py-2"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-lg font-bold mb-2">Email</label>
                            <input
                                type="email"
                                className="text-xl border-b-[2px] border-gray-300 focus:border-pink-400 outline-none py-2"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-lg font-bold mb-2">Address</label>
                            <input
                                className="text-xl border-b-[2px] border-gray-300 focus:border-pink-400 outline-none py-2"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Enter your delivery address"
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="text-lg font-bold mb-2">Phone Number</label>
                            <input
                                type="tel"
                                className="text-xl border-b-[2px] border-gray-300 focus:border-pink-400 outline-none py-2"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Enter your phone number"
                            />
                        </div>

                        <div className="mt-6">
                            <button 
                                className="w-full text-xl text-center shadow-lg cursor-pointer bg-pink-400 hover:bg-pink-500 text-white h-[50px] rounded-lg transition-colors" 
                                onClick={placeOder}                                    
                            >
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side - Cart Items and Summary */}
                <div className="w-[700px]">
                    {
                        cart.map((item,index)=>{
                            return(
                                <div key={index} className="w-full h-[100px] bg-white shadow-2xl my-[5px]  flex justify-between items-center relative">
                                    <button className="absolute right-[-50px] bg-red-500 w-[40px] h-[40px] rounded-full text-white flex justify-center items-center shadow cursor-pointer"
                                   onClick={()=>{
                                    const newCart = cart.filter((product) => product.productId !== item.productId)
                                    setCart(newCart)
                                    setCartRefresh(!cartRefresh)
                                }}>
                                        <TbTrash />
                                    </button>
                                    <img src={item.image} className="h-full aspect-square object-cover" />
                                    <div className="h-full max-w-[300px] w-300px overflow-hidden">
                                        <h1 className="text-xl font-bold">{item.name}</h1>
                                        <h2 className="text-sm text-gray-500">{item.altName.join(" | ")}</h2>
                                        <h2 className="text-lg text-gray-700">LKR:{item.price.toFixed(2)}</h2>
                                    </div>
                                        <div className="h-full w-[100px] flex justify-center items-center ">
                                            <button className=" text-2xl w-[30px] h-[30px] flex justify-center items-center bg-black text-white rounded-full  cursor-pointer mx-[5px]"
                                            onClick={()=>{ 
                                                const newCart = [...cart]
                                                newCart[index].quantity -= 1
                                                if (newCart[index].quantity <= 0) newCart[index].quantity = 1
                                                setCart(newCart)
                                                setCartRefresh(!cartRefresh)
                                            }}>-</button>
                                            <h1 className="text-xl font-bold "> {item.quantity} </h1>
                                            <button className=" text-2xl w-[30px] h-[30px] flex justify-center items-center bg-black text-white rounded-full  cursor-pointer mx-[5px]"
                                            onClick={()=>{
                                                const newCart = [...cart]
                                                newCart[index].quantity += 1
                                                setCart(newCart)
                                                setCartRefresh(!cartRefresh)
                                            }}>+</button>
                                        </div>
                                         <div className="h-full w-[150px] flex justify-end items-center mx-[5px]">
                                            <h1 className="text-xl text-end"> {(item.price*item.quantity).toFixed(2)} </h1>
                                        </div>
                                </div>
                            )
                        })
                    }
                    
                    {/* Order Summary */}
                    <div className="bg-white shadow-2xl p-6 mt-4 rounded-lg">
                        <div className="w-full  flex justify-end ">
                            <h1 className="w-[150px]  text-xl text-center flex justify-end  mx-[5px] ">Total : </h1>
                            <h1 className="w-[150px]   text-xl text-center flex justify-end  mx-[5px]  ">
                                LKR: {getTotalForLabelledPrice().toFixed(2)}
                            </h1>
                        </div>

                        <div className="w-full flex justify-end ">
                            <h1 className="w-[150px]  text-xl text-center flex justify-end  mx-[5px] ">Discount : </h1>
                            <h1 className="w-[150px]   text-xl text-center flex justify-end  mx-[5px] border-b-[2px]  ">
                                LKR: {(getTotalForLabelledPrice()- getTotal()).toFixed(2)}
                            </h1>
                        </div>

                        <div className="w-full h-[50px] flex justify-end ">
                            <h1 className="w-[150px]   text-xl text-center flex justify-end items-center mx[5px] font-bold  ">Net Total : </h1>
                            <h1 className="w-[150px]  text-xl flex  justify-end items-center mx-[5px] font-bold border-b-[5px]  [border-bottom-style:double]">
                                LKR: {getTotal().toFixed(2)}
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}