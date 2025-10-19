import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import './App.css'
import ProductCard  from './components/product-card' 
import Header from './components/header'
import LoginPage from './pages/loginPage'
import RegisterPage from './pages/client/register'
import AdminPage from './pages/adminPage'
import Testing from './pages/testing'
import { Toaster } from 'react-hot-toast'
import HomePage from './pages/homePage';


function App() {
  

  return (
      <BrowserRouter>
      <Toaster position='top-right'/>

        <Routes path="/*">
            <Route path='/admin/*' element={<AdminPage/>}/>
            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/testing' element={<Testing/>}/>
            <Route path='/register' element={<RegisterPage/>}/>
            <Route path='/*' element={<HomePage/>}/>


            

        </Routes>

      
      </BrowserRouter>
  );
}

export default App
