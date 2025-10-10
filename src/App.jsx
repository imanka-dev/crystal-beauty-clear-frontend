import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import './App.css'
import ProductCard  from './components/product-card' 
import Header from './components/header'
import LoginPage from './pages/loginPage'
import AdminPage from './pages/adminPage'
import Testing from './pages/testing'
import { Toaster } from 'react-hot-toast'


function App() {
  

  return (
      <BrowserRouter>
      <Toaster position='top-right'/>

        <Routes path="/*">
            <Route path='/admin/*' element={<AdminPage/>}/>
            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/testing' element={<Testing/>}/>
            <Route path='/' element={<h1>Home</h1>}/>
            <Route path='/*' element={<h1>404 Not Found</h1>}/>
            

        </Routes>

      
      </BrowserRouter>
  );
}

export default App
