import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Animated,
  ScrollView,
  TextInput,
  Easing,
  StyleSheet,
  Alert,
} from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, query, where, getDocs, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons, Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [orderStats, setOrderStats] = useState({ total: 0, completed: 0 });
  const [showRewards, setShowRewards] = useState(false);
  const [level, setLevel] = useState(1);
  const [points, setPoints] = useState(0);
  const [editMode, setEditMode] = useState({
    name: false,
    phone: false,
    address: false
  });
  const [editValues, setEditValues] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [phone, setPhone] = useState('');

  const db = getFirestore();
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchUserProfile();
    fetchOrderStats();
  }, []);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(animatedWidth, {
        toValue: (points % 100) / 100,
        duration: 1000,
        useNativeDriver: false,
        easing: Easing.out(Easing.quad),
      }),
    ]).start();
  }, [points]);

  const progressBarWidth = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const progressBarColor = animatedWidth.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
  });

  const fetchUserProfile = async () => {
    try {
      const user = getAuth().currentUser;
      if (!user) {
        console.log('No user logged in');
        return;
      }

      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserProfile({
          name: userData.name || user.displayName || 'User',
          email: userData.email || user.email,
          phone: userData.phone || '',
          address: userData.address || '',
          image: userData.image || ''  // Base64 image
        });
        setNewName(userData.name || user.displayName || '');
        setPhone(userData.phone || '');
        setEditValues({
          name: userData.name || user.displayName || '',
          phone: userData.phone || '',
          address: userData.address || ''
        });
        if (userData.image) {
          setNewImage(userData.image); // Store base64 string directly
        }
      } else {
        const userData = {
          name: user.displayName || 'User',
          email: user.email,
          phone: '',
          address: '',
          image: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await setDoc(userRef, userData);
        setUserProfile(userData);
        setNewName(userData.name);
        setEditValues({
          name: userData.name,
          phone: '',
          address: ''
        });
      }

      try {
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, where('customerId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const completedOrders = querySnapshot.docs.filter(doc => doc.data().status === 'completed').length;
        const calculatedPoints = completedOrders * 50;
        setPoints(calculatedPoints);
        setLevel(Math.floor(calculatedPoints / 100) + 1);
      } catch (orderError) {
        console.error('Error fetching orders:', orderError);
        setPoints(0);
        setLevel(1);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchOrderStats = async () => {
    try {
      const user = getAuth().currentUser;
      if (!user) return;

      const ordersRef = collection(db, 'orders');
      const q = query(
        ordersRef, 
        where('userId', '==', user.uid),
        where('status', 'in', ['completed', 'pending', 'processing'])
      );
      const querySnapshot = await getDocs(q);
      
      const total = querySnapshot.size;
      const completed = querySnapshot.docs.filter(doc => doc.data().status === 'completed').length;
      
      const earnedPoints = completed * 50;
      
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        points: earnedPoints,
        level: Math.floor(earnedPoints / 100) + 1,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setPoints(earnedPoints);
      setLevel(Math.floor(earnedPoints / 100) + 1);
      setOrderStats({
        total,
        completed
      });
    } catch (error) {
      console.error('Error fetching order stats:', error);
      setPoints(0);
      setLevel(1);
      setOrderStats({ total: 0, completed: 0 });
    }
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.base64) {
        const base64Image = result.base64;
        setNewImage(base64Image); // Store base64 string directly
        
        const user = getAuth().currentUser;
        if (user) {
          const userRef = doc(db, 'users', user.uid);
          await setDoc(userRef, {
            image: base64Image,
            updatedAt: new Date().toISOString()
          }, { merge: true });
          setUserProfile(prev => ({ ...prev, image: base64Image }));
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleSaveField = async (field) => {
    try {
      const user = getAuth().currentUser;
      if (!user) return;

      const userRef = doc(db, 'users', user.uid);
      const updateData = {
        [field]: editValues[field],
        updatedAt: new Date().toISOString()
      };

      await setDoc(userRef, updateData, { merge: true });
      setUserProfile(prev => ({ ...prev, [field]: editValues[field] }));
      setEditMode(prev => ({ ...prev, [field]: false }));
    } catch (error) {
      console.error('Error updating field:', error);
    }
  };

  const handleEditAddress = async (addressId, newAddress, newPhone) => {
    try {
      const user = getAuth().currentUser;
      if (!user) {
        console.log('No user logged in');
        return;
      }

      const userRef = doc(db, 'users', user.uid);
      const updateData = {
        address: newAddress,
        phone: newPhone,
        updatedAt: new Date().toISOString()
      };

      await setDoc(userRef, updateData, { merge: true });
      setUserProfile(prev => ({ ...prev, address: newAddress, phone: newPhone }));
      setPhone(newPhone);
      setEditMode(prev => ({ ...prev, address: false, phone: false }));
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  const renderProfileImage = () => {
    if (userProfile.image) {
      return (
        <Image 
          source={{ uri: userProfile.image }}
          style={styles.profileImage}
        />
      );
    }
    return (
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>
          {userProfile.name ? userProfile.name[0].toUpperCase() : 'U'}
        </Text>
      </View>
    );
  };

  const EditableField = ({ field, value, icon }) => (
    <View style={styles.menuItem}>
      {icon}
      <View style={styles.addressContainer}>
        <Text style={styles.menuText}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
        {editMode[field] ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.editInput}
              value={editValues[field]}
              onChangeText={(text) => setEditValues(prev => ({ ...prev, [field]: text }))}
              placeholder={`Enter ${field}`}
            />
            <TouchableOpacity onPress={() => handleSaveField(field)} style={styles.saveIcon}>
              <MaterialIcons name="check" size={24} color="#4a90e2" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => {
                setEditMode(prev => ({ ...prev, [field]: false }));
                setEditValues(prev => ({ ...prev, [field]: value }));
              }} 
              style={styles.cancelIcon}
            >
              <MaterialIcons name="close" size={24} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.valueContainer}>
            <Text style={styles.addressText}>{value || `No ${field} added`}</Text>
            <TouchableOpacity 
              onPress={() => {
                setEditMode(prev => ({ ...prev, [field]: true }));
                setEditValues(prev => ({ ...prev, [field]: value }));
              }}
              style={styles.editIcon}
            >
              <MaterialIcons name="edit" size={20} color="#4a90e2" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  const handleEditProfile = async () => {
    try {
      const user = getAuth().currentUser;
      if (!user) {
        console.log('No user logged in');
        return;
      }

      const userRef = doc(db, 'users', user.uid);
      const updateData = {
        name: newName,
        phone: phone,
        updatedAt: new Date().toISOString()
      };

      await setDoc(userRef, updateData, { merge: true });
      setUserProfile(prev => ({ ...prev, ...updateData }));
      setEditProfileModalVisible(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleAddNewAddress = async (address, phone) => {
    try {
      const user = getAuth().currentUser;
      if (!user) {
        console.log('No user logged in');
        return;
      }

      const userRef = doc(db, 'users', user.uid);
      const updateData = {
        address: address,
        phone: phone,
        updatedAt: new Date().toISOString()
      };

      await setDoc(userRef, updateData, { merge: true });
      setUserProfile(prev => ({ ...prev, ...updateData }));
      setPhone(phone);
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const EditProfileModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={editProfileModalVisible}
        onRequestClose={() => setEditProfileModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditProfileModalVisible(false)}>
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <TouchableOpacity onPress={handlePickImage}>
                {renderProfileImage()}
                <View style={styles.editImageBadge}>
                  <MaterialIcons name="camera-alt" size={16} color="#fff" />
                </View>
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={newName}
                onChangeText={setNewName}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <TouchableOpacity style={styles.saveButton} onPress={handleEditProfile}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const RewardsModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showRewards}
        onRequestClose={() => setShowRewards(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Your Rewards</Text>
              <TouchableOpacity onPress={() => setShowRewards(false)}>
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              <View style={styles.rewardItem}>
                <MaterialIcons name="star" size={24} color="#FFD700" />
                <View style={styles.rewardInfo}>
                  <Text style={styles.rewardTitle}>10% Off Next Order</Text>
                  <Text style={styles.rewardDesc}>Unlock at Level 2</Text>
                </View>
              </View>
              <View style={styles.rewardItem}>
                <MaterialIcons name="local-shipping" size={24} color="#4CAF50" />
                <View style={styles.rewardInfo}>
                  <Text style={styles.rewardTitle}>Free Delivery</Text>
                  <Text style={styles.rewardDesc}>Unlock at Level 3</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderProgressBar = () => (
    <View style={styles.progressSection}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressTitle}>Level {level}</Text>
        <Text style={styles.progressPoints}>{points} Points</Text>
      </View>
      <View style={styles.progressBarContainer}>
        <Animated.View 
          style={[
            styles.progressBar,
            { 
              width: progressBarWidth,
              backgroundColor: progressBarColor,
            }
          ]} 
        />
        <View style={styles.progressMarkers}>
          {[...Array(5)].map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.marker,
                { backgroundColor: (points % 100) / 100 > (i + 1) / 5 ? '#fff' : 'rgba(255,255,255,0.3)' }
              ]} 
            />
          ))}
        </View>
      </View>
      <Text style={styles.progressText}>
        {100 - (points % 100)} points to next level
      </Text>
    </View>
  );

  if (!userProfile) return null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={handlePickImage} style={styles.imageContainer}>
            {renderProfileImage()}
            <View style={styles.editImageBadge}>
              <MaterialIcons name="camera-alt" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>{userProfile.name}</Text>
          <Text style={styles.userEmail}>{userProfile.email}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{orderStats.total || 0}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{points}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{level}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
        </View>

        {renderProgressBar()}
      </View>

      <TouchableOpacity style={styles.rewardsButton} onPress={() => setShowRewards(true)}>
        <MaterialIcons name="card-giftcard" size={24} color="#fff" />
        <Text style={styles.rewardsButtonText}>View Available Rewards</Text>
        <MaterialIcons name="chevron-right" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.menuContainer}>
        <EditableField 
          field="name" 
          value={userProfile.name} 
          icon={<Ionicons name="person-outline" size={24} color="#333" />} 
        />
        <EditableField 
          field="phone" 
          value={userProfile.phone} 
          icon={<MaterialIcons name="phone" size={24} color="#333" />} 
        />
        <EditableField 
          field="address" 
          value={userProfile.address} 
          icon={<MaterialIcons name="location-on" size={24} color="#333" />} 
        />
        
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome5 name="history" size={24} color="#333" />
          <Text style={styles.menuText}>Order History</Text>
          <MaterialIcons name="chevron-right" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <MaterialCommunityIcons name="frequently-asked-questions" size={24} color="#333" />
          <Text style={styles.menuText}>Help & Support</Text>
          <MaterialIcons name="chevron-right" size={24} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="#333" />
          <Text style={styles.menuText}>Logout</Text>
          <MaterialIcons name="chevron-right" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <RewardsModal />
      <EditProfileModal />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: 50,
  },
  header: {
    paddingVertical: 30,
    backgroundColor: '#4a90e2',
  },
  profileHeader: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4a90e2',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  userEmail: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  progressSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  progressPoints: {
    fontSize: 18,
    color: '#666',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e1e1e1',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  progressBar: {
    height: '100%',
  },
  progressMarkers: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  marker: {
    width: 2,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  rewardsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2ecc71',
    margin: 15,
    padding: 15,
    borderRadius: 10,
  },
  rewardsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 10,
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '50%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 10,
  },
  rewardInfo: {
    marginLeft: 15,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  rewardDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addressContainer: {
    flex: 1,
    marginLeft: 15,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  editInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  saveIcon: {
    marginRight: 10,
  },
  cancelIcon: {
    marginLeft: 10,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editIcon: {
    marginLeft: 10,
  },
  imageContainer: {
    position: 'relative',
  },
  editImageBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4a90e2',
    padding: 5,
    borderRadius: 10,
  },
});

export default ProfileScreen;
