import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, TouchableOpacity, Image, ScrollView, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import MapView, { Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";

const StoreRegistrationScreen = () => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [storeName, setStoreName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [location, setLocation] = useState({ latitude: 11.0242576, longitude: 77.0041961 });
  const [images, setImages] = useState([]);

  // Function to pick images
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImages((prevImages) => [
        ...prevImages,
        ...result.assets.map((asset) => asset.uri).filter((uri) => uri), // Ensure URIs are valid
      ]);
    }
  };
  

  // Function to handle submission
  const handleSubmit = async () => {
    if (
      !storeName.trim() ||
      !ownerName.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !pinCode.trim() ||
      !storeDescription.trim() ||
      !location.latitude ||
      !location.longitude ||
      images.length === 0
    ) {
      Alert.alert("Error", "Please complete all fields before submitting!");
      return;
    }
  
    try {
      const auth = getAuth(); // Initialize Firebase Auth
      const user = auth.currentUser;
  
      if (!user) {
        Alert.alert("Error", "You must be logged in to register a store.");
        return;
      }
  
      const retailerData = {
        storeName: storeName.trim(),
        ownerName: ownerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        pinCode: pinCode.trim(),
        storeDescription: storeDescription.trim(),
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        images: images.filter((image) => image !== undefined), // Filter valid images
      };
  
      const db = getFirestore();
      await setDoc(doc(db, "retailers", user.uid), retailerData); // Save data with UID as the document ID
  
      Alert.alert("Success", "Store registered successfully!");
      navigation.navigate("StoreOwnerHome"); // Navigate to the home page
    } catch (error) {
      console.error("Error adding retailer: ", error);
      Alert.alert("Error", "Failed to register store. Please try again.");
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Retailer Registration</Text>

      {currentStep === 1 && (
        <View style={styles.section}>
          <Text style={styles.label}>Store Name:</Text>
          <TextInput
            placeholder="Enter store name"
            value={storeName}
            onChangeText={setStoreName}
            style={styles.input}
          />

          <Text style={styles.label}>Owner Name:</Text>
          <TextInput
            placeholder="Enter owner name"
            value={ownerName}
            onChangeText={setOwnerName}
            style={styles.input}
          />

          <Text style={styles.label}>Phone:</Text>
          <TextInput
            placeholder="Enter phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.input}
          />

          <Button title="Next" onPress={() => setCurrentStep(2)} color="#4CAF50" />
        </View>
      )}

      {currentStep === 2 && (
        <View style={styles.section}>
          <Text style={styles.label}>Address:</Text>
          <TextInput
            placeholder="Enter address"
            value={address}
            onChangeText={setAddress}
            style={styles.input}
          />

          <Text style={styles.label}>Pin Code:</Text>
          <TextInput
            placeholder="Enter pin code"
            value={pinCode}
            onChangeText={setPinCode}
            keyboardType="numeric"
            style={styles.input}
          />

          <Text style={styles.label}>Store Description:</Text>
          <TextInput
            placeholder="Enter store description"
            value={storeDescription}
            onChangeText={setStoreDescription}
            style={styles.input}
          />

          <Text style={styles.label}>Set Location:</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onPress={(event) => setLocation(event.nativeEvent.coordinate)}
          >
            <Marker coordinate={location} draggable onDragEnd={(event) => setLocation(event.nativeEvent.coordinate)} />
          </MapView>

          <TouchableOpacity
            style={[styles.button, { marginBottom: 12 }]}
            onPress={() => Alert.alert("Location Set", `Lat: ${location.latitude}, Lng: ${location.longitude}`)}
          >
            <Text style={styles.buttonText}>Set Location</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Pick Images:</Text>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Pick an Image</Text>
          </TouchableOpacity>

          <ScrollView horizontal>
            {images.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.image} />
            ))}
          </ScrollView>

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
            <Button title="Back" onPress={() => setCurrentStep(1)} color="#FFA500" />
            <Button title="Submit" onPress={handleSubmit} color="#4CAF50" />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  map: {
    width: "100%",
    height: 200,
    marginBottom: 12,
    borderRadius: 8,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 8,
  },
});

export default StoreRegistrationScreen;
