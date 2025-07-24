import Router from './Router.jsx'
import { CartProvider } from './context/CartContext.jsx'



function App() {
  

  return (
   <CartProvider>
      <Router />
    </CartProvider>
  )
}

export default App
