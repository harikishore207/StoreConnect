import React, { useState } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { useCart } from "../Customer/CartContext";
import { useNavigation } from "@react-navigation/native";

const CartScreen = () => {
  const { cartItems, removeFromCart } = useCart();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleConfirmItems = () => {
    setIsModalVisible(false);
    navigation.navigate("SelectShopScreen");
  };

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity 
        style={styles.exitButton} 
        onPress={() => navigation.goBack()}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <Text style={styles.exitButtonText}>❌</Text>
      </TouchableOpacity> */}
      {cartItems.length > 0 ? (
        <FlatList
          data={cartItems}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={item.image} style={styles.image} />
              <View style={styles.details}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>₹{item.price}</Text>
                <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
              </View>
              <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                <Text style={styles.removeButton}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.emptyText}>Your cart is empty!</Text>
      )}

      {cartItems.length > 0 && (
        <TouchableOpacity style={styles.checkoutButton} onPress={() => setIsModalVisible(true)}>
          <Text style={styles.checkoutButtonText}>Confirm Items</Text>
        </TouchableOpacity>
      )}

      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalExitButton} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.exitButtonText}>❌</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Confirm Your Items</Text>
            <FlatList
              data={cartItems}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Image source={item.image} style={styles.image} />
                  <View style={styles.details}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.price}>₹{item.price}</Text>
                    <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
                  </View>
                  {/* <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                    <Text style={styles.removeButton}>❌</Text>
                  </TouchableOpacity> */}
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
            <TouchableOpacity style={styles.checkoutButton} onPress={handleConfirmItems}>
              <Text style={styles.checkoutButtonText}>Proceed</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f7", position: "relative" },
  exitButton: { position: "absolute", top: 10, left: 10, padding: 10, zIndex: 10 },
  modalExitButton: { alignSelf: "flex-end", padding: 20 },
  exitButtonText: { fontSize: 24, color: "red" },
  card: { flexDirection: "row", alignItems: "center", padding: 10, backgroundColor: "white", margin: 10, borderRadius: 8 },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  details: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold" },
  price: { fontSize: 16, color: "#333" },
  quantity: { fontSize: 14, color: "#666" },
  removeButton: { fontSize: 18, color: "red", marginLeft: 10 },
  emptyText: { textAlign: "center", fontSize: 18, color: "#888", marginTop: 50 },
  checkoutButton: { backgroundColor: "#ff5722", padding: 15, borderRadius: 10, alignItems: "center", margin: 20 },
  checkoutButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "white", padding: 20, borderRadius: 10, width: "90%" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" ,bottom:5 ,marginRight:22 },
});

export default CartScreen;
