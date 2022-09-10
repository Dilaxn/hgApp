import React, { component } from 'react';
import { Alert } from "react-native";
//import { useNavigation } from "@react-navigation/native";

export default function AlertError({ messageOne, messageTwo }) {
    //const navigation = useNavigation();
    return Alert.alert(messageOne, messageTwo)
}
