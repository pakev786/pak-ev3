import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  // 1. Initialize User from LocalStorage
  const [user, setUser] = useState(() => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error("Failed to parse user info", error);
      return null;
    }
  });

  // 2. Initialize Cart from LocalStorage (Lazy Initialization - FIX for refresh issue)
  const [cartItems, setCartItems] = useState(() => {
    try {
      // Re-read user info to ensure we get the correct key immediately
      const userInfoStr = localStorage.getItem('userInfo');
      const userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
      
      if (userInfo && userInfo.id) {
        const savedCart = localStorage.getItem(`cart_${userInfo.id}`);
        return savedCart ? JSON.parse(savedCart) : [];
      }
    } catch (error) {
      console.error("Failed to load initial cart", error);
    }
    return [];
  });

  // 3. Effect to SWITCH cart when user changes (e.g. login/logout)
  // This handles switching accounts without a full page reload.
  useEffect(() => {
    if (user && user.id) {
      const savedCart = localStorage.getItem(`cart_${user.id}`);
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error("Failed to parse user cart", error);
          setCartItems([]);
        }
      } else {
        // Only reset if we truly changed users and no cart exists for the new one
        // (The lazy init handles the refresh case, this handles the login case)
        setCartItems([]); 
      }
    } else {
      setCartItems([]); // Clear cart if logged out
    }
  }, [user]);

  // 4. Save Cart for Specific User whenever `cartItems` changes
  useEffect(() => {
    if (user && user.id) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  // --- Auth Helpers ---
  const loginUser = (userData) => {
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  // --- Cart Actions ---
  const addToCart = (product) => {
    if (!user) return; 
    
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider
      value={{
        user,
        loginUser,
        logoutUser,
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
        getCartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};