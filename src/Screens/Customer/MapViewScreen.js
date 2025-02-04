import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useRoute } from "@react-navigation/native";

const MapViewScreen = () => {
  const route = useRoute();
  const { location } = route.params || {};

  const [mapKey, setMapKey] = useState(0); // Force re-render by changing key

  useEffect(() => {
    setMapKey(prevKey => prevKey + 1); // Update key to force rerender
  }, [location]);

  if (!location || !location.latitude || !location.longitude) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Location data is missing or invalid.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        key={mapKey} // Change key forces remount
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Shop Location"
          description="This is the shop's location."
        />
      </MapView>
    </View>
  );
};

export default MapViewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
});
