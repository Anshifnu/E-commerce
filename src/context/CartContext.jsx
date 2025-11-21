import { createContext, useContext, useState, useEffect } from "react";
import api from "../API/axios";
import { useUser } from "./UserContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useUser();
  const [cartItems, setCartItems] = useState([]);

  // 🔄 Load all cart items
  const loadCart = async () => {
    if (!user) return;
    try {
      const res = await api.get("cart/");
      const mappedCart = res.data.map((item) => ({
        cartItemId: item.id,
        qty: item.qty,
        product: {
          id: item.product.id,
          name: item.product.name,
          price: parseFloat(item.product.price),
          description: item.product.description,
          brand: item.product.brand, // brand is string, not object
          stock: item.product.stock,
          images: item.product.images || [], // keep array
        },
      }));
      setCartItems(mappedCart);
    } catch (err) {
      console.error("Failed to load cart:", err);
      setCartItems([]);
    }
  };

  useEffect(() => {
    loadCart();
  }, [user]);

 // 🛒 Add to cart
const addToCart = async (product) => {
  try {
    const existingItem = cartItems.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      const newQty = existingItem.qty + 1;

      // ⚠️ limit 10 per item
      if (newQty > 10) {
        alert("You can't add more than 10 of this item.");
        return;
      }

      const res = await api.patch(`cart/${existingItem.cartItemId}/`, {
        qty: newQty,
      });
      setCartItems((prev) =>
        prev.map((item) =>
          item.cartItemId === existingItem.cartItemId
            ? { ...item, qty: res.data.qty }
            : item
        )
      );
    } else {
      const res = await api.post("cart/", {
        product_id: product.id,
        qty: 1,
      });

      const newItem = {
        cartItemId: res.data.id,
        qty: res.data.qty,
        product: {
          id: res.data.product.id,
          name: res.data.product.name,
          price: parseFloat(res.data.product.price),
          description: res.data.product.description,
          brand: res.data.product.brand,
          stock: res.data.product.stock,
          images: res.data.product.images || [],
        },
      };

      setCartItems((prev) => [...prev, newItem]);
    }
  } catch (err) {
    console.error("Failed to add/update cart:", err);
  }
};

// ✏️ Update quantity
const updateQuantity = async (cartItemId, qty) => {
  try {
    if (qty < 1) {
      alert("You can't decrease below 1.");
      return;
    }
    if (qty > 10) {
      alert("You can't add more than 10 of this item.");
      return;
    }

    const res = await api.patch(`cart/${cartItemId}/`, { qty });
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, qty: res.data.qty }
          : item
      )
    );
  } catch (err) {
    console.error("Failed to update quantity:", err);
  }
};


const removeFromCart = async (cartItemId) => {
  try {
    await api.delete(`cart/${cartItemId}/`);
    setCartItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  } catch (err) {
    console.error("Failed to remove from cart:", err);
  }
};

  // 🧮 Totals
  const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.qty * item.product.price,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalQty,
        totalPrice,
        reloadCart: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
