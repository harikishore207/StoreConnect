import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../Utils/firebase'; // Adjust the path as needed
import { doc, getDoc } from 'firebase/firestore';

const ProfileScreenStore = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(null); // Stores final image URL

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;

        if (user) {
          const userDocRef = doc(db, 'retailers', user.uid); // Match UID with Firestore document ID
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);

            // Ensure image exists
            if (data.images && Array.isArray(data.images) && data.images.length > 0) {
              const imagePath = data.images[0];

              // Directly use base64 images without modification
              if (imagePath.startsWith('data:image')) {
                setImageUrl(imagePath);
              } else {
                console.error("Invalid base64 image format:", imagePath);
                setImageUrl(null);
              }
            } else {
              setImageUrl(null);
            }
          } else {
            console.error('No such user document!');
          }
        } else {
          console.error('User not logged in');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    auth.signOut()
      .then(() => navigation.replace('Login'))
      .catch(error => console.error('Logout error:', error));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {userData && (
        <>
          <Image
            source={{ uri: imageUrl || 'https://via.placeholder.com/150' }} // Correctly loading base64 image
            style={styles.profileImage}
          />
          <Text style={styles.name}>{userData.ownerName || 'No Name'}</Text>
          <Text style={styles.detailItem}>
            <Text style={styles.detailLabel}>Store Name:</Text> {userData.storeName || 'N/A'}
          </Text>
          <Text style={styles.detailItem}>
            <Text style={styles.detailLabel}>Address:</Text> {userData.address || 'N/A'}
          </Text>
          <Text style={styles.detailItem}>
            <Text style={styles.detailLabel}>Phone:</Text> {userData.phone || 'N/A'}
          </Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 20, backgroundColor: '#f7f7f7' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topBar: { width: '100%', flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 20 },
  logoutButton: { padding: 10, backgroundColor: 'red', borderRadius: 8 },
  logoutButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  profileImage: { width: 150, height: 150, borderRadius: 75, marginBottom: 20 },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  detailItem: { fontSize: 16, marginBottom: 10 },
  detailLabel: { fontWeight: 'bold' },
});

export default ProfileScreenStore;
