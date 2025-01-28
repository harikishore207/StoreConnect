import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../Utils/firebase'; // Adjust the path as needed
import { doc, getDoc } from 'firebase/firestore';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;

        console.log("Current User UID:", user?.uid); // Debugging UID
        if (user) {
          const userDocRef = doc(db, 'retailers', user.uid); // Match UID with Firestore document ID
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setUserData(userDoc.data());
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
    return <ActivityIndicator size="large" color="#007bff" />;
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
            source={{ uri: userData.images?.[0] || 'https://via.placeholder.com/150' }}
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
  topBar: { width: '100%', flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 20 },
  logoutButton: { padding: 10, backgroundColor: 'red', borderRadius: 8 },
  logoutButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  profileImage: { width: 150, height: 150, borderRadius: 75, marginBottom: 20 },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  detailItem: { fontSize: 16, marginBottom: 10 },
  detailLabel: { fontWeight: 'bold' },
});

export default ProfileScreen;
