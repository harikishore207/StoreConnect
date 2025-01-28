import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firestore, db } from "../../Utils/firebase";



const auth = getAuth();

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleSignUp = async () => {
    if (!role) {
      Alert.alert("Error", "Please select a role before signing up!");
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential?.user;
  
      if (!user || !user.uid) {
        Alert.alert("Error", "User data is missing!");
        return;
      }
  
      // Save user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: role,
      });
  
      Alert.alert("Success", "User registered successfully!");
  
      if (role === "Retailer") {
        navigation.navigate("StoreRegistration", { userId: user.uid });  // Pass user ID to next screen
      } else {
        navigation.navigate("CustomerHome");
      }
    } catch (error) {
      console.error("Error signing up user:", error.message);
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
        {role && <Text style={styles.selectedRole}>Selected Role: {role}</Text>}
      </View>

      {/* Email and Password Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!!role}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!!role}
      />

      <Button title="Sign Up" onPress={handleSignUp} disabled={!role} />
      <Button title="Go to Login" onPress={() => navigation.navigate("Login")} />
    </View>
  );
};

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
