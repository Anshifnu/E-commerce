import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      loadUserCart(storedUser);
    }
  }, []);

  // Load cart specific to user
  const loadUserCart = async (loggedInUser) => {
    try {
      const res = await axios.get(`http://localhost:3000/users/${loggedInUser.id}`);
      const userCart = res.data.cart || [];
      setCartItems(userCart);
    } catch (err) {
      console.error("Failed to load cart:", err);
    }
  };

  const updateUserCartInDB = async (updatedCart) => {
    if (!user) return;
    try {
      await axios.patch(`http://localhost:3000/users/${user.id}`, { cart: updatedCart });
    } catch (err) {
      console.error("Failed to update user cart in DB:", err);
    }
  };

  const addToCart = async (product) => {
    if (!user) {
      alert("Please login to add items to cart.");
      return;
    }

    const existingItem = cartItems.find((item) => item.id === product.id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cartItems.map((item) =>
        item.id === product.id ? { ...item, qty: item.qty + 1 } : item
      );
    } else {
      updatedCart = [...cartItems, { ...product, qty: 1 }];
    }

    setCartItems(updatedCart);
    updateUserCartInDB(updatedCart);
  };

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    updateUserCartInDB(updatedCart);
  };

  return (
   <CartContext.Provider
  value={{
    cartItems,
    setCartItems,      
    addToCart,
    removeFromCart,
    user,
    setUser,
  }}
>

      {children}
    </CartContext.Provider>
  );
};
