import { StyleSheet, View, Text, Image, Dimensions } from "react-native";
import css from "../commonCss";
const imgPath = '../../assets/icons/';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const windowWidth = Dimensions.get('window').width;

export default function WhyHomeGenie() {
    return (
        <View style={styles.section}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Why HomeGenie?</Text>
                <View style={css.flexDRSB}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={require(imgPath + "expert.png")}
                            style={styles.imageCenter}
                        />
                        <Text style={styles.text}>
                            Expert {"\n"} professionals
                        </Text>
                    </View>
                    <View style={styles.imageContainer}>
                        <Image
                            source={require(imgPath + "priceverification.png")}
                            style={styles.imageCenter}
                        />
                        <Text style={styles.text}>Great {"\n"} prices</Text>
                    </View>
                    <View style={styles.imageContainer}>
                        <Image
                            source={require(imgPath + "oneshop.png")}
                            style={styles.imageCenter}
                        />
                        <Text style={styles.text}>One-stop {"\n"} shop</Text>
                    </View>
                </View>
                <View style={css.flexDRSB}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={require(imgPath + "qualityControl.png")}
                            style={styles.imageCenter}
                        />
                        <Text style={styles.text}>
                            Enabling {"\n"} technology
                        </Text>
                    </View>
                    <View style={styles.imageContainer}>
                        <Image
                            source={require(imgPath + "customerService.png")}
                            style={styles.imageCenter}
                        />
                        <Text style={styles.text}>
                            World-class {"\n"} service
                        </Text>
                    </View>
                    <View style={styles.imageContainer}>
                        <Text style={styles.text}>... and {"\n"} more!</Text>
                    </View>
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
    pressed: { opacity: 0.5 },
    titleContainer: {
        backgroundColor: "#EFF7FC",
        borderRadius: 20,
        padding: 20,
    },
    title: {
        textAlign: "center",
        fontSize: wp('4.85%'),
        color: "#525252",
        fontFamily: 'PoppinsSB'
    },
    imageContainer: {
        marginTop: 20,
        alignItems: "center",
        flex: 1,
    },
    imageCenter: {
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        textAlignVertical: "bottom",
        fontSize: wp('3.4%'),
        flex: 1,
        textAlign: "center",
        fontFamily: 'PoppinsM',
        color: '#525252',
    },
})