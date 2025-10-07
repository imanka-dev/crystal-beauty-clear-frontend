import { useState } from 'react'
import './App.css'
import ProductCard  from './components/product-card' 
import Header from './components/header'


function App() {
  

  return (
  <div className='w-full h-screen bg-pink-200'>
    <div className='w-[500px] flex flex-col items-center h-[500px] bg-gray-200 relative'>
      <div className='w-[90px] h-[90px] bg-red-500'>
      </div>
      <div className='w-[90px] h-[90px] bg-yellow-500 absolute right-[50px] top-[50px]'>
      </div>
      <div className='w-[90px] h-[90px] bg-green-500'>
      </div>
      <div className='w-[90px] h-[90px] bg-blue-500 fixed right-[50px] bottom-[50px]'>
      </div>
    </div>
  </div>
  )
}

export default App
