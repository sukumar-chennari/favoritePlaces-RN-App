import { useState } from "react";
import { DrawerLayoutAndroidBase, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Colors } from "../../constants/colors";
import ImagePicker from "./imagePicker";
import LocationPicker from "./locationPicker";
import Button from "../UI/button";

export default function PlaceForm(){
    const [enteredTitle,setEnteredTitle]=useState('')

    function changeTitleHandler(enteredText){
        setEnteredTitle(enteredText)
    }

    function savePlaceHandler(){

    }
    return <ScrollView style={styles.form}>
            <View>
                <Text style={styles.label}>Title</Text>
                <TextInput style={styles.input} onChangeText={changeTitleHandler} value={enteredTitle}/>
            </View>
            <ImagePicker/>
            <LocationPicker/>
            <Button onPress={savePlaceHandler}>Add Place</Button>
        </ScrollView>
}

const styles=StyleSheet.create({
    form:{
        flex:1,
        padding:24,
    },
    label:{
        fontWeight:'bold',
        marginBottom:4,
        color:Colors.primary500
    },
    input:{
        marginVertical:8,
        paddingHorizontal:4,
        paddingVertical:8,
        fontSize:16,
        borderBottomColor:Colors.primary700,
        borderBottomWidth:2,
        backgroundColor:Colors.primary100
    }
})