import { Alert, Button, Image, StyleSheet, Text, View } from "react-native";
import { launchCameraAsync, PermissionStatus, useCameraPermissions } from 'expo-image-picker';
import { useState } from "react";
import { Colors } from "../../constants/colors";
import OutlinedButton from "../UI/outlinedButton";

export default function ImagePicker() {
    const [cameraPermissionInformation, requestPermission] = useCameraPermissions();
    const [pickedImage, setPickedImage] = useState(null);

    async function verifyPermission() {
        if (!cameraPermissionInformation) {
            return false;
        }

        if (cameraPermissionInformation.status === PermissionStatus.UNDETERMINED) {
            const permissionResponse = await requestPermission();
            return permissionResponse.granted;
        }

        if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
            Alert.alert("Insufficient Permissions!", "You need to grant camera permissions to use this app.");
            return false;
        }

        return true;
    }

    async function takeImageHandler() {
        const hasPermission = await verifyPermission();
        if (!hasPermission) {
            return;
        }

        const image = await launchCameraAsync({
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.5,
        });

        if (!image.canceled) {
            setPickedImage(image.assets[0].uri);
        }
    }

    let imagePreview = <Text>No Image taken yet.</Text>;
    if (pickedImage) {
        imagePreview = <Image style={styles.image} source={{ uri: pickedImage }} />;
    }

    return (
        <View>
            <View style={styles.imagePreview}>
                {imagePreview}
            </View>
            <OutlinedButton icon={"camera"} onPress={takeImageHandler}>Take Image</OutlinedButton>
        </View>
    );
}

const styles = StyleSheet.create({
    imagePreview: {
        width: "100%",
        height: 200,
        marginVertical: 8,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.primary100,
        borderRadius: 4,
    },
    image: {
        width: "100%",
        height: "100%",
    },
});
