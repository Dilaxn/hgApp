import { useState } from "react";
import { StyleSheet, View, Text, Pressable, Linking } from "react-native";
import css from "../commonCss";
import { useNavigation } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function InfoBar() {
    const navigation = useNavigation();
    const [infobarData, setInfobarData] = useState(true);
    return (
        <>
            {infobarData &&
                <View style={[styles.infoBarContainer]}>
                    <View style={[styles.infoBar]}>
                        <Text style={[styles.infoBarText]}>
                            <Text
                                style={[styles.infoBarSubText]}
                                onPress={() => navigation.navigate('Browser', { url: 'https://www.homegenie.com/en/covid-19-precautions' })}
                            >Learn more</Text>
                            {" "} about the {' '}
                            <Text style={[css.fsb, css.f11, css.whiteC]}>COVID-19 measures</Text>{" "}
                            we’re taking to ensure the safety of our customers and us.
                        </Text>
                    </View>
                    <Pressable android_ripple={{ color: '#525252' }} style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed]} onPress={() => setInfobarData(false)}>
                        <Text style={[styles.cancelButtonText]}>x</Text>
                    </Pressable>
                </View>
            }
        </>
    )
}

const styles = StyleSheet.create({
    infoBarContainer: { backgroundColor: "#f6b700", padding: 10, marginTop: -3, flexDirection: "row", justifyContent: "space-between", },
    infoBar: { textAlign: 'left', width: '85%' },
    infoBarText: { fontSize: wp('2.42%'), color: "#fff", letterSpacing: 0.1, fontFamily: 'PoppinsR' },
    infoBarSubText: { textDecorationLine: 'underline', textDecorationColor: '#fff', fontSize: wp('2.42%'), fontFamily: 'PoppinsR' },
    cancelButton: { paddingHorizontal: 10, },
    cancelButtonText: { color: '#fff', fontSize: wp('4.4%') },
    pressed: { opacity: 0.5 }
})