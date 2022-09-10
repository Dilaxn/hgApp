import React, { useEffect, useState } from "react";
import { View, StyleSheet, Platform, Text } from 'react-native'
import WebView from "react-native-webview";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { saveCardApi } from "../reducers/jobDetailReducer";
import { hideLoading, showLoading } from "../reducers/appReducer";

export default function BrowserNoBack({ route }) {

    const navigation = useNavigation();
    const dispatch = useDispatch();

    let url = route.params.url;
    let jobId = route.params.jobId;
    let amount = route.params.amount;

    console.log('successParamsData', {
        url, jobId, amount
    });

    const [webUrl, setWebUrl] = useState(null);
    const [getActualURL, setActualURL] = useState(url);
    const [urlCount, setUrlCount] = useState(0)
    const [isListening, setListening] = useState(true)

    useEffect(() => {

        // const i = urlCount + 1
        // setUrlCount(i);
        // console.log("urlCount", urlCount)
        // //success at i == 4

        const listening = isListening;

        if (listening && webUrl != null && webUrl?.includes('genie')) {

            setListening(false);

            if (webUrl?.includes('paymentInfo')) {
                console.log('payment Success from WebView');

                navigation.replace("PaymentStatus", {
                    jobId: jobId, amount: amount
                })

            } else {
                navigation.replace("PaymentStatus", {
                    jobId: jobId, amount: amount
                })
            }
        }
    }, [webUrl]);

    const handleNavigation = (event) => {
        const locationUrl = event.url;
        console.log('locationUrl', locationUrl);
        if (locationUrl != webUrl) {
            setWebUrl(locationUrl);
        }
    }

    return (
        <View style={{ flex: 1, zIndex: 999999 }}>
            <View style={[styles.header]}>
                <Text style={[styles.headerTitle, { textAlign: 'center' }]}>HomeGenie</Text>
            </View>
            <WebView
                source={{ uri: getActualURL }}
                style={{ flex: 1 }}
                onNavigationStateChange={handleNavigation}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    header: {
        width: "100%",
        height: 70,
        padding: 20,
        backgroundColor: "#2eb0e4",
        justifyContent: "center",
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: Platform.OS === 'android' ? 10 : 0,
        shadowColor: "#000",
    },
    headerTitle: {
        color: "#fff",
        fontSize: wp('4.85%'),
        fontFamily: 'PoppinsSB',
        textTransform: "uppercase",
    },
})