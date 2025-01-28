import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, FlatList } from 'react-native';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { getApp, getApps, initializeApp } from 'firebase/app';

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

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState({});

  // Fetch Promotions from Firestore
  useEffect(() => {
    const promotionsRef = collection(db, 'promotions');
    const unsubscribe = onSnapshot(promotionsRef, (snapshot) => {
      const promotionsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(promotionsList);
    });

    return () => unsubscribe();
  }, []);

  const handleLike = (postId) => {
    setLikes((prev) => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Store Connect</Text>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <Text style={styles.cardTitle}>{item.description}</Text>
            <View style={styles.actions}>
              <Button title="Like" onPress={() => handleLike(item.id)} />
              <Text style={styles.likeCount}>
                {likes[item.id] ? `${likes[item.id]} Likes` : '0 Likes'}
              </Text>
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
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  likeCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gray',
  },
});

export default HomeScreen;
