import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { getApp, initializeApp } from 'firebase/app';

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
if (!getApp().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp()[0];
}

const db = getFirestore(app);
const auth = getAuth();

const PromotionsScreen = () => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        base64: true,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const base64String = `data:image/jpeg;base64,${result.assets[0].base64}`;
        setImage(base64String);
      }
    } catch (error) {
      console.error('Error picking image:', error.message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to pick an image. Please try again.',
      });
    }
  };

  const savePromotionToFirestore = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Toast.show({
          type: 'error',
          text1: 'Authentication Required',
          text2: 'You must be logged in to post a promotion.',
        });
        return;
      }

      if (!image || !description.trim()) {
        Toast.show({
          type: 'error',
          text1: 'Missing Content',
          text2: 'Please add both an image and description.',
        });
        return;
      }

      await addDoc(collection(db, 'promotions'), {
        imageUrl: image,
        ownerId: user.uid,
        description: description.trim(),
        createdAt: new Date().toISOString(),
      });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Your promotion has been posted!',
      });

      setImage(null);
      setDescription('');
    } catch (error) {
      console.error('Error posting promotion:', error.message);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to post promotion. Please try again.',
      });
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create Post</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity 
          style={[styles.imagePickerContainer, image && styles.imageSelected]} 
          onPress={pickImage}
        >
          {image ? (
            <Image source={{ uri: image }} style={styles.selectedImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <MaterialIcons name="add-photo-alternate" size={40} color="#666" />
              <Text style={styles.imagePlaceholderText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Write something about your promotion..."
            placeholderTextColor="#666"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
        </View>
      </View>

      <TouchableOpacity 
        style={[
          styles.postButton,
          (!image || !description.trim()) && styles.postButtonDisabled
        ]} 
        onPress={savePromotionToFirestore}
        disabled={!image || !description.trim()}
      >
        <Ionicons name="send" size={20} color="white" />
        <Text style={styles.postButtonText}>Post</Text>
      </TouchableOpacity>

      <Toast />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  imagePickerContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  imageSelected: {
    backgroundColor: '#000',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: '#666',
    fontSize: 16,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    minHeight: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    fontSize: 16,
    color: '#1a1a1a',
    minHeight: 100,
  },
  postButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0095f6',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postButtonDisabled: {
    backgroundColor: '#b2dffc',
  },
  postButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default PromotionsScreen;