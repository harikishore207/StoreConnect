import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CartProvider } from './src/Screens/Customer/CartContext';
import LoginScreen from './src/Screens/Signinup/LoginScreen';
import SignupScreen from './src/Screens/Signinup/SignupScreen';
import BottomTabNavigatorCustomer from './src/Navigation/BottomTabNavigatorCustomer';
import StoreRegistration from './src/Screens/Signinup/StoreRegistrationScreen';
import ShopDetails from './src/Screens/Customer/ShopDetails'; 
import MapViewScreen from './src/Screens/Customer/MapViewScreen';
import SetupProfileScreen from './src/Screens/Customer/SetupProfileScreen';
import CartScreen from './src/Screens/Customer/CartScreen'; 
import SelectShopScreen from './src/Screens/Customer/SelectShopScreen';
import DeliveryOptionsScreen from './src/Screens/Customer/DeliveryOptionsScreen';
import OrderSummary from './src/Screens/Customer/OrderSummary';
import BottomTabNavigatorStore from './src/Navigation/BottomTabNavigatorStore';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Signup">
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CustomerHome"
            component={BottomTabNavigatorCustomer}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="StoreOwnerHome"
            component={BottomTabNavigatorStore}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="StoreRegistration"
            component={StoreRegistration}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ShopDetails"
            component={ShopDetails}
            options={{ headerTitle: "Shop Details" }} 
          />
          <Stack.Screen
            name="MapViewScreen"
            component={MapViewScreen}
            options={{ headerTitle: "Shop Location" }}
          />
          <Stack.Screen
            name="SetupProfileScreen"
            component={SetupProfileScreen}
            options={{ headerTitle: "Setup Your Profile" }}
          />
          <Stack.Screen
            name="CartScreen"
            component={CartScreen}
            options={{
              headerStyle: {
                backgroundColor: '#2e7d32',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerTitle: "Your Cart"
            }}
          />
          <Stack.Screen
            name="SelectShopScreen"
            component={SelectShopScreen}
            options={{
              title: 'Select a Shop',
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
            name="DeliveryOptions"
            component={DeliveryOptionsScreen}
            options={{
              title: 'Delivery Options',
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
            name="OrderSummary"
            component={OrderSummary}
            options={{
              title: 'Order Summary',
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
      </NavigationContainer>
    </CartProvider>
  );
};

export default App;
