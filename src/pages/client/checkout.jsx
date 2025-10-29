import { TbTrash } from "react-icons/tb"
import getCart, { addToCart, getTotal, getTotalForLabelledPrice, removeFromCart } from "../../utils/cart"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

export default function CheckOutPage(){

    const location = useLocation()
    const [cart , setCart] = useState([])
    const navigate = useNavigate()


    return(
        <div className="w-full h-full flex justify-center ">

            <div className="w-[700px]">
                {
                    cart.map((item,index)=>{
                        return(
                            <div key={index} className="w-full h-[100px] bg-white shadow-2xl my-[5px]  flex justify-between items-center relative">
                                <button className="absolute right-[-50px] bg-red-500 w-[40px] h-[40px] rounded-full text-white flex justify-center items-center shadow cursor-pointer"
                                onClick={()=>{
                                    removeFromCart(item.productId)
                                    setCartLoaded(false)
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
                                            addToCart(item, -1)
                                            setCartLoaded(false)
                                        }}>-</button>
                                        <h1 className="text-xl font-bold "> {item.quantity} </h1>
                                        <button className=" text-2xl w-[30px] h-[30px] flex justify-center items-center bg-black text-white rounded-full  cursor-pointer mx-[5px]"
                                        onClick={()=>{
                                            addToCart(item, 1)
                                            setCartLoaded(false)
                                        }}>+</button>
                                    </div>
                                     <div className="h-full w-[150px] flex justify-end items-center mx-[5px]">
                                        <h1 className="text-xl text-end"> {(item.price*item.quantity).toFixed(2)} </h1>
                                    </div>
                            </div>
                        )


                    })
                }
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
                <div className="w-full flex justify-end mt-4">
                                <button className="w-[170px] text-xl text-center shadow pr-2 cursor-pointer bg-pink-400 text-white h-[40px] rounded-lg " onClick={()=>{
                                    navigate("/checkout",
                                        {
                                            state : {
                                                items : cart
                                            }
                                        }
                                    )
                                }}>
                                    abcd
                                </button>
                                       
                                 
                </div>
                


            </div>
        </div>
    )
}