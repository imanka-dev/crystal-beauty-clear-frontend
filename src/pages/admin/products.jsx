import axios from "axios"
import { useEffect, useState } from "react"

export default function AdminProductsPage(){

    const [products,setProducts] = useState([])
    useEffect(
        ()=>{
        axios.get(import.meta.env.VITE_URL+"/api/product").then(
            (response)=>{
            console.log(response.data)
            setProducts(response.data)
            }
        )
    },
    []

    )


        return(
            <div className="w-full h-full rounded-lg">

                <table className="w-full">
                    <thead>
                        <tr>
                           
                            <th>Product ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Labeled Price</th>
                            <th>Stock</th>
                            
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>

                </table>

                {
                   products.map(
                    (product,index)=>{
                        console.log("mapping"+ product.productId)
                        
                        return(
                            <div key={index} className="w-full h-[100px] bg-gray-300 flex items-center justify-between p-2 m-2 rounded-lg shadow-lg">
                                

                            </div>
                            
                        )
                    }
                   )
                }


            </div>
        )





}