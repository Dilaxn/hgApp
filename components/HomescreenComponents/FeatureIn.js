import { StyleSheet, View, Text, Dimensions, Image } from "react-native";
import css from "../commonCss";
const imgPath = '../../assets/icons/';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function FeatureIn() {
    return (
        <View style={styles.section}>
            <View>
                <Text style={styles.title}>Featured in</Text>
                <View style={[css.flexDRSB, css.spaceB10]}>
                    <Image style={[styles.image]} source={require(imgPath + "gulfNews.png")} />
                    <Image style={[styles.image]} source={require(imgPath + "khaleejTimes.png")} />
                    <Image style={[styles.image]} source={require(imgPath + "theNational.png")} />
                </View>
                <View style={css.flexDRSB}>
                    <Image style={[styles.image]} source={require(imgPath + "business.png")} />
                    <Image style={[styles.image]} source={require(imgPath + "247.png")} />
                    <Image style={[styles.image]} source={require(imgPath + "forbes.png")} />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    section: {
        padding: 20,
        paddingBottom: 0
    },
    title: {
        textTransform: "uppercase",
        fontSize: wp('3.9%'),
        marginBottom: 20,
        textAlign: "center",
        color: "#525252",
        fontFamily: 'PoppinsSB'
    },
    image: { resizeMode: 'contain', width: 100 }
})