import { useEffect, useState } from "react";
import PlacesList from "../components/places/placesList";
import { useIsFocused } from "@react-navigation/native";

export default function AllPlaces({route}){
    console
    const [loadedPlace,setLoadedPlace]=useState([])
    const isFocused=useIsFocused()

    useEffect(()=>{
        if(isFocused && route.params){
            setLoadedPlace((currPlaces)=>[...currPlaces,route.params.place])
        }
    },[isFocused,route.params])


    return <PlacesList places={loadedPlace}/>
}