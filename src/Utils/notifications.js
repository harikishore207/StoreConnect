import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

// Initialize Firebase Messaging
const messaging = getMessaging();

// Request notification permissions
export const requestUserPermission = async () => {
  try {
    const authStatus = await messaging.requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  } catch (error) {
    console.error('Error requesting permission:', error);
  }
};

// Save FCM token to Firestore
export const saveFCMToken = async (userId) => {
  try {
    const currentToken = await getToken(messaging);
    if (currentToken) {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        fcmToken: currentToken
      });
      return currentToken;
    }
    return null;
  } catch (error) {
    console.error('Error saving FCM token:', error);
    return null;
  }
};

// Send notification
export const sendNotification = async (token, title, body, data = {}) => {
  try {
    const message = {
      token,
      notification: {
        title,
        body,
      },
      data,
    };

    // You'll need to implement a server-side function to send the notification
    // as Firebase Cloud Messaging requires a server key
    const response = await fetch('YOUR_SERVER_ENDPOINT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    return response.json();
  } catch (error) {
    console.error('Error sending notification:', error);
    return null;
  }
};

// Listen for messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

// Set up background handler
export const setBackgroundMessageHandler = () => {
  messaging.onBackgroundMessage((payload) => {
    console.log('Message handled in the background!', payload);
  });
};

// Set up foreground handler
export const setForegroundMessageHandler = (callback) => {
  return messaging.onMessage((payload) => {
    console.log('Received foreground message:', payload);
    if (callback) {
      callback(payload);
    }
  });
};
