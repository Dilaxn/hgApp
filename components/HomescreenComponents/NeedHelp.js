import { StyleSheet, View } from "react-native";
import css from "../commonCss";
import TextComp from "../TextComp";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Whatsapp from "../whtsApp";

export default function NeedHelp() {
    return (
        <View style={[styles.section]}>
            <View style={[css.flexDRSB]}>
                <View style={[css.alignSelfC]}>
                    <TextComp color={css.brandC} size={css.f16} family={css.fbo}>Need Help?</TextComp>
                </View>
                <Whatsapp />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    section: { padding: 20 },
    title: {
        textTransform: "uppercase",
        fontSize: wp('3.9%'),
        marginBottom: 20,
        textAlign: "center",
        color: "#525252",
        fontFamily: 'PoppinsSB'
    },
})