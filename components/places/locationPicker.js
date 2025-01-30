import { Alert, Image, StyleSheet, Text, View } from "react-native";
import OutlinedButton from "../UI/outlinedButton";
import { Colors } from "../../constants/colors";
import { getCurrentPositionAsync, PermissionStatus, useForegroundPermissions } from "expo-location";
import { useEffect, useState } from "react";
import getMapPreview, { getAddress } from "../../util/location";
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";

export default function LocationPicker({onPickLocation}) {
    const [locationPermissionInformation, requestPermission] = useForegroundPermissions();
    const [pickedLocation, setPickedLocation] = useState(null);

    const navigation = useNavigation();
    const route = useRoute();
    const isFocused=useIsFocused()
    // ✅ Fixed syntax error & ensured it does not break when `route.params` is undefined
    

    async function verifyPermission() {
        if (!locationPermissionInformation) {
            return false;
        }

        if (locationPermissionInformation.status === PermissionStatus.GRANTED) {
            return true;
        }

        if (locationPermissionInformation.status === PermissionStatus.UNDETERMINED) {
            try {
                const permissionResponse = await requestPermission();
                return permissionResponse.granted;
            } catch (error) {
                Alert.alert("Error", "Something went wrong while requesting permissions.");
                return false;
            }
        }

        if (locationPermissionInformation.status === PermissionStatus.DENIED) {
            if (locationPermissionInformation.canAskAgain) {
                try {
                    const permissionResponse = await requestPermission();
                    return permissionResponse.granted;
                } catch (error) {
                    Alert.alert("Error", "Something went wrong while requesting permissions.");
                    return false;
                }
            } else {
                Alert.alert(
                    "Location Access Denied",
                    "You have permanently denied location access. Please enable it manually in your device settings."
                );
                return false;
            }
        }

        return false;
    }

    
    useEffect(() => {
        if(isFocused && route.params){
            const mapPickedLocation =  { 
                lat: route.params.pickedLat,
                lng: route.params.pickedLng 
            } 
            setPickedLocation(mapPickedLocation);
        }
        
           
        
    }, [route,isFocused]);

    useEffect(()=>{

        async function handleLocation() {
            if(pickedLocation){
                const address=getAddress(pickedLocation.lat,pickedLocation.lng)
                onPickLocation({...pickedLocation,address:address})
               
            }

        }
        handleLocation()

        
        
    },[pickedLocation,onPickLocation])

    async function getLocationHandler() {
        const hasPermission = await verifyPermission();
        if (!hasPermission) {
            return;
        }

        try {
            const location = await getCurrentPositionAsync();
            setPickedLocation({
                lat: location.coords.latitude,
                lng: location.coords.longitude,
            });
        } catch (error) {
            Alert.alert("Could not fetch location!", "Please try again or select a location on the map.");
        }
    }

    function pickOnMapHandler() {
        navigation.navigate("Map");
    }

    let locationPreview = <Text>No location picked yet.</Text>;
    if (pickedLocation) {
        locationPreview = (
            <Image
                style={styles.image}
                source={{ uri: getMapPreview(pickedLocation.lat, pickedLocation.lng) }}
            />
        );
    }

    return (
        <View>
            <View style={styles.mapPreview}>{locationPreview}</View>
            <View style={styles.actions}>
                <OutlinedButton icon={"location"} onPress={getLocationHandler}>
                    Locate User
                </OutlinedButton>
                <OutlinedButton onPress={pickOnMapHandler} icon={"map"}>
                    Pick on Map
                </OutlinedButton>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mapPreview: {
        width: "100%",
        height: 200,
        marginVertical: 8,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.primary100,
        borderRadius: 4,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10, // Add spacing between buttons
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 4,
    },
});
