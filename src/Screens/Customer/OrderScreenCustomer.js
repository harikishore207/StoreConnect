import React, { useState, useRef } from "react";
import {
  View, Text, Image, ScrollView, TextInput,
  TouchableOpacity, StyleSheet, Animated
} from "react-native";
import { categories } from "../../../assets/data";
import { products } from "../../../assets/data";
import { useCart } from "../Customer/CartContext"; // Import useCart

const OrderScreen = ({ navigation }) => {
  const { addToCart } = useCart(); // Use addToCart from CartContext
  const [searchQuery, setSearchQuery] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current; // Animation state

  // Function to trigger the cart message animation
  const showCartMessage = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1, // Fade in
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(1000), // Keep message visible
      Animated.timing(fadeAnim, {
        toValue: 0, // Fade out
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Filter products based on search query
  const filteredProducts = products.filter((product) => {
    const matchesName = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVariant = product.variants.some((variant) =>
      variant.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      variant.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesName || matchesVariant;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Your Groceries</Text>

      {/* 🔍 Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search for products..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <ScrollView>
        {categories.map((category) => {
          const categoryProducts = filteredProducts.filter(
            (product) => product.category === category.id
          );

          if (categoryProducts.length === 0) return null; // Hide category if no products match search

          return (
            <View key={category.id} style={styles.categoryContainer}>
              <Text style={styles.categoryTitle}>{category.name}</Text>

              {/* Horizontal ScrollView for each category */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categoryProducts.map((product) => (
                  <View key={product.id} style={styles.productCard}>
                    <Text style={styles.productName}>{product.name}</Text>

                    {product.variants.map((variant, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.variantCard}
                        onPress={() => {
                          addToCart(product, variant.brand); // Use addToCart
                          showCartMessage(); // Trigger animation
                        }}
                      >
                        <Image 
                          source={variant.image || product.image} 
                          style={styles.productImage} 
                        />
                        <Text style={styles.variantText}>
                          {variant.brand} - {variant.type}
                        </Text>
                        <Text style={styles.quantityText}>({variant.quantity})</Text>
                        <Text style={styles.productPrice}>₹{variant.price}</Text>
                        <TouchableOpacity
                          style={styles.addButton}
                          onPress={() => {
                            addToCart(product, variant.brand); // Add to cart
                            showCartMessage(); // Trigger animation
                          }}
                        >
                          <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>

      {/* 🛒 Animated Cart Message */}
      <Animated.View style={[styles.cartMessage, { opacity: fadeAnim }]}>
        <Text style={styles.cartMessageText}>Item Added to Cart</Text>
      </Animated.View>

      {/* 🛒 View Cart Button */}
      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => navigation.navigate("Cart")}
      >
        <Text style={styles.cartButtonText}>View Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#f7f7f7",
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  searchBar: {
    height: 45,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  productCard: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginRight: 10,
  },
  variantCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    width: 160,
    alignItems: "center",
  },
  productImage: {
    width: "65%",
    height: 100,
    borderRadius: 10,
    marginBottom: 5,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
    textAlign: "center",
  },
  variantText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#444",
    textAlign: "center",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginVertical: 5,
  },
  addButton: {
    backgroundColor: "#28a745",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 5,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  cartMessage: {
    position: "absolute",
    bottom: 80,
    left: "30%",
    backgroundColor: "#28a745",
    padding: 10,
    borderRadius: 5,
    opacity: 0, // Initially hidden
  },
  cartMessageText: {
    color: "white",
    fontWeight: "bold",
  },
  cartButton: {
    backgroundColor: "#ff5722",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  cartButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OrderScreen;
