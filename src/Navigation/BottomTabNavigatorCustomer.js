import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../Screens/Customer/HomeScreen';
import StoreScreen from '../Screens/Customer/StoreScreen';
import OrderScreen from '../Screens/Customer/OrderScreenCustomer';
import CartScreen from '../Screens/Customer/CartScreen';
import ProfileScreen from '../Screens/Customer/ProfileScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigatorCustomer = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Store':
              iconName = 'storefront';
              break;
            case 'Order':
              iconName = 'add-circle';
              break;
            case 'Cart':
              iconName = 'cart';
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
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Store" component={StoreScreen} />
      <Tab.Screen name="Order" component={OrderScreen} options={{ tabBarLabel: 'Order' }} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigatorCustomer;
