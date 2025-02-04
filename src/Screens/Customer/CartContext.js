import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create Context
export const CartContext = createContext();

// Custom Hook to Use Cart
export const useCart = () => useContext(CartContext);

// Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart items from AsyncStorage on initial render
  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem('cart');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error("Failed to load cart:", error);
      }
    };

    loadCart();
  }, []);

  // Save cart items to AsyncStorage whenever cartItems change
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
      } catch (error) {
        console.error("Failed to save cart:", error);
      }
    };

    saveCart();
  }, [cartItems]);

  // Add Item to Cart
  const addToCart = (product, brand) => {
  //  console.log("Adding to cart:", product.name, brand); // Debug log
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === `${product.id}-${brand}`);
      if (existingItem) {
        return prev.map((item) =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + 1, price: item.unitPrice * (item.quantity + 1) }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: `${product.id}-${brand}`,
            name: product.name,
            brand,
            quantity: 1,
            image: product.variants.find((v) => v.brand === brand)?.image,
            price: product.variants.find((v) => v.brand === brand)?.price,
            unitPrice: product.variants.find((v) => v.brand === brand)?.price,
          },
        ];
      }
    });
  };

  // Remove Item Completely
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Change Quantity
  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta), price: item.unitPrice * Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};