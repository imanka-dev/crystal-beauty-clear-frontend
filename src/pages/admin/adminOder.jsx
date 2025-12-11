import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../components/loader";



export default function AdminOrderPage() {
    const [orders, setOrders] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [modalIsDisplaying, setModalIsDisplaying] = useState(false)



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
    Date
: 
"2025-10-02T08:07:19.291Z"
address
: 
"456 Galle Road, Colombo"
billItem
: 
[]
email
: 
"janesmith@example.com"
name
: 
"Jane Smith"
oderId
: 
"ORD0001"
phoneNumber
: 
"0712345678"
states
: 
"Pending"
total
: 
0
__v
: 
0
_id
: 
"68de32b708a3568038bf0f5f"

    */

    return (
        <div className="w-full h-full">
            
            {
                loaded ? 
                <div className="w-full h-full">
                   <table className="w-full">
                    <thead>
                        <tr>
                            <th>Oder ID</th>
                            <th>Customer Email</th>
                            <th>Customer Name</th>
                            <th>Address</th>
                            <th>Phone Number</th>                           
                            <th>Status</th>
                            <th>Total</th>
                            <th>Date</th>
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
                                        onClick={() => setModalIsDisplaying(true)}
                                       >
                                        <td className="p-2">{order.oderId}</td>
                                        <td className="p-2">{order.email}</td>
                                        <td className="p-2">{order.name}</td>
                                        <td className="p-2">{order.address}</td>
                                        <td className="p-2">{order.phoneNumber}</td>
                                        <td className="p-2">{order.states}</td>
                                        <td className="p-2">{order.total.toFixed(2)}</td>
                                        <td className="p-2">{new Date(order.Date).toLocaleDateString()}</td>

                                        </tr>
                                )
                            }
                        )

                    }
                   </table>
                   {
                    modalIsDisplaying &&
                    <div className="fixed bg-[#00000080] top-0 left-0 w-full h-full">
                        <div className="w-[600px] h-[400px] bg-white rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4">

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