import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const [userDetails, setUserDetails] = useState(null);
  const navigation = useNavigation();

  // Fetch user details from Firestore
  useEffect(() => {
    const fetchUserDetails = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        try {
          const db = getFirestore();
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setUserDetails(docSnap.data());
          } else {
            Alert.alert("Error", "No user data found.");
          }
        } catch (error) {
          console.error("Error fetching user details: ", error);
          Alert.alert("Error", "Failed to fetch your profile details.");
        }
      }
    };

    fetchUserDetails();
  }, []);

  // Logout function
  const handleLogout = () => {
    navigation.replace("Login"); // Navigates to the Login screen
  };

  if (!userDetails) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Top Bar with Logout Button */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Details */}
      <Image source={{ uri: userDetails.profilePic }} style={styles.profileImage} />
      <Text style={styles.name}>{userDetails.name}</Text>
      <Text style={styles.email}>{userDetails.email}</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailItem}>
          <Text style={styles.detailLabel}>Phone:</Text> {userDetails.phone}
        </Text>
        <Text style={styles.detailItem}>
          <Text style={styles.detailLabel}>Address:</Text> {userDetails.address}
        </Text>
      </View>

      {/* Edit Profile Button */}
      <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate("SetupProfileScreen")}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f7f7f7",
  },
  topBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  logoutButton: {
    padding: 10,
    backgroundColor: "red",
    borderRadius: 8,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  detailsContainer: {
    width: "100%",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: 20,
  },
  detailItem: {
    fontSize: 16,
    marginBottom: 10,
  },
  detailLabel: {
    fontWeight: "bold",
  },
  editButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
