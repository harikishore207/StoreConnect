import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../Utils/firebase';
import { getAuth } from 'firebase/auth';

const DeliveryOptionsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { shop } = route.params;
  const auth = getAuth();

  const [deliveryType, setDeliveryType] = useState('');
  const [pickupDate, setPickupDate] = useState(new Date());
  const [pickupTime, setPickupTime] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [loading, setLoading] = useState(true);
  const [manualTimeInput, setManualTimeInput] = useState('');
  const [showManualTimeInput, setShowManualTimeInput] = useState(false);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setAddress(userData.address || '');
          setPhoneNo(userData.phoneNo || '');
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setLoading(false);
    }
  };

  const formatDisplayDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const showDatePicker = () => {
    Alert.alert(
      'Select Date',
      'Choose a date for pickup',
      [
        {
          text: 'Today',
          onPress: () => setPickupDate(new Date()),
        },
        {
          text: 'Tomorrow',
          onPress: () => {
            const tomorrow = new Date();
            tomorrow.setDate(new Date().getDate() + 1);
            setPickupDate(tomorrow);
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const validateAndSetTime = (timeString) => {
    // Regular expression to match both HH:mm and h:mm formats
    const timeRegex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;
    
    if (!timeRegex.test(timeString)) {
      Alert.alert('Invalid Time', 'Please enter time in HH:mm format (e.g., 14:30 or 09:00)');
      return false;
    }

    const [hours, minutes] = timeString.split(':').map(Number);
    const selectedTime = new Date(pickupDate); // Use pickupDate instead of new Date()
    selectedTime.setHours(hours, minutes, 0);

    // Check if time is within business hours (9 AM to 8 PM)
    if (hours < 9 || hours > 20) {
      Alert.alert('Invalid Time', 'Please select a time between 9:00 and 20:00');
      return false;
    }

    // If same day, check if time is at least 1 hour ahead
    if (pickupDate.toDateString() === new Date().toDateString()) {
      const minTime = new Date();
      minTime.setHours(minTime.getHours() + 1);
      if (selectedTime < minTime) {
        Alert.alert('Invalid Time', 'Please select a time at least 1 hour from now');
        return false;
      }
    }

    // Format time in 12-hour format
    const formattedHour = selectedTime.getHours() % 12 || 12;
    const period = selectedTime.getHours() >= 12 ? 'PM' : 'AM';
    const formattedTime = `${formattedHour}:${minutes.toString().padStart(2, '0')} ${period}`;
    
    setPickupTime(formattedTime);
    return true;
  };

  const showTimePicker = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    // Generate time slots starting from the next hour
    const timeSlots = [];
    let startHour = currentHour + 1;

    if (currentMinute > 30) {
      startHour += 1;
    }

    for (let i = 0; i < 8; i++) {
      const hour = startHour + i;
      if (hour >= 9 && hour <= 20) {
        const time = new Date();
        time.setHours(hour, 0, 0);
        
        const formattedHour = time.getHours() % 12 || 12;
        const period = time.getHours() >= 12 ? 'PM' : 'AM';
        const formattedTime = `${formattedHour}:00 ${period}`;
        timeSlots.push(formattedTime);
      }
    }

    if (timeSlots.length === 0) {
      Alert.alert(
        'No Time Slots Available',
        'No more pickup slots available for today. Please select tomorrow.',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Select Time',
      'Choose a pickup time',
      [
        ...timeSlots.map(time => ({
          text: time,
          onPress: () => setPickupTime(time),
        })),
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const handleManualTimeSubmit = () => {
    if (validateAndSetTime(manualTimeInput)) {
      setShowManualTimeInput(false);
      setManualTimeInput('');
    }
  };

  const handleProceed = () => {
    if (!deliveryType) {
      Alert.alert('Error', 'Please select a delivery type');
      return;
    }

    if (deliveryType === 'pickup') {
      if (!pickupTime) {
        Alert.alert('Error', 'Please select a pickup time');
        return;
      }
    } else if (deliveryType === 'delivery') {
      if (!address.trim()) {
        Alert.alert('Error', 'Please provide a delivery address');
        return;
      }
      if (!phoneNo.trim()) {
        Alert.alert('Error', 'Please provide a phone number');
        return;
      }
    }

    const formattedDate = pickupDate.toISOString().split('T')[0];

    const deliveryDetails = {
      type: deliveryType,
      shop: route.params.shop,
    };

    if (deliveryType === 'pickup') {
      deliveryDetails.pickupDate = formattedDate;
      deliveryDetails.pickupTime = pickupTime;
    } else {
      deliveryDetails.address = address.trim();
      deliveryDetails.phoneNo = phoneNo.trim();
    }

    navigation.navigate('OrderSummary', { deliveryDetails });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Select Delivery Option</Text>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            deliveryType === 'pickup' && styles.selectedOption,
          ]}
          onPress={() => setDeliveryType('pickup')}
        >
          <Text style={[
            styles.optionText,
            deliveryType === 'pickup' && styles.selectedOptionText,
          ]}>Store Pickup</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButton,
            deliveryType === 'delivery' && styles.selectedOption,
          ]}
          onPress={() => setDeliveryType('delivery')}
        >
          <Text style={[
            styles.optionText,
            deliveryType === 'delivery' && styles.selectedOptionText,
          ]}>Door Delivery</Text>
        </TouchableOpacity>
      </View>

      {deliveryType === 'pickup' && (
        <View style={styles.dateTimeContainer}>
          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={showDatePicker}
          >
            <Text style={styles.dateTimeButtonText}>
              Select Date: {formatDisplayDate(pickupDate)}
            </Text>
          </TouchableOpacity>

          <View style={styles.timeInputContainer}>
            <TouchableOpacity
              style={[styles.dateTimeButton, { flex: 1, marginRight: 10 }]}
              onPress={showTimePicker}
            >
              <Text style={styles.dateTimeButtonText}>
                Select Time: {pickupTime || 'Not Selected'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dateTimeButton, { width: 100 }]}
              onPress={() => setShowManualTimeInput(!showManualTimeInput)}
            >
              <Text style={styles.dateTimeButtonText}>
                {showManualTimeInput ? 'Hide Input' : 'Type Time'}
              </Text>
            </TouchableOpacity>
          </View>

          {showManualTimeInput && (
            <View style={styles.manualTimeContainer}>
              <TextInput
                style={styles.timeInput}
                placeholder="Enter time (HH:mm)"
                value={manualTimeInput}
                onChangeText={setManualTimeInput}
                keyboardType="numbers-and-punctuation"
                maxLength={5}
              />
              <TouchableOpacity
                style={styles.submitTimeButton}
                onPress={handleManualTimeSubmit}
              >
                <Text style={styles.submitTimeButtonText}>Set Time</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {deliveryType === 'delivery' && (
        <View style={styles.deliveryContainer}>
          <Text style={styles.label}>Delivery Address</Text>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={3}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter your delivery address"
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phoneNo}
            onChangeText={setPhoneNo}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />
        </View>
      )}

      <TouchableOpacity
        style={[styles.proceedButton, !deliveryType && styles.disabledButton]}
        onPress={handleProceed}
        disabled={!deliveryType}
      >
        <Text style={styles.proceedButtonText}>Proceed</Text>
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
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  optionButton: {
    flex: 1,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedOption: {
    backgroundColor: '#ff5722',
    borderColor: '#ff5722',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: 'white',
  },
  pickupContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  dateTimeContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  dateTimeButton: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  dateTimeButtonText: {
    fontSize: 16,
    color: '#333',
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  manualTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  timeInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: 'white',
  },
  submitTimeButton: {
    backgroundColor: '#ff5722',
    padding: 10,
    borderRadius: 5,
    width: 100,
  },
  submitTimeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  deliveryContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  proceedButton: {
    backgroundColor: '#ff5722',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  proceedButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DeliveryOptionsScreen;