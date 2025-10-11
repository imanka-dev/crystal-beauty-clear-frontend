import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


export default function LoginPage() {

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const  navigate =useNavigate()


  function handleLogin(){
      console.log("Email:",email)
      console.log("Password:",password)
     

      axios.post(import.meta.env.VITE_URL+"/api/user/login", {
  email,
  password
})
.then((response) => {
  // Check if backend indicates failure
  if (response.data.success === false || response.data.message === "Invalid email") {
    console.log("Login failed", response.data);
    toast.error(error.response.data.message||"Login failed");
  } else {
    console.log("Login successful", response.data);
    toast.success("Login successful");
    localStorage.setItem("user",JSON.stringify(response.data));
     
    const user = response.data.user;
    if(user.role==="admin"){
        navigate("/admin")
    }else{
        navigate("/")
    }
  }
})
.catch((error) => {
  if (error.response) {
    console.log("Login failed", error.response.data);
    toast.error(error.response.data.message||"Login failed");
  } else {
    console.log("Error:", error.message);
    toast.error("An error occurred. Please try again.");
  }
});

    


      

      console.log("Login button clicked"); 
  }


  return (
    <div className="w-full bg-red-900 h-screen bg-[url(/login-bg.jpg)] bg-cover bg-center flex">

        <div className=" w-[50%] h-full">

        </div>
        <div className=" w-[50%] h-full flex justify-center items-center">
            <div className="w-[450px] h-[600px] backdrop-blur-xl shadow-xl rounded-xl flex flex-col justify-center items-center">
                <input onChange={
                  (e)=>{
                    setEmail(e.target.value)
                  }
                } className="w-[400px] h-[50px] border border-white rounded-xl text-center m-[5px]" type="email" placeholder="email" />
                <input onChange={
                  (e)=>{
                    setPassword(e.target.value);
                  }
                } className="w-[400px] h-[50px] border border-white rounded-xl text-center m-[5px] " type="password" placeholder="password" />
                <button onClick={handleLogin} className="w-[400px] h-[50px] bg-green-500 text-white rounded-xl cursor-pointer">Login</button>
            </div>
        </div>
    </div>
  )
}
