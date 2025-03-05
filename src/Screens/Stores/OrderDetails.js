import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, FlatList 
} from 'react-native';
import { formatCurrency } from '../../Utils/currency';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { db, app } from "../../Utils/firebase";

const OrderDetailsScreen = ({ route, navigation }) => {
  const order = route?.params?.order ?? null;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]); // Keep if needed

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString();
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "retailers"));
      const shopList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setShops(shopList);

      if (order?.shopId) {
        const otherShops = shopList.filter(shop => shop.id !== order.shopId);
        setFilteredShops(otherShops);
      } else {
        setFilteredShops(shopList);
      }
    } catch (error) {
      console.error("Error fetching shops: ", error);
    }
  };

  const filterShops = () => {
    if (order && order.shopId) {
      const otherShops = shops.filter(shop => shop.id !== order.shopId);
      setFilteredShops(otherShops);
    }
  };

  if (!order) {
    return (
      <View style={styles.centeredView}>
        <Text>No order details available.</Text>
      </View>
    );
  }

  const confirmTransfer = () => {
    if (!selectedShop) {
      Alert.alert('Error', 'Please select a shop before confirming.');
      return;
    }
    console.log("Confirmed Transfer to:", selectedShop);
    Alert.alert('Success', `Order transferred to ${selectedShop.name || 'Unknown Shop'}!`);
    setModalVisible(false);
  };

  useEffect(() => {
    if (modalVisible) {
      filterShops();
    }
  }, [modalVisible, shops]);

  return (
    <ScrollView style={styles.container}>
      {/* Order Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Details</Text>
        <Text style={styles.orderInfo}>Order Status: {order.status || 'Pending'}</Text>
        <Text style={styles.orderInfo}>Created: {formatDate(order.createdAt)}</Text>
        <Text style={styles.orderInfo}>Total Amount: {formatCurrency(order.totalAmount || 0)}</Text>
      </View>

      {/* Customer Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Information</Text>
        <Text style={styles.info}>Name: {order.userName || 'N/A'}</Text>
        <Text style={styles.info}>Phone: {order.userPhone || 'N/A'}</Text>
        <Text style={styles.info}>Address: {order.userAddress || 'N/A'}</Text>
      </View>

      {/* Order Type: Pickup / Delivery */}
      {order.deliveryType === 'pickup' ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup Details</Text>
          <Text style={styles.info}>Date: {order.pickupDate || 'N/A'}</Text>
          <Text style={styles.info}>Time: {order.pickupTime || 'N/A'}</Text>
        </View>
      ) : (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          <Text style={styles.info}>Address: {order.deliveryAddress || 'N/A'}</Text>
          <Text style={styles.info}>Phone: {order.phoneNo || 'N/A'}</Text>
        </View>
      )}

      {/* Order Items */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        {order.items.map((item, index) => (
          <View key={index} style={styles.orderItem}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemBrand}>{item.brand}</Text>
            <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
            <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
          </View>
        ))}
      </View>

      {/* Compare Inventory Button */}
      <TouchableOpacity style={styles.compareButton} onPress={() => Alert.alert('Compare Inventory', 'Feature coming soon!')}>
        <Text style={styles.buttonText}>Compare with Inventory</Text>
      </TouchableOpacity>

      {/* Transfer Order Button */}
      <TouchableOpacity style={styles.transferButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Transfer Order</Text>
      </TouchableOpacity>

      {/* Modal for Selecting Nearby Shops */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Shop</Text>
            <FlatList 
              data={filteredShops}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.shopItem,
                    selectedShop?.id === item.id && styles.selectedShop
                  ]}
                  onPress={() => {
                    setSelectedShop(item);
                   // console.log("Selected Shop:", item); // Debugging log
                  }}
                >
                  <Text style={styles.shopName}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.confirmButton} onPress={confirmTransfer}>
              <Text style={styles.buttonText}>Confirm Transfer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  section: { backgroundColor: 'white', margin: 10, padding: 15, borderRadius: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  orderInfo: { fontSize: 16, marginBottom: 5, color: '#666' },
  info: { fontSize: 16, marginBottom: 5, color: '#666' },
  orderItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 10 },
  itemName: { fontSize: 16, fontWeight: 'bold' },
  itemBrand: { fontSize: 14, color: '#666' },
  itemQuantity: { fontSize: 14, color: '#666' },
  itemPrice: { fontSize: 16, fontWeight: 'bold', color: '#2e7d32' },
  compareButton: { backgroundColor: '#ff9800', margin: 10, padding: 12, borderRadius: 8 },
  transferButton: { backgroundColor: '#2e7d32', margin: 10, padding: 12, borderRadius: 8 },
  buttonText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  shopItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  selectedShop: { backgroundColor: '#2e7d32', color: 'white' },
  shopName: { fontSize: 16, textAlign: 'center' },
  confirmButton: { backgroundColor: '#2e7d32', padding: 12, borderRadius: 8, marginTop: 10 },
  cancelButton: { marginTop: 10, padding: 10 },
  cancelText: { color: 'red', textAlign: 'center', fontSize: 16 }
});

export default OrderDetailsScreen;
