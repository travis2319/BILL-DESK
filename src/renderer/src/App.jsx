// import React from 'react'
import { HashRouter  as Router, Routes, Route } from "react-router";
import Home from './pages/Home.jsx';
import Logs from "./pages/Logs.jsx";
import MenuItems from "./pages/MenuItems.jsx";
// import Settings from "./pages/Settings.jsx";
import {Login,Register} from './components/index.js'

const App = () => {
  
  return (
    <Router>
      <Routes>
         <Route path='/' element={<Login  key="login"/>}/>
         <Route path='/register' element={<Register  key="register"/>}/>
         <Route path="/home" element={<Home/>} />
         <Route path="/logs" element={<Logs />} />
         <Route path="/menu" element={<MenuItems />} />
         {/* <Route path="/settings" element={<Settings />} /> */}
      </Routes>
  </Router>
  )
}

export default App

// import React from 'react'

// const App = () => {
//   return (
//     <div className='text-green-800 font-bold'>App</div>
//   )
// }

// export default App