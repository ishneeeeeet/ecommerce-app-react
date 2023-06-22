import React, { createContext, useEffect, useState } from "react";

// Create the CartContext
export const CartContext = createContext();

// Create the CartProvider
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Add item to cart
  const addToCart = (item) => {
    const itemInCart = cart.find((cartItem) => cartItem.id === item.id);

    if (itemInCart) {
      // Item already exists in the cart, update the quantity
      setCart((prevCart) =>
        prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      // Item does not exist in the cart, add a new item
      setCart((prevCart) => [
        ...prevCart,
        { ...item, quantity: 1 }
      ]);
    }
    console.log(cart);
  };

  
  const increaseQuantity = (productId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) => {
        if (item.id === productId) {
          return { ...item, quantity: item.quantity + 1 }; // Increase the quantity by 1
        }
        return item;
      });
      return updatedCart;
    });
  };
  const decreaseQuantity = (productId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) => {
        if (item.id === productId) {
          return { ...item, quantity: item.quantity - 1 }; // Increase the quantity by 1
        }
        return item;
      });
      return updatedCart;
    });
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.id !== itemId)
    );
  };

  // Clear the cart
  const clearCart = () => {
    setCart([]);
  };

  // Save cart items to local storage
  const saveCartToLocalStorage = (cartItems) => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  };

  // Get cart items from local storage
  const getCartFromLocalStorage = () => {
    const cartItems = localStorage.getItem("cart");
    return cartItems ? JSON.parse(cartItems) : [];
  };

  // Initialize cart state from local storage on component mount
  useEffect(() => {
    const storedCart = getCartFromLocalStorage();
    if (storedCart.length > 0) {
      setCart(storedCart);
    }
  }, []);

  // Synchronize cart state with local storage on state change
  useEffect(() => {
    saveCartToLocalStorage(cart);
  }, [cart]);

  // Value object to be provided to the components
  const cartContextValue = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity
  };

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
};
