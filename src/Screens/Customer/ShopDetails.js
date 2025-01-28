import React from "react";
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useRoute } from "@react-navigation/native";

const ShopDetailsScreen = ({ navigation }) => {
  const route = useRoute();
  const { shop } = route.params;

  const handleViewLocation = () => {
    navigation.navigate("MapViewScreen", {
      location: shop.location, // Pass location to the MapView screen
    });
  };

  const handleOrder = () => {
    Alert.alert("Order", "Order functionality will be implemented soon!");
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: shop.images[0] }} // Assuming shop.images is an array of image URIs
        style={styles.shopImage}
      />
      <Text style={styles.shopName}>{shop.storeName}</Text>
      <Text style={styles.ownerName}>Owner : {shop.ownerName}</Text>
      <Text style={styles.phone}>Phone : {shop.phone}</Text>
      <Text style={styles.address}>Address : {shop.address}</Text>
      <Text style={styles.description}>About Us :  {shop.storeDescription}</Text>

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
});
