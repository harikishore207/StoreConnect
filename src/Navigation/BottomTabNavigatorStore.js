import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import OrdersReceivedScreen from '../Screens/Stores/OrderReceivedScreen';
import PromotionsScreen from '../Screens/Stores/PromotionsScreen';
import OrderScreen from '../Screens/Stores/OrderScreen';
import DeliveryScreen from '../Screens/Stores/DeliveryScreen';
import ProfileScreen from '../Screens/Stores/ProfileScreenStore';
import OrderDetailsScreen from '../Screens/Stores/OrderDetailsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const OrdersStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Orders Received" 
        component={OrdersReceivedScreen}
        options={{
          headerStyle: {
            backgroundColor: '#2e7d32',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen 
        name="OrderDetails" 
        component={OrderDetailsScreen}
        options={{ 
          title: 'Order Details',
          headerStyle: {
            backgroundColor: '#2e7d32',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
};

const BottomTabNavigatorStore = () => {
  return (
    <Tab.Navigator
      initialRouteName="Orders"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Orders':
              iconName = 'clipboard';
              break;
            case 'Promotions':
              iconName = 'megaphone';
              break;
            case 'Order':
              iconName = 'add-circle';
              break;
            case 'Delivery':
              iconName = 'bicycle';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'help-circle';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2e7d32',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Orders" 
        component={OrdersStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Promotions" component={PromotionsScreen} />
      <Tab.Screen name="Order" component={OrderScreen} />
      <Tab.Screen name="Delivery" component={DeliveryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigatorStore;
