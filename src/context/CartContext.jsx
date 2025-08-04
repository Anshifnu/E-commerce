import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { URL } from "../apiEndpoint";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const isAuthenticated = !!user;

  
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      loadUserCart(storedUser);
    }
  }, []);

  
  const loadUserCart = async (loggedInUser) => {
    try {
      const res = await axios.get(`${URL}/users/${loggedInUser.id}`);
      const userCart = res.data.cart || [];
      setCartItems(userCart);
    } catch (err) {
      console.error("Failed to load cart:", err);
    }
  };

  const updateUserCartInDB = async (updatedCart) => {
    if (!user) return;
    try {
      await axios.patch(`${URL}/users/${user.id}`, { cart: updatedCart });
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
      if (existingItem.qty >= 10) {
        alert("you can't add more than 10");
        return;
      }

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

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    loadUserCart(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setCartItems([]);
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
        // isAuthenticated,
        // login,
        // logout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
