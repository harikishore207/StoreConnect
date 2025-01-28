import React, { useState } from "react";
import { 
  View, Text, TextInput, Button, TouchableOpacity, Image, Alert, StyleSheet, ToastAndroid 
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator"; // Import Image Manipulator
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const SetupProfileScreen = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profilePic, setProfilePic] = useState(""); // Stores Base64 string
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "We need access to your gallery.");
      return false;
    }
    return true;
  };

  // Function to resize & compress the image before converting to Base64
  const processImage = async (uri) => {
    try {
      // Resize & Compress (Reduce file size)
      const compressedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 500 } }], // Resize to 500px width
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG } // 50% quality
      );

      // Convert to Base64
      const base64 = await FileSystem.readAsStringAsync(compressedImage.uri, { encoding: FileSystem.EncodingType.Base64 });

      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error("Error processing image:", error);
      Alert.alert("Error", "Failed to process the image.");
      return null;
    }
  };

  // Function to pick an image
  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (!result.canceled) {
        ToastAndroid.show("Processing Image...", ToastAndroid.SHORT); // Show toast before setting image

        const base64Image = await processImage(result.assets[0].uri);
        if (base64Image) {
          setProfilePic(base64Image); // Store compressed Base64 image
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "An error occurred while picking the image.");
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!name || !phone || !address || !profilePic) {
      Alert.alert("Error", "Please fill in all fields and provide a profile picture.");
      return;
    }

    setLoading(true);
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userDetails = {
        name,
        phone,
        address,
        profilePic, // Now stored as a compressed Base64 string
        email: user.email,
      };

      try {
        const db = getFirestore();
        await setDoc(doc(db, "users", user.uid), userDetails);
        Alert.alert("Success", "Profile setup completed!");
        navigation.navigate("CustomerHome");
      } catch (error) {
        console.error("Error setting up profile:", error);
        Alert.alert("Error", "Failed to set up your profile.");
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert("Error", "User not logged in.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Setup Your Profile</Text>

      {/* Profile Picture Picker */}
      <TouchableOpacity onPress={pickImage}>
        {profilePic ? (
          <Image source={{ uri: profilePic }} style={styles.profilePic} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imagePlaceholderText}>Pick a Profile Picture</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput style={styles.input} placeholder="Enter your name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Enter your phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Enter your address" value={address} onChangeText={setAddress} />

      <Button title={loading ? "Submitting..." : "Submit"} onPress={handleSubmit} disabled={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 75,
    marginBottom: 20,
  },
  imagePlaceholderText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default SetupProfileScreen;
