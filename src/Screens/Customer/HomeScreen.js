import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  getDoc,
  query, 
  orderBy,
  setDoc,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getApp } from 'firebase/app';

const db = getFirestore(getApp());
const auth = getAuth();

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [userLikes, setUserLikes] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchStoreProfiles = async (ownerIds) => {
    try {
      const storeProfiles = {};
      await Promise.all(
        ownerIds.map(async (ownerId) => {
          if (ownerId) {
            const storeRef = doc(db, 'retailers', ownerId);
            const storeDoc = await getDoc(storeRef);
            if (storeDoc.exists()) {
              storeProfiles[ownerId] = storeDoc.data();
            }
          }
        })
      );
      return storeProfiles;
    } catch (error) {
      console.error('Error fetching store profiles:', error);
      return {};
    }
  };

  const fetchUserLikes = async (postIds) => {
    const user = auth.currentUser;
    if (!user || !postIds.length) return {};
    
    try {
      const likesData = {};
      await Promise.all(
        postIds.map(async (postId) => {
          const likeRef = doc(db, `promotions/${postId}/likes`, user.uid);
          const likeDoc = await getDoc(likeRef);
          likesData[postId] = likeDoc.exists();
        })
      );
      return likesData;
    } catch (error) {
      console.error('Error fetching user likes:', error);
      return {};
    }
  };

  const handleLike = async (postId) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      // Optimistic UI update
      const isCurrentlyLiked = userLikes[postId];
      setUserLikes(prev => ({
        ...prev,
        [postId]: !isCurrentlyLiked
      }));

      const batch = writeBatch(db);
      const postRef = doc(db, 'promotions', postId);
      const likeRef = doc(db, `promotions/${postId}/likes`, user.uid);

      const postDoc = await getDoc(postRef);
      if (!postDoc.exists()) return;

      const currentLikes = postDoc.data().likeCount || 0;

      if (!isCurrentlyLiked) {
        batch.set(likeRef, {
          userId: user.uid,
          createdAt: new Date().toISOString()
        });
        batch.update(postRef, { likeCount: currentLikes + 1 });
      } else {
        batch.delete(likeRef);
        batch.update(postRef, { likeCount: Math.max(0, currentLikes - 1) });
      }

      await batch.commit();

      // Update posts state
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                likeCount: !isCurrentlyLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1)
              }
            : post
        )
      );

    } catch (error) {
      console.error('Error updating like:', error);
      // Revert optimistic update on error
      setUserLikes(prev => ({
        ...prev,
        [postId]: !prev[postId]
      }));
    }
  };

  const fetchPosts = () => {
    try {
      const postsRef = collection(db, 'promotions');
      const q = query(postsRef, orderBy('createdAt', 'desc'));

      return onSnapshot(q, async (snapshot) => {
        const postDocs = snapshot.docs;
        
        // Get unique owner IDs
        const ownerIds = [...new Set(postDocs.map(doc => doc.data().ownerId))];
        
        // Fetch all store profiles and likes in parallel
        const [storeProfiles, likesData] = await Promise.all([
          fetchStoreProfiles(ownerIds),
          fetchUserLikes(postDocs.map(doc => doc.id))
        ]);
        
        // Process posts with store information
        const postsData = postDocs.map(doc => {
          const postData = doc.data();
          const storeProfile = storeProfiles[postData.ownerId];
          
          return {
            id: doc.id,
            ...postData,
            storeName: storeProfile?.storeName || 'Unknown Store',
            timeAgo: getTimeAgo(postData.createdAt)
          };
        });

        setPosts(postsData);
        setUserLikes(likesData);
        setLoading(false);
        setRefreshing(false);
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
      setRefreshing(false);
      return () => {};
    }
  };

  useEffect(() => {
    const unsubscribe = fetchPosts();
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const getTimeAgo = (timestamp) => {
    if (!timestamp) return 'Recently';
    
    const now = new Date();
    const postDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.userInfo}>
          <View style={styles.storeLogo}>
            <Text style={styles.storeInitial}>{item.storeName?.[0] || 'S'}</Text>
          </View>
          <Text style={styles.storeName}>{item.storeName}</Text>
        </View>
        <Text style={styles.timeAgo}>{item.timeAgo}</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.imageUrl }} 
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.cardContent}>
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => handleLike(item.id)}
          >
            <AntDesign
              name={userLikes[item.id] ? "heart" : "hearto"}
              size={24}
              color={userLikes[item.id] ? "#ff3b30" : "#000"}
            />
            <Text style={styles.likeCount}>{item.likeCount || 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-social-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0095f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome to Store Connect</Text>
      </View>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No promotions available</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  headerTitle: {
    fontSize: 20,
    justifyContent: 'center',
    textAlign: 'center',  
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  card: {
    backgroundColor: 'white',
    marginBottom: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e1e1e1',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0095f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  storeInitial: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  timeAgo: {
    fontSize: 14,
    color: '#666',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    padding: 12,
  },
  actions: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  likeCount: {
    marginLeft: 6,
    fontSize: 16,
    color: '#1a1a1a',
  },
  description: {
    fontSize: 15,
    color: '#1a1a1a',
    lineHeight: 20,
  },
});

export default HomeScreen;
