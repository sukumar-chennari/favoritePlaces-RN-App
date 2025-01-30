import { useCallback, useLayoutEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useFocusEffect } from "@react-navigation/native"; // ✅ Ensure reset when returning
import IconButton from "../components/UI/iconButton";

export default function Map({ navigation }) {
    const [selectedLocation, setSelectedLocation] = useState(null);

    const region = {
        latitude: 17.4317263,
        longitude: 78.3822525,
        latitudeDelta: 0.0924,
        longitudeDelta: 0.0423,
    };

    function selectLocationHandler(event) {
        const lat = event.nativeEvent.coordinate.latitude;
        const lng = event.nativeEvent.coordinate.longitude;

        setSelectedLocation({ lat, lng });
    }

    const savePickedLocationHandler = useCallback(() => {
        if (!selectedLocation) {
            Alert.alert("No location picked", "You have to pick a location (by tapping on the map) first!");
            return;
        }

        navigation.navigate("AddPlace", {
            pickedLat: selectedLocation.lat,
            pickedLng: selectedLocation.lng,
        });
    }, [navigation, selectedLocation]);

    useLayoutEffect(() => {
        if (!navigation) return; // ✅ Prevents crashes if `navigation` is undefined

        navigation.setOptions({
            headerRight: ({ tintColor }) => (
                <IconButton icon={"save"} size={24} color={tintColor} onPress={savePickedLocationHandler} />
            ),
        });
    }, [navigation, savePickedLocationHandler, selectedLocation]); // ✅ Only updates when selection changes

    useFocusEffect(
        useCallback(() => {
            setSelectedLocation(null); // ✅ Reset selection when returning to map
        }, [])
    );

    return (
        <View style={styles.container}>
            <MapView style={styles.map} initialRegion={region} onPress={selectLocationHandler}>
                {selectedLocation && (
                    <Marker title="Picked Location" coordinate={{ latitude: selectedLocation.lat, longitude: selectedLocation.lng }} />
                )}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
});
