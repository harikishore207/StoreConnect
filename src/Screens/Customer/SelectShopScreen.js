import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Utils/firebase";
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const SelectShopScreen = () => {
  const [shops, setShops] = useState([]);
  const [filteredShops, setFilteredShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNearbyOnly, setShowNearbyOnly] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "retailers"));
        const shopList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setShops(shopList);
        setFilteredShops(shopList);
      } catch (error) {
        console.error("Error fetching shops:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
    getUserLocation();
  }, []);

  const getUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };

  useEffect(() => {
    let result = shops;

    // Apply search filter
    if (searchQuery) {
      result = result.filter(shop => 
        shop.storeName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply nearby filter (within 5km)
    if (showNearbyOnly && userLocation) {
      result = result.filter(shop => {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          shop.location.latitude,
          shop.location.longitude
        );
        return distance <= 5; // Show shops within 5km
      });
    }

    setFilteredShops(result);
  }, [searchQuery, showNearbyOnly, shops, userLocation]);

  const handleSelectShop = (shop) => {
    setSelectedShop(shop);
  };

  const handleProceed = () => {
    if (selectedShop) {
      navigation.navigate("DeliveryOptions", { shop: selectedShop });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Shop</Text>
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search shops..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity 
          style={[styles.nearbyButton, showNearbyOnly && styles.nearbyButtonActive]}
          onPress={() => setShowNearbyOnly(!showNearbyOnly)}
        >
          <MaterialIcons 
            name="location-on" 
            size={24} 
            color={showNearbyOnly ? "#ff5722" : "#666"} 
          />
          <Text style={[styles.nearbyText, showNearbyOnly && styles.nearbyTextActive]}>
            Nearby
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#ff5722" />
      ) : (
        <FlatList
          data={filteredShops}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.shopCard, selectedShop?.id === item.id && styles.selectedShop]}
              onPress={() => handleSelectShop(item)}
            >
              <Text style={styles.shopName}>{item.storeName}</Text>
              <Text style={styles.shopAddress}>{item.address}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
      <TouchableOpacity
        style={[styles.proceedButton, !selectedShop && styles.disabledButton]}
        onPress={handleProceed}
        disabled={!selectedShop}
      >
        <Text style={styles.proceedButtonText}>Proceed</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#f7f7f7" 
  },
  title: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 10, 
    textAlign: "center" 
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  nearbyButton: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  nearbyButtonActive: {
    borderColor: '#ff5722',
    backgroundColor: '#fff5f2',
  },
  nearbyText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  nearbyTextActive: {
    color: '#ff5722',
  },
  shopCard: { 
    padding: 15, 
    backgroundColor: "white", 
    marginVertical: 8, 
    borderRadius: 8 
  },
  selectedShop: { 
    backgroundColor: "#ffccbc" 
  },
  shopName: { 
    fontSize: 18, 
    fontWeight: "bold" 
  },
  shopAddress: { 
    fontSize: 14, 
    color: "#666" 
  },
  proceedButton: { 
    backgroundColor: "#ff5722", 
    padding: 15, 
    borderRadius: 10, 
    alignItems: "center", 
    marginTop: 20 
  },
  disabledButton: { 
    backgroundColor: "#ccc" 
  },
  proceedButtonText: { 
    color: "white", 
    fontSize: 18, 
    fontWeight: "bold" 
  },
});

export default SelectShopScreen;