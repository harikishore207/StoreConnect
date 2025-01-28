import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/Screens/Signinup/LoginScreen';
import SignupScreen from './src/Screens/Signinup/SignupScreen';
import BottomTabNavigatorCustomer from './src/Navigation/BottomTabNavigatorCustomer';
import BottomTabNavigatorStore from './src/Navigation/BottomTabNavigatorStore';
import StoreRegistration from './src/Screens/Signinup/StoreRegistrationScreen';
import ShopDetails from './src/Screens/Customer/ShopDetails'; 
import MapViewScreen from './src/Screens/Customer/MapViewScreen';
import SetupProfileScreen from './src/Screens/Customer/SetupProfileScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
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
        {/* Add ShopDetails Screen */}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
