import { TbTrash } from "react-icons/tb"
import getCart, { addToCart, getTotal, getTotalForLabelledPrice, removeFromCart } from "../../utils/cart"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function CartPage(){

    const [cartLoaded , setCartLoaded] = useState(false)
    const [cart , setCart] = useState([])
    const navigate = useNavigate()


    useEffect(()=>{
        if(cartLoaded == false){
            const cart = getCart()
            setCart(cart)
            setCartLoaded(true)
        }
    },[cartLoaded])
    return(
        <div className="w-full h-full flex justify-center p-4 sm:p-6 lg:p-[40px]">

            <div className="w-full lg:w-[700px]">
                {
                    cart.map((item,index)=>{
                        return(
                            <div key={index} className="w-full bg-white shadow-2xl my-2 lg:my-[5px] rounded-lg lg:rounded-none p-3 lg:p-0 lg:h-[100px] flex flex-col lg:flex-row lg:justify-between lg:items-center relative">
                                <button className="absolute right-[-12px] top-[-5px] lg:right-[-50px] lg:top-auto bg-red-500 w-8 h-8 lg:w-[40px] lg:h-[40px] rounded-full text-white flex justify-center items-center shadow cursor-pointer text-sm lg:text-base"
                                onClick={()=>{
                                    removeFromCart(item.productId)
                                    setCartLoaded(false)
                                }}>
                                    <TbTrash />
                                </button>
                                
                                {/* Mobile Layout */}
                                <div className="flex lg:contents">
                                    <img src={item.image} className="w-20 h-20 lg:h-[100px] lg:w-auto aspect-square object-cover rounded-md lg:rounded-none flex-shrink-0" />
                                    
                                    <div className="ml-3 lg:ml-0 flex-1 lg:h-[100px] lg:w-[300px] lg:max-w-[300px] overflow-hidden">
                                        <h1 className="text-lg lg:text-xl font-bold leading-tight">{item.name}</h1>
                                        <h2 className="text-xs lg:text-sm text-gray-500 mt-1">{item.altName.join(" | ")}</h2>
                                        <h2 className="text-sm lg:text-lg text-gray-700 mt-1">LKR: {item.price.toFixed(2)}</h2>
                                    </div>
                                </div>
                                
                                {/* Quantity and Price Section - Mobile: Row, Desktop: Separate sections */}
                                <div className="flex justify-between items-center mt-3 lg:mt-0 lg:contents">
                                    <div className="flex items-center lg:h-[100px] lg:w-[100px] lg:justify-center mx-12 lg:mx-0">
                                        <button className="text-lg lg:text-2xl w-7 h-7 lg:w-[30px] lg:h-[30px] flex justify-center items-center bg-black text-white rounded-full cursor-pointer mx-1 lg:mx-[5px]"
                                        onClick={()=>{
                                            addToCart(item, -1)
                                            setCartLoaded(false)
                                        }}>-</button>
                                        <h1 className="text-lg lg:text-xl font-bold mx-2 lg:mx-1 min-w-[2rem] text-center"> {item.quantity} </h1>
                                        <button className="text-lg lg:text-2xl w-7 h-7 lg:w-[30px] lg:h-[30px] flex justify-center items-center bg-black text-white rounded-full cursor-pointer mx-1 lg:mx-[5px]"
                                        onClick={()=>{
                                            addToCart(item, 1)
                                            setCartLoaded(false)
                                        }}>+</button>
                                    </div>
                                    
                                    <div className="lg:h-full lg:w-[150px] flex lg:justify-end lg:items-center lg:mx-[5px]">
                                        <h1 className="text-lg lg:text-xl font-semibold lg:font-normal lg:text-end">LKR: {(item.price*item.quantity).toFixed(2)}</h1>
                                    </div>
                                </div>
                            </div>
                        )


                    })
                }
                
                {/* Totals Section */}
                <div className="mt-4 lg:mt-2 bg-white lg:bg-transparent shadow-lg lg:shadow-none rounded-lg lg:rounded-none p-4 lg:p-0">
                    <div className="w-full flex justify-between lg:justify-end">
                        <h1 className="text-lg lg:text-xl lg:w-[150px] lg:text-center lg:flex lg:justify-end lg:mx-[5px]">Total :</h1>
                        <h1 className="text-lg lg:text-xl lg:w-[150px] lg:text-center lg:flex lg:justify-end lg:mx-[5px] font-semibold lg:font-normal">
                            LKR: {getTotalForLabelledPrice().toFixed(2)}
                        </h1>
                    </div>

                    <div className="w-full flex justify-between lg:justify-end mt-2 lg:mt-0">
                        <h1 className="text-lg lg:text-xl lg:w-[150px] lg:text-center lg:flex lg:justify-end lg:mx-[5px]">Discount :</h1>
                        <h1 className="text-lg lg:text-xl lg:w-[150px] lg:text-center lg:flex lg:justify-end lg:mx-[5px] lg:border-b-[2px] font-semibold lg:font-normal">
                            LKR: {(getTotalForLabelledPrice()- getTotal()).toFixed(2)}
                        </h1>
                    </div>

                    <div className="w-full flex justify-between lg:justify-end mt-3 lg:mt-0 lg:h-[50px] pt-3 lg:pt-0 border-t-2 lg:border-t-0">
                        <h1 className="text-xl font-bold lg:w-[150px] lg:text-center lg:flex lg:justify-end lg:items-center lg:mx-[5px]">Net Total :</h1>
                        <h1 className="text-xl font-bold lg:w-[150px] lg:flex lg:justify-end lg:items-center lg:mx-[5px] lg:border-b-[5px] lg:[border-bottom-style:double]">
                            LKR: {getTotal().toFixed(2)}
                        </h1>
                    </div>
                    
                    <div className="w-full flex justify-center lg:justify-end mt-4">
                        <button className="w-full lg:w-[170px] text-lg lg:text-xl text-center shadow cursor-pointer bg-pink-400 hover:bg-pink-500 text-white h-12 lg:h-[40px] rounded-lg transition-colors" onClick={()=>{
                            navigate("/checkout",
                                {
                                    state : {
                                        items : cart
                                    }
                                }
                            )
                        }}>
                            Check Out
                        </button>
                    </div>
                </div>
                


            </div>
        </div>
    )
}