import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, addDoc, getFirestore, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { CartContext } from '../Customer/CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PlaceholderImage from '../../components/PlaceholderImage';
import { formatCurrency } from '../../Utils/currency';
import { products } from '../../../assets/data';

const getProductImage = (category, imageName) => {
  if (!category || !imageName) {
    console.log('Missing category or imageName');
    return null;
  }

  // Find the product in data.js that matches the category and filename
  const product = products.find(p => 
    p.category === category && 
    (p.id + '.png') === imageName
  );

  if (!product) {
    console.log('Product not found in data.js for category:', category, 'imageName:', imageName);
    return null;
  }

  return product.image;
};

const OrderSummary = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { deliveryDetails } = route.params;
  const auth = getAuth();
  const db = getFirestore();
  const { cartItems, removeFromCart } = React.useContext(CartContext);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        } else {
          console.error("No user data found");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (auth.currentUser) {
      fetchUserDetails();
    }
  }, [auth.currentUser, db]);

  if (!auth.currentUser) {
    navigation.navigate('Login');
    return null;
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const clearCart = async () => {
    try {
      // Remove all items from the cart
      cartItems.forEach(item => {
        removeFromCart(item.id);
      });
      await AsyncStorage.removeItem('cart');
      console.log('Cart cleared successfully');
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  const handleConfirmOrder = async () => {
    if (!userDetails) {
      Alert.alert('Error', 'Unable to place order. User details not found.');
      return;
    }

    try {
      const orderData = {
        userId: auth.currentUser?.uid || '',
        userName: userDetails.name || '',
        userPhone: userDetails.phone || '',
        userAddress: userDetails.address || '',
        shopId: deliveryDetails.shop?.id || '',
        shopName: deliveryDetails.shop?.storeName || '',
        deliveryType: deliveryDetails.type || 'pickup',
        status: 'pending',
        createdAt: serverTimestamp(),
        totalAmount: cartItems.reduce((total, item) => total + item.price, 0),
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name || '',
          brand: item.brand || '',
          quantity: item.quantity || 0,
          price: item.price || 0,
          productId: item.productId || '',
          category: item.category || ''
        }))
      };

      // Add optional fields based on delivery type
      if (deliveryDetails.type === 'pickup') {
        orderData.pickupDate = deliveryDetails.pickupDate || '';
        orderData.pickupTime = deliveryDetails.pickupTime || '';
      } else if (deliveryDetails.type === 'delivery') {
        orderData.deliveryAddress = deliveryDetails.address || '';
        orderData.phoneNo = deliveryDetails.phoneNo || '';
      }

      const ordersRef = collection(db, 'orders');
      await addDoc(ordersRef, orderData);

      // Clear the cart after successful order
      await clearCart();

      Alert.alert(
        'Success',
        'Your order has been placed successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('CustomerHome')
          }
        ]
      );
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    }
  };

  const renderCartItem = (item) => (
    <View key={item.id} style={styles.itemContainer}>
      <PlaceholderImage 
        source={item.image} 
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemBrand}>{item.brand}</Text>
        <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
        <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Order Summary</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shop Details</Text>
        <Text style={styles.text}>Name: {deliveryDetails.shop.storeName}</Text>
        <Text style={styles.text}>Location: {deliveryDetails.shop.address}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ordered Items</Text>
        {cartItems.map((item, index) => renderCartItem(item))}
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalAmount}>
            {formatCurrency(cartItems.reduce((total, item) => total + item.price, 0))}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Details</Text>
        <Text style={styles.text}>Name: {userDetails?.name || 'Loading...'}</Text>
        <Text style={styles.text}>Phone: {userDetails?.phone || 'Loading...'}</Text>
        <Text style={styles.text}>Address: {userDetails?.address || 'Loading...'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Method</Text>
        <Text style={styles.text}>{deliveryDetails.type === 'pickup' ? 'Store Pickup' : 'Door Delivery'}</Text>

        {deliveryDetails.type === 'pickup' ? (
          <>
            <Text style={styles.text}>
              Pickup Date: {formatDate(deliveryDetails.pickupDate)}
            </Text>
            <Text style={styles.text}>
              Pickup Time: {deliveryDetails.pickupTime}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.text}>Delivery Address: {deliveryDetails.address}</Text>
            <Text style={styles.text}>Phone Number: {deliveryDetails.phoneNo}</Text>
          </>
        )}
      </View>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => {
          Alert.alert(
            'Confirm Order',
            'Are you sure you want to place this order?',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Confirm',
                onPress: handleConfirmOrder,
              },
            ],
            { cancelable: true }
          );
        }}
      >
        <Text style={styles.confirmButtonText}>Confirm Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#ff5722',
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    color: '#444',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  itemBrand: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ff5722',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff5722',
  },
  confirmButton: {
    backgroundColor: '#ff5722',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OrderSummary;
