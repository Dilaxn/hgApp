import React from "react";
import { View } from 'react-native'
import WebView from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import HeaderTitle from "../components/ui/HeaderTitle";

export default function Browser({ route }) {
    const navigation = useNavigation();
    let url = route.params.url;
    return (
        <View style={{ flex: 1, zIndex: 999999 }}>
            <HeaderTitle title='HomeGenie' />
            <WebView
                source={{ uri: url }}
                style={{ flex: 1 }}
            />
        </View>
    )
}