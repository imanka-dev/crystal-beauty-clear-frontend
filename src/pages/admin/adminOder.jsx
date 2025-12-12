import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";
import { IoMdCloseCircleOutline } from "react-icons/io";
import toast from "react-hot-toast";



export default function AdminOrderPage() {
    const [orders, setOrders] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [modalIsDisplaying, setModalIsDisplaying] = useState(false);
    const [displayingOrder, setDisplayingOrder] = useState(null);



    useEffect(
        () => {
            if (!loaded) {
                const token = localStorage.getItem("token")
                axios.get(import.meta.env.VITE_URL + "/api/oder", { 
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }).then(response => {
                    console.log(response.data)
                    setOrders(response.data) 
                    setLoaded(true)
                }).catch(error => {
                    console.error("Error fetching orders:", error)
                    setLoaded(true)
                })
            }
        },[loaded]
    )

    /*
    {
    "_id": "69314a28c72068f181d5d9d9",
    "oderId": "ORD0016",
    "email": "imanka@gmail.com",
    "name": "imanka silva",
    "address": "190/a walpola ragama",
    "states": "Pending",
    "phoneNumber": "0725107553",
    "billItem": [
        {
            "productId": "COSM-006",
            "productName": "Vitamin C Brightening Serum",
            "Image": "https://ckblbonzyovxwswpxgub.supabase.co/storage/v1/object/public/images/1760893271694_cosmetics-03.jpg",
            "quantity": 3,
            "price": 32.5,
            "_id": "69314a28c72068f181d5d9da"
        },
        {
            "productId": "COSM-005",
            "productName": "Rose Glow Hydrating Toner",
            "Image": "https://ckblbonzyovxwswpxgub.supabase.co/storage/v1/object/public/images/1760893377215_cosmetics-02.jpg",
            "quantity": 1,
            "price": 18.99,
            "_id": "69314a28c72068f181d5d9db"
        },
        {
            "productId": "COSM-001",
            "productName": "Face Cream",
            "Image": "https://ckblbonzyovxwswpxgub.supabase.co/storage/v1/object/public/images/1760893243906_cosmetics-05.jpg",
            "quantity": 1,
            "price": 5000.25,
            "_id": "69314a28c72068f181d5d9dc"
        }
    ],
    "total": 5116.74,
    "Date": "2025-12-04T08:45:28.961Z",
    "__v": 0
}

    */
    
    function changeOrderStatus(oderId,status) {
        const token = localStorage.getItem("token");
        axios.put(import.meta.env.VITE_URL + "/api/oder/" + oderId,
            { states: status },
            {
                headers: { Authorization: "Bearer " + token },
            }
        ).then(response => {
            toast.success("Order status updated successfully");
            setLoaded(false); // Trigger re-fetching orders
        }).catch(error => {
            console.error("Error updating order status:", error);
            toast.error("Failed to update order status");
        });
    }

    return (
        <div className="w-full h-full p-4 overflow-auto">
            
            {
                loaded ? 
                <div className="w-full h-full">
                   
                   <div className="overflow-x-auto">
                   <table className="w-full border-collapse">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 text-left border-b-2 border-gray-300">Order ID</th>
                            <th className="p-3 text-left border-b-2 border-gray-300">Customer Email</th>
                            <th className="p-3 text-left border-b-2 border-gray-300">Customer Name</th>
                            <th className="p-3 text-left border-b-2 border-gray-300">Address</th>
                            <th className="p-3 text-left border-b-2 border-gray-300">Phone Number</th>                           
                            <th className="p-3 text-left border-b-2 border-gray-300">Status</th>
                            <th className="p-3 text-left border-b-2 border-gray-300">Total</th>
                            <th className="p-3 text-left border-b-2 border-gray-300">Date</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                     {
                        orders.map(
                            (order)=>{
                                return (
                                    <tr
                                        key={order.oderId}
                                        className="border-b-2 border-gray-300 text-center hover:bg-gray-200"
                                        onClick={() =>{ 
                                            setModalIsDisplaying(true)
                                            setDisplayingOrder(order)
                                            
                                        }}
                                       >
                                        <td className="p-2">{order.oderId}</td>
                                        <td className="p-2">{order.email}</td>
                                        <td className="p-2">{order.name}</td>
                                        <td className="p-2">{order.address}</td>
                                        <td className="p-2">{order.phoneNumber}</td>
                                        <td className="p-2">
                                            <select 
                                                value={order.states}
                                                onChange={(e) => {
                                                    changeOrderStatus(order.oderId, e.target.value)
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                                className="border border-gray-300 rounded px-2 py-1"
                                            >
                                                <option value={"Pending"}>Pending</option>
                                                <option value={"Shipped"}>Shipped</option>
                                                <option value={"Delivered"}>Delivered</option>
                                                <option value={"Cancelled"}>Cancelled</option>
                                            </select>
                                        </td>

                                        <td className="p-2">{order.total.toFixed(2)}</td>
                                        <td className="p-2">{new Date(order.Date).toLocaleDateString()}</td>

                                        </tr>
                                )
                            }
                        )

                    }
                   </table>
                   </div>
                   {
                    modalIsDisplaying &&
                    <div className="fixed bg-[#00000080] top-0 left-0 w-full h-full flex justify-center items-center">
                        <div className="w-[600px] max-w-[600px] h-[600px] max-h-[600px] bg-white relative rounded-lg flex flex-col p-4">
                            <button onClick={() => setModalIsDisplaying(false)} className="absolute -top-8 -right-8 z-10 rounded-full p-1">
                                <IoMdCloseCircleOutline className="text-3xl text-white hover:text-red-700 cursor-pointer"/>
                            </button>
                            
                            <div className="w-full flex-shrink-0 mb-4">
                                <h1 className="text-sm font-bold p-2">Order ID: {displayingOrder.oderId}</h1>
                                <h1 className="text-sm font-bold p-2">Order Date: {new Date(displayingOrder.Date).toLocaleDateString()}</h1>
                                <h1 className="text-sm font-bold p-2">Order Status: {displayingOrder.states}</h1>
                                <h1 className="text-sm font-bold p-2">Order Total: Rs{displayingOrder.total.toFixed(2)}</h1>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto scrollbar-hide w-full">
                                {displayingOrder.billItem.map(
                                    (item,index)=>{
                                        return (
                                            <div key={index} className="w-full min-h-[100px] flex border-b-2 border-gray-300 p-2">
                                                <img src={item.Image} alt={item.productName} className="w-[80px] h-[80px] object-cover rounded-lg"/>
                                                <div className="ml-4 flex flex-col justify-center"> 
                                                    <h1 className="font-bold">{item.productName}</h1>
                                                    <h1>Quantity: {item.quantity}</h1>
                                                    <h1>Price: Rs{item.price.toFixed(2)}</h1>   
                                                </div>
                                            </div>
                                        )
                                    }
                                )}
                            </div>
                        </div>
                        
                    </div> 
                   }
                </div>
                :
                <div className="w-full h-full flex justify-center items-center">
                    <Loader />
                </div>
            }

        </div>
    )
}