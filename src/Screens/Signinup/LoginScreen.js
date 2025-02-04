import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../Utils/firebase";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    setError(null);
  
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      if (!user || !user.uid) {
        Alert.alert("Error", "User data is missing!");
        return;
      }
  
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);
  
     // console.log("Firestore document data:", userDoc.data());
  
      if (!userDoc.exists()) {
        setError("User document does not exist.");
        return;
      }
  
      const userData = userDoc.data();
      const userRole = userData.role;
  
      if (!userRole) {
        setError("User role is missing or undefined.");
        return;
      }
  
      if (userRole === "Customer") {
        navigation.replace("CustomerHome");
      } else if (userRole === "Retailer") {
        navigation.replace("StoreOwnerHome");
      } else {
        setError("User role is invalid or undefined.");
      }
    } catch (err) {
      console.error("Login error:", err.message);
      setError("Invalid email or password.");
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Button title="Login" onPress={handleLogin} />

      <Text style={styles.signUpText}>
        New user?{" "}
        <Text
          style={styles.signUpLink}
          onPress={() => navigation.navigate("Signup")}
        >
          Click here to sign up
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  signUpText: {
    marginTop: 20,
  },
  signUpLink: {
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default LoginScreen;