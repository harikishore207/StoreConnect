import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./../../Utils/firebase";  // Ensure correct Firebase config

const ShopDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { shopId } = route.params || {}; // Prevent undefined errors
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shopId) {
      console.error("No shopId provided!");
      setLoading(false);
      return;
    }

    const fetchShopDetails = async () => {
      try {
        const docRef = doc(db, "retailers", shopId);
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
          const data = docSnap.data();
         // console.log("Fetched shop data:", data); // Log fetched data
          setShop(data);
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching shop details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopDetails();
  }, [shopId]);

  const handleViewLocation = () => {
    if (!shop.location || !shop.location.latitude || !shop.location.longitude) {
      Alert.alert("Error", "Location data is missing or invalid.");
      return;
    }
    navigation.navigate("MapViewScreen", { location: shop.location });
  };

  const handleOrder = () => {
    Alert.alert("Order", "Order functionality will be implemented soon!");
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />;
  }

  if (!shop) {
    return <Text style={styles.errorText}>Shop details not found.</Text>;
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: shop.images[0] }}
        style={styles.shopImage}
      />
      <Text style={styles.shopName}>{shop.storeName || "No Name"}</Text>
      <Text style={styles.ownerName}>Owner: {shop.ownerName || "N/A"}</Text>
      <Text style={styles.phone}>Phone: {shop.phone || "N/A"}</Text>
      <Text style={styles.address}>Address: {shop.address || "N/A"}</Text>
      <Text style={styles.description}>About Us: {shop.storeDescription || "No description available"}</Text>

      <TouchableOpacity style={styles.button} onPress={handleViewLocation}>
        <Text style={styles.buttonText}>View Location</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.orderButton]} onPress={handleOrder}>
        <Text style={styles.buttonText}>Order</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ShopDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f7f7f7",
  },
  shopImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  shopName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  ownerName: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },
  phone: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },
  address: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  orderButton: {
    backgroundColor: "#28A745",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    textAlign: "center",
    fontSize: 18,
    color: "red",
  },
});