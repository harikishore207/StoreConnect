import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Animated, Alert,
} from 'react-native';
import {
  getFirestore, collection, doc, updateDoc, onSnapshot, getDoc, setDoc, deleteDoc, increment,
} from 'firebase/firestore';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { AntDesign } from '@expo/vector-icons';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);
const auth = getAuth();

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [userLikes, setUserLikes] = useState({});
  const likeAnimations = useRef({}).current;

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
  
    const promotionsRef = collection(db, 'promotions');
    const unsubscribe = onSnapshot(promotionsRef, async (snapshot) => {
      const promotionsList = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const postData = docSnap.data();
          const storeProfile = await fetchStoreProfile(postData.ownerId);
  
          // Check if the user has liked this post
          const likeDocRef = doc(db, `promotions/${docSnap.id}/likes`, user.uid);
          const likeDocSnap = await getDoc(likeDocRef);
          const isLiked = likeDocSnap.exists(); // If the doc exists, user has liked the post
  
          return {
            id: docSnap.id,
            likeCount: postData.likeCount || 0,
            ownerId: postData.ownerId || null,
            imageUrl: postData.imageUrl || '',
            description: postData.description || '',
            storeName: storeProfile?.storeName || 'Unknown Store',
            likedByUser: isLiked,
          };
        })
      );
  
      setPosts(promotionsList);
  
      // Update userLikes state
      const likesMap = {};
      promotionsList.forEach((post) => {
        likesMap[post.id] = post.likedByUser;
      });
      setUserLikes(likesMap);
    });
  
    return () => unsubscribe();
  }, []);
  

  const fetchStoreProfile = async (ownerId) => {
    if (!ownerId) return null;
    const storeDocRef = doc(db, 'retailers', ownerId);
    const storeDocSnap = await getDoc(storeDocRef);
    return storeDocSnap.exists() ? storeDocSnap.data() : null;
  };

  const handleLike = async (postId) => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Login Required", "You must be logged in to like posts.");
      return;
    }

    const postDocRef = doc(db, "promotions", postId);
    const likeDocRef = doc(db, `promotions/${postId}/likes`, user.uid);

    try {
      if (userLikes[postId]) {
        await deleteDoc(likeDocRef);
        await updateDoc(postDocRef, { likeCount: increment(-1) });
        setUserLikes((prev) => ({ ...prev, [postId]: false }));
      } else {
        await setDoc(likeDocRef, { liked: true });
        await updateDoc(postDocRef, { likeCount: increment(1) });
        setUserLikes((prev) => ({ ...prev, [postId]: true }));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      Alert.alert("Error", "Failed to update like.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Store Promotions</Text>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.storeName}>{item.storeName}</Text>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <Text style={styles.cardTitle}>{item.description}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleLike(item.id)}>
                <AntDesign
                  name={userLikes[item.id] ? "heart" : "hearto"}
                  size={24}
                  color={userLikes[item.id] ? "#ff5252" : "#000"}
                />
              </TouchableOpacity>
              <Text style={styles.likeCount}>{item.likeCount} likes</Text>
            </View>
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
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 5,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  likeCount: {
    fontSize: 16,
    color: '#555',
  },
});

export default HomeScreen;

