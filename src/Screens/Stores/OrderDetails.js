import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import PlaceholderImage from '../../../assets/PlaceholderImage';
import { formatCurrency } from '../../Utils/currency';
import products from '../../../assets/data';

const getProductImage = (productId) => {
  if (!productId) return null;
  const product = products.find(p => p.id === productId);
  return product ? product.image : null;
};

const OrderDetailsScreen = ({ route }) => {
  const { order } = route.params || {};
  if (!order) return null;

  const renderOrderItem = (item) => (
    <View key={item.id} style={styles.orderItem}>
      <View style={styles.imageContainer}>
        <PlaceholderImage 
          source={getProductImage(item.productId)}
          style={styles.productImage}
        />
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name || 'N/A'}</Text>
        <Text style={styles.itemBrand}>{item.brand || 'N/A'}</Text>
        <Text style={styles.itemQuantity}>Quantity: {item.quantity || 0}</Text>
        <Text style={styles.itemPrice}>{formatCurrency(item.price || 0)}</Text>
      </View>
    </View>
  );

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleString();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Details</Text>
        <Text style={styles.orderInfo}>Order Status: {order.status || 'pending'}</Text>
        <Text style={styles.orderInfo}>Created: {formatDate(order.createdAt)}</Text>
        <Text style={styles.orderInfo}>Total Amount: {formatCurrency(order.totalAmount || 0)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Information</Text>
        <Text style={styles.info}>Name: {order.userName || 'N/A'}</Text>
        <Text style={styles.info}>Phone: {order.userPhone || 'N/A'}</Text>
        <Text style={styles.info}>Address: {order.userAddress || 'N/A'}</Text>
      </View>

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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Items</Text>
        {(order.items || []).map(renderOrderItem)}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  section: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  orderInfo: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  orderItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  imageContainer: {
    width: 80,
    height: 80,
    marginRight: 15,
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemBrand: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginTop: 2,
  },
});

export default OrderDetailsScreen;