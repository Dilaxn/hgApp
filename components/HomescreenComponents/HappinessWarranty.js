import { StyleSheet, View, Text, Image, Dimensions } from "react-native";
import css from "../commonCss";
import MyText from "../MyText";
import TextComp from "../TextComp";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const imgPath = '../../assets/icons/';
const windowWidth = Dimensions.get('window').width;

export default function HappinessWaranty() {
    return (
        <View style={styles.section}>
            <Text style={[styles.homeTitles, css.textCenter]}>
                HomeGenie Happiness Warranty
            </Text>
            <View style={[css.flexDRSB]}>
                <Image
                    source={require(imgPath + "hgWarranty.png")}
                    style={[styles.warrantyImage]}
                />
                <Text style={[styles.content]}>
                    All service bookings are covered with at least an <TextComp family={css.fbo} size={css.f12}> AED 1000 </TextComp>
                    warranty against any damages.{" "}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    section: {
        padding: 20,
        paddingBottom: 0
    },
    pressed: { opacity: 0.5 },
    homeTitles: {
        color: "#2EB0E4",
        textTransform: "uppercase",
        fontSize: wp('3.9%'),
        marginBottom: 10,
        fontFamily: 'PoppinsSB',
    },
    warrantyImage: {
        width: 130,
        height: 110,
    },
    content: {
        textAlignVertical: "center",
        fontSize: wp('3%'),
        color: '#525252',
        flex: 1,
        paddingLeft: 10,
        fontFamily: 'PoppinsM',
    },
})