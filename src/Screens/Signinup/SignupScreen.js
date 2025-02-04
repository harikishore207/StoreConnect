import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../Utils/firebase";

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }
  
    if (!role) {
      Alert.alert("Error", "Please select a role before signing up!");
      return;
    }
  
    try {
      // Step 1: Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      if (!user || !user.uid) {
        Alert.alert("Error", "User data is missing!");
        return;
      }
  
      // Step 2: Store user details in Firestore
      const userDocRef = doc(db, "users", user.uid); // Use user.uid as the document ID
      await setDoc(userDocRef, {
        email: user.email,
        role: role,
      });
  
     // console.log("User document created in Firestore with ID:", user.uid); // Log the document ID
      Alert.alert("Success", "User registered successfully!");
  
      // Step 3: Navigate based on role AFTER Firestore write completes
      if (role === "Retailer") {
        navigation.replace("StoreRegistration", { userId: user.uid });
      } else {
        navigation.replace("CustomerHome");
      }
    } catch (error) {
      console.error("Signup error:", error.message);
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      {/* Role Selection */}
      <View style={styles.roleContainer}>
        <Button title="Customer" onPress={() => setRole("Customer")} />
        <Button title="Retailer" onPress={() => setRole("Retailer")} />
      </View>
      {role && <Text style={styles.selectedRole}>Selected Role: {role}</Text>}

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Sign Up Button */}
      <Button title="Sign Up" onPress={handleSignUp} />
      
      {/* Navigation to Login */}
      <Button title="Go to Login" onPress={() => navigation.navigate("Login")} />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  roleContainer: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  selectedRole: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
    fontWeight: "bold",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
});

export default SignUpScreen;