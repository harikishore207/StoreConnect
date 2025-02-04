import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, collection, addDoc, onSnapshot } from 'firebase/firestore';
import { getApp, getApps, initializeApp } from 'firebase/app';
import Toast from 'react-native-toast-message';
import { getAuth } from "firebase/auth";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQYmQM1GKxFdwsNSwYPZUIIPXKGEWznGs",
  authDomain: "storeconnect-27e4b.firebaseapp.com",
  projectId: "storeconnect-27e4b",
  storageBucket: "storeconnect-27e4b.appspot.com",
  messagingSenderId: "655261131202",
  appId: "1:655261131202:web:af23828df99b4c0f04365b",
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

const PromotionsScreen = () => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [promotions, setPromotions] = useState([]);

  // Fetch Promotions from Firestore
  useEffect(() => {
    const promotionsRef = collection(db, 'promotions');
    const unsubscribe = onSnapshot(promotionsRef, (snapshot) => {
      const promotionsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPromotions(promotionsList);
    });

    return () => unsubscribe();
  }, []);

  // Pick an Image
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        base64: true, // Convert to Base64
      });
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const base64String = `data:image/jpeg;base64,${result.assets[0].base64}`;
  
        setImage(base64String);
      }
    } catch (error) {
      console.error('Error picking image:', error.message);
      alert('Failed to pick image. Please try again.');
    }
  };
  

  // Save Promotion to Firestore
  const savePromotionToFirestore = async (imageUrl, description) => {
    try {

      const auth = getAuth(); // ✅ Get Firebase Auth instance
      const user = auth.currentUser; // ✅ Get the logged-in user

    if (!user) {
      alert("You must be logged in to post a promotion.");
      return;
    }

      await addDoc(collection(db, 'promotions'), {
        imageUrl,
        ownerId: user.uid,
        description,
        createdAt: new Date().toISOString(),
      });

      // Display Success Toast
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Promotion Posted',
        text2: 'The promotion was successfully uploaded!',
      });

      setImage(null);
      setDescription('');
    } catch (error) {
      console.error('Error posting promotion:', error.message);
      // Display Error Toast
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Failed to Post Promotion',
        text2: 'There was an error uploading the promotion.',
      });
    }
  };

  // Post Promotion
  const handlePost = async () => {
    if (!image || !description) {
      alert('Please add an image and description.');
      return;
    }

    try {
      // Using the local URI of the image as the image URL
      const imageUrl = image; // In this case, we're using the local URI directly

      savePromotionToFirestore(imageUrl, description);
    } catch (error) {
      console.error('Error posting promotion:', error.message);
      alert('Failed to post promotion. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Promotion</Text>
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imageText}>Pick an Image</Text>
        )}
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Enter description"
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Post Promotion" onPress={handlePost} />
      <FlatList
        data={promotions}
        renderItem={({ item }) => (
          <View style={styles.promotionCard}>
            <Image source={{ uri: item.imageUrl }} style={styles.promotionImage} />
            <Text style={styles.promotionText}>{item.description}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      <Toast ref={(ref) => Toast.setRef(ref)} /> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  imagePicker: {
    height: 150,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imageText: {
    color: '#888',
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  promotionCard: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
  },
  promotionImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  promotionText: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default PromotionsScreen;
