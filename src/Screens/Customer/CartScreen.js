import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Modal, TextInput } from "react-native";
import { useCart } from "../Customer/CartContext";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const CartScreen = () => {
  const { cartItems } = useCart();
  const [shops, setShops] = useState([]);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [selectedShop, setSelectedShop] = useState(null);
  const [deliveryType, setDeliveryType] = useState(null);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const db = getFirestore(); 
  const auth = getAuth();

  const fetchShops = async () => {
    try {
      const shopsRef = collection(db, "shops");
      const snapshot = await getDocs(shopsRef);

      if (snapshot.empty) {
        console.log("⚠️ No shops found in Firestore.");
        return;
      }

      const shopsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setShops(shopsData);
      console.log("✅ Shops Fetched:", shopsData);
    } catch (error) {
      console.error("❌ Error fetching shops:", error);
    }
  };

  const fetchCustomerDetails = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log("⚠️ No authenticated user found.");
        return;
      }

      const customerRef = collection(db, "customers");
      const q = query(customerRef, where("userId", "==", user.uid));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log("⚠️ No customer details found.");
        return;
      }  

      const customerData = snapshot.docs[0].data();
      setCustomerDetails(customerData);
      console.log("✅ Customer Details:", customerData);
    } catch (error) {
      console.error("❌ Error fetching customer details:", error);
    }
  };

  useEffect(() => {
    fetchShops();
    fetchCustomerDetails();
  }, []);


  const handleCheckout = () => {
    if (checkoutStep === 0) {
      setIsModalVisible(true);
      setCheckoutStep(1);
    } else if (checkoutStep === 1) {
      setCheckoutStep(2);
    } else if (checkoutStep === 2) {
      setCheckoutStep(3);
    } else if (checkoutStep === 3) {
      setIsModalVisible(false);
      confirmOrder();
    }
  };

  const confirmOrder = async () => {
    const orderDetails = {
      cartItems,
      selectedShop,
      deliveryType,
      pickupDate,
      pickupTime,
      deliveryAddress,
      phoneNumber,
      customerDetails,
      status: "Pending",
      timestamp: new Date(),
    };

    // Save order details to Firestore
    await firestore.collection("orders").add(orderDetails);

    // Navigate to MyOrders screen or show a success message
    // navigation.navigate('MyOrders');
  };

  const renderCheckoutModal = () => {
    return (
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {checkoutStep === 1 && (
              <>
                <Text style={styles.modalTitle}>Confirm Your Items</Text>
                <FlatList
                  data={cartItems}
                  renderItem={({ item }) => (
                    <View style={styles.card}>
                      <Image source={item.image} style={styles.image} />
                      <View style={styles.details}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.brandType}>{item.brand}</Text>
                        <Text style={styles.price}>₹{item.price}</Text>
                        <Text style={styles.quantity}>Quantity: {item.quantity}</Text>
                      </View>
                    </View>
                  )}
                  keyExtractor={(item) => item.id}
                />
                <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                  <Text style={styles.checkoutButtonText}>Next</Text>
                </TouchableOpacity>
              </>
            )}

            {checkoutStep === 2 && (
              <>
                <Text style={styles.modalTitle}>Select a Shop</Text>
                <FlatList
                  data={shops}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[styles.shopItem, selectedShop?.id === item.id && styles.selectedShop]}
                      onPress={() => setSelectedShop(item)}
                    >
                      <Text style={styles.shopName}>{item.name}</Text>
                      <Text style={styles.shopLocation}>{item.location}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.id.toString()}
                />
                <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                  <Text style={styles.checkoutButtonText}>Next</Text>
                </TouchableOpacity>
              </>
            )}

            {checkoutStep === 3 && (
              <>
                <Text style={styles.modalTitle}>Choose Delivery Type</Text>
                <TouchableOpacity
                  style={[styles.deliveryOption, deliveryType === "pickup" && styles.selectedDelivery]}
                  onPress={() => setDeliveryType("pickup")}
                >
                  <Text style={styles.deliveryOptionText}>Pickup</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.deliveryOption, deliveryType === "door" && styles.selectedDelivery]}
                  onPress={() => setDeliveryType("door")}
                >
                  <Text style={styles.deliveryOptionText}>Door Delivery</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                  <Text style={styles.checkoutButtonText}>Next</Text>
                </TouchableOpacity>
              </>
            )}

            {checkoutStep === 4 && (
              <>
                {deliveryType === "pickup" ? (
                  <>
                    <Text style={styles.modalTitle}>Pickup Details</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Pickup Date (Optional)"
                      value={pickupDate}
                      onChangeText={setPickupDate}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Pickup Time (Optional)"
                      value={pickupTime}
                      onChangeText={setPickupTime}
                    />
                  </>
                ) : (
                  <>
                    <Text style={styles.modalTitle}>Delivery Details</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Delivery Address"
                      value={deliveryAddress}
                      onChangeText={setDeliveryAddress}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Phone Number"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                    />
                  </>
                )}
                <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                  <Text style={styles.checkoutButtonText}>Confirm Order</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {cartItems.length > 0 ? (
        <FlatList
          data={cartItems}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={item.image} style={styles.image} />
              <View style={styles.details}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.brandType}>{item.brand}</Text>
                <Text style={styles.price}>₹{item.price}</Text>

                <View style={styles.quantityControls}>
                  <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
                    <Text style={styles.controlButton}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
                    <Text style={styles.controlButton}>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                    <Text style={styles.removeButton}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.emptyText}>Your cart is empty!</Text>
      )}

      {cartItems.length > 0 && (
        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      )}

      {renderCheckoutModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f7" },
  card: { flexDirection: "row", alignItems: "center", padding: 10, backgroundColor: "white", marginHorizontal: 10, marginBottom: 5, borderRadius: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  details: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold" },
  brandType: { fontSize: 14, color: "#666" },
  price: { fontSize: 16, color: "#333", marginVertical: 5 },
  quantityControls: { flexDirection: "row", alignItems: "center" },
  controlButton: { fontSize: 18, fontWeight: "bold", paddingHorizontal: 10 },
  removeButton: { fontSize: 18, color: "red", marginLeft: 160 },
  quantity: { fontSize: 16, marginHorizontal: 5 },
  emptyText: { textAlign: "center", fontSize: 18, color: "#888", marginTop: 50 },
  checkoutButton: { backgroundColor: "#ff5722", padding: 15, borderRadius: 10, alignItems: "center", marginHorizontal: 20, marginTop: 20 },
  checkoutButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "white", padding: 20, borderRadius: 10, width: "90%" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  shopItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  selectedShop: { backgroundColor: "#e0f7fa" },
  shopName: { fontSize: 16, fontWeight: "bold" },
  shopLocation: { fontSize: 14, color: "#666" },
  deliveryOption: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  selectedDelivery: { backgroundColor: "#e0f7fa" },
  deliveryOptionText: { fontSize: 16 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginBottom: 10 },
});

export default CartScreen;