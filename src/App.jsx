//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import ProductList from './lista_productos/ProductList'
import ProductManagement from './lista_productos/ProductManagement'

function App() {
  //const [count, setCount] = useState(0)

  return (
    <>
      <ProductManagement/>
      <ProductList/>
    </>
  )
}

export default App
