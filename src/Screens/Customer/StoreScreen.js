import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Install with `expo install @expo/vector-icons`

const CustomerShopsScreen = () => {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, "retailers"));
        const fetchedShops = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setShops(fetchedShops);
        setFilteredShops(fetchedShops); // Initialize filteredShops with all shops
      } catch (error) {
        console.error("Error fetching shops: ", error);
        Alert.alert("Error", "Failed to fetch shops. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = shops.filter((shop) =>
      shop.storeName.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredShops(filtered);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (shops.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noShopsText}>No shops found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Nearby Shops</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          placeholder="Search by shop name"
          value={searchText}
          onChangeText={handleSearch}
          style={styles.searchInput}
        />
      </View>

      {/* Shops List */}
      <FlatList
        data={filteredShops}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.images[0] }} style={styles.image} />
            <Text style={styles.cardTitle}>{item.storeName}</Text>
            <Text style={styles.cardDescription}>{item.storeDescription}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("ShopDetails", { shop: item })}
            >
              <Text style={styles.buttonText}>View Details</Text>
            </TouchableOpacity>
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
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  noShopsText: {
    fontSize: 18,
    textAlign: "center",
    color: "#555",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default CustomerShopsScreen;
