import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import OrdersReceivedScreen from '../Screens/Stores/OrderReceivedScreen';
import PromotionsScreen from '../Screens/Stores/PromotionsScreen';
import OrderScreen from '../Screens/Stores/OrderScreen';
import DeliveryScreen from '../Screens/Stores/DeliveryScreen';
import ProfileScreen from '../Screens/Stores/ProfileScreenStore';

const Tab = createBottomTabNavigator();

const BottomTabNavigatorStore = () => {
  return (
    <Tab.Navigator
      initialRouteName="Orders Received"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Orders Received':
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
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Orders Received" component={OrdersReceivedScreen} />
      <Tab.Screen name="Promotions" component={PromotionsScreen} />
      <Tab.Screen name="Order" component={OrderScreen} />
      <Tab.Screen name="Delivery" component={DeliveryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigatorStore;
