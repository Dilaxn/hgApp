import React from "react";
import { View, TouchableOpacity } from 'react-native'
import WebView from "react-native-webview";
import css from "../components/commonCss";
import { useNavigation } from "@react-navigation/native";
import HeaderTitle from "../components/ui/HeaderTitle";

export default function Browser1({ route }) {
    const navigation = useNavigation();
    let url = route.params.url;
    let title = route.params.title;
    return (
        <View style={[{ flex: 1, backgroundColor: '#fff', zIndex: 999999 }]}>
            <HeaderTitle title={title} />
            <WebView
                source={{ html: url }}
                automaticallyAdjustContentInsets={true}
                scalesPageToFit={false}
                style={[css.fm, css.f14, css.blackC, { margin: 20 }]}
            />
        </View>
    )
}