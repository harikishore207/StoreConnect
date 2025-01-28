import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, Image, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const groceries = [
  { id: '1', name: 'Apple', price: 50, image: 'https://via.placeholder.com/50' },
  { id: '2', name: 'Banana', price: 20, image: 'https://via.placeholder.com/50' },
  { id: '3', name: 'Carrot', price: 30, image: 'https://via.placeholder.com/50' },
  { id: '4', name: 'Tomato', price: 40, image: 'https://via.placeholder.com/50' },
];

const OrderScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);

  const handleSelectItem = (item) => {
    const exists = selectedItems.find((i) => i.id === item.id);
    if (!exists) {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };

  const filteredGroceries = groceries.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for items"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredGroceries}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleSelectItem(item)}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>₹{item.price}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button}>
          <MaterialIcons name="format-list-bulleted" size={24} color="white" />
          <Text style={styles.buttonText}>Order by List</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Ionicons name="mic" size={24} color="white" />
          <Text style={styles.buttonText}>Order by Voice</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  searchBar: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    marginHorizontal: 10,
    marginBottom: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  price: {
    fontSize: 16,
    color: '#888',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#007bff',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  buttonText: {
    color: 'white',
    marginLeft: 5,
  },
});

export default OrderScreen;
