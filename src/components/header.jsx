import { Link } from "react-router-dom";
import { BsCart4 } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";

export default function Header(){
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return(
  <header className="h-[70px] w-full flex justify-start items-center bg-gray-200 relative">
    <GiHamburgerMenu className="lg:hidden text-3xl mx-5 text-[var(--color-accent)] " onClick={()=>{setIsMenuOpen(true)}}/>
      <div className="hidden lg:flex w-[500px] h-full flex items-center justify-evenly text-[var(--color-accent)] text-xl">
      <Link to="/">Home</Link>
      <Link to="/products">Products</Link>
      <Link to="/contact">Contact us</Link>
      <Link to="/reviews">Reviews</Link>
      <Link to="/cart" className="absolute right-[30px] text-3xl"><BsCart4 /></Link>
      </div>
      {
        isMenuOpen&&(
        <div className="lg:hidden fixed top-0 left-0 bg-[#00000060] w-full h-screen flex z-[9999]"> 
        <div className="lg:hidden bg-white z-[10000] w-[250px] h-full p-5 flex flex-col text-[var(--color-accent)] text-xl animate-slide-in">
          <div className="w-full h-[70px] flex justify-end items-center">
            <button onClick={()=>{setIsMenuOpen(false)}} className="text-3xl font-bold">&times;</button>
          </div>
          <Link onClick={()=>{setIsMenuOpen(false)}} to="/" className="my-5">Home</Link>
          <Link onClick={()=>{setIsMenuOpen(false)}} to="/products" className="my-5">Products</Link>
          <Link onClick={()=>{setIsMenuOpen(false)}} to="/contact" className="my-5">Contact us</Link>
          <Link onClick={()=>{setIsMenuOpen(false)}} to="/reviews" className="my-5">Reviews</Link>
          <Link onClick={()=>{setIsMenuOpen(false)}} to="/cart" className="my-5 flex items-center"><BsCart4 className="mr-2"/>Cart</Link>
        </div>
        
        </div> 
      
      )}
      

     
    </header> 
  )
}
