import Router from './Router.jsx'
import { CartProvider } from './context/CartContext.jsx'
import {UserProvider} from './context/UserContext.jsx'



function App() {
  

  return (
    <UserProvider>
    <CartProvider>
      <Router />
    </CartProvider>
    </UserProvider>
  )
}

export default App
