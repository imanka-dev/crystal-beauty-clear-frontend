import { useState } from "react";

export default function Testing(){
    const [number,setNumber] = useState(0)
    const [status,setStatus] = useState("pending")

    function increment(){
        let newValue = number +1;
        setNumber(newValue)
    }
    
    function decrement(){
        let newValue = number -1;
        setNumber(newValue)
    }

    return(
        <div className="w-full h-screen flex flex-col justify-center items-center">
           <span className="text-3x1 font-bold">{number}</span>
           <div className="w-full bg-red-900 flex justify-center items-center ">
            <button onClick={increment} className="bg-blue-500 text-white p-2 rounded-lg w-[60px] cursor-pointer">+</button>
            <button onClick={decrement} className="bg-blue-500 text-white p-2 rounded-lg w-[60px] cursor-pointer">-</button>
           </div>
           <span className="text-3x1 font-bold">{status}</span>
           <div className="w-full bg-red-900 flex justify-center items-center ">
            <button onClick={()=>{
                setStatus ("Passed")
            }} className="bg-blue-500 text-white p-2 rounded-lg w-[60px] cursor-pointer">Passed</button>
            <button onClick={()=>{
                setStatus ("Failed")
            }} className="bg-blue-500 text-white p-2 rounded-lg w-[60px] cursor-pointer">Failed</button>
           </div>
        </div>
    )
}