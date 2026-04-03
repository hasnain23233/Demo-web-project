import { useState } from 'react'
import {Route, Routes } from 'react-router-dom'
import { Navbar, Footer } from "./components";
import './App.css'
import { Home, Products} from './views'
import About from './views/About/About'

function App() {


  return ( 
    <>
    
    <Navbar/>
    <Routes>
      <Route path='/'element={<Home/>} />
      <Route path='/about'element={<About/>} />
      <Route path='/prodcuts'element={<Products/>} />
    </Routes>
    <Footer/> 
    </>

  )
}

export default App
