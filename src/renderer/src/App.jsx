// import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router";
import Home from './pages/Home.jsx';
import Logs from "./pages/Logs.jsx";
import MenuItems from "./pages/MenuItems.jsx";
import {Login,Register} from './components/index.js'
const App = () => {
  
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path="/home" element={<Home />} />
      <Route path="/logs" element={<Logs />} />
      <Route path="/menu" element={<MenuItems />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App