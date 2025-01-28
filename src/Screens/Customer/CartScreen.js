import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';

const CartScreen = ({ route }) => {
  const [cartItems, setCartItems] = useState(route.params?.cartItems || []);

  const handleQuantityChange = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.addressBar}>
        <Text style={styles.addressText}>Deliver to: 123 Main Street</Text>
        <TouchableOpacity>
          <Text style={styles.changeButton}>Change</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={cartItems}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>₹{item.price}</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity onPress={() => handleQuantityChange(item.id, -1)}>
                <Text style={styles.controlButton}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => handleQuantityChange(item.id, 1)}>
                <Text style={styles.controlButton}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  addressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  addressText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  changeButton: {
    fontSize: 16,
    color: '#007bff',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginBottom: 5,
    borderRadius: 8,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    flex: 1,
  },
  price: {
    fontSize: 16,
    color: '#888',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 5,
  },
});

export default CartScreen;
