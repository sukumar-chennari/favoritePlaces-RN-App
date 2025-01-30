import { FlatList, StyleSheet, Text, View } from "react-native";
import Placeitem from "./placeItem";
import { Colors } from "../../constants/colors";

export default function PlacesList({places}){
    if(!places || places.length ===0){
        return <View style={styles.fallbackContainer}>
            <Text style={styles.fallbackText}>No Places added yet- start adding some!</Text>
        </View>
    }
    return <FlatList
    style={styles.list}
        data={places}
        keyExtractor={(item)=> item.id}
        renderItem={({item})=><Placeitem place={item}/>}
    />
}

const  styles=StyleSheet.create({
    fallbackContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    fallbackText:{
        fontSize:16,
        color:Colors.primary200
    },
    list:{
        margin:24
    }
})