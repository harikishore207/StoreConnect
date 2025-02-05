import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CartProvider } from './src/Screens/Customer/CartContext';
import LoginScreen from './src/Screens/Signinup/LoginScreen';
import SignupScreen from './src/Screens/Signinup/SignupScreen';
import BottomTabNavigatorCustomer from './src/Navigation/BottomTabNavigatorCustomer';
import BottomTabNavigatorStore from './src/Navigation/BottomTabNavigatorStore';
import StoreRegistration from './src/Screens/Signinup/StoreRegistrationScreen';
import ShopDetails from './src/Screens/Customer/ShopDetails'; 
import MapViewScreen from './src/Screens/Customer/MapViewScreen';
import SetupProfileScreen from './src/Screens/Customer/SetupProfileScreen';
import CartScreen from './src/Screens/Customer/CartScreen'; 
import SelectShopScreen from './src/Screens/Customer/SelectShopScreen';
import DeliveryOptionsScreen from './src/Screens/Customer/DeliveryOptionsScreen';
import OrderSummary from './src/Screens/Customer/OrderSummary';

const Stack = createStackNavigator();

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
            options={{ headerTitle: "Your Cart" }}
          />
          <Stack.Screen
            name="SelectShopScreen"
            component={SelectShopScreen}
            options={{ headerTitle: "Select a Shop" }}
          />
          <Stack.Screen
            name="DeliveryOptions"
            component={DeliveryOptionsScreen}
            options={{ headerTitle: "Delivery Options" }}
          />
          <Stack.Screen
            name="OrderSummary"
            component={OrderSummary}
            options={{ headerTitle: "Order Summary" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
};

export default App;
