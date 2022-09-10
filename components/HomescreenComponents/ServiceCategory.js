import { StyleSheet, View, Pressable, Text, Dimensions, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import css from "../commonCss";
import TextComp from "../TextComp";
const imgPath = '../../assets/icons/';
import { useDispatch, useSelector } from "react-redux";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { getServices } from "../../reducers/categoryReducer";

export default function ServiceCategory({ propData, onPress }) {

    const services = useSelector(getServices);

    const navigation = useNavigation();
    console.log('propData [serviceCategory] : ', propData);

    console.log("SERVICES!!!! ", services.length)

    const getImage = (val) => {

        const x = val?.toLowerCase();

        if (x == "dailyutilities") {
            return require(imgPath + "Handyman.png")
        }

        if (x == "healthandwellness" || x == "healthwellness") {
            return require(imgPath + "pcr.png")
        }

        if (x == "lifestyledecor") {
            return require(imgPath + "Lifestyle.png")
        }

        if (x == "others") {
            return require(imgPath + "pet_groom.png")
        }

        return require(imgPath + "pet_groom.png")
    }

    const getContent = (val) => {

        const x = val?.toLowerCase();

        if (x == "dailyutilities") {
            return "DAILY\nUTILITIES"
        }

        if (x == "healthandwellness" || x == "healthwellness") {
            return "Health & \nWellness"
        }

        if (x == "lifestyledecor") {
            return "Lifestyle \n& Decor"
        }

        if (x == "others") {
            return "Others"
        }

        return "pet_groom.png"
    }

    return (
        <View style={styles.section}>
            <TextComp styles={[styles.homeTitles]}>Service Categories</TextComp>
            {services?.map((item, index) => {
                // console.log('item x',item?.category)
                // console.log("services[index + 1]?.category ",services[index + 1]?.category )

                if ((index + 1) % 2) {

                    return (
                        <View style={[css.flexDRSB, css.imgFull]}>
                            <Pressable
                                style={[styles.imageContainer, css.width50]}
                                onPress={() => onPress(item?.category, item?.categoryIds[0]?._id)}
                            >
                                <Image source={getImage(item?.category)} style={[styles.backgroundImage, css.img95,]} />
                                <View style={styles.overlay} />
                                <Text style={styles.serviceTitle}>{getContent(item?.category)}</Text>
                            </Pressable>
                            {services[index + 1]?.category ? <Pressable
                                style={[styles.imageContainer, css.width50]}
                                onPress={() => onPress(services[index + 1]?.category, services[index + 1]?.categoryIds[0]?._id)}
                            >
                                <Image
                                    source={getImage(services[index + 1]?.category)}
                                    style={[styles.backgroundImage, css.img95]}
                                />
                                <View style={styles.overlay} />
                                <Text style={styles.serviceTitle}>{getContent(services[index + 1]?.category)}</Text>
                            </Pressable> : <View style={[styles.imageContainer, css.width50]} />}
                        </View>
                    )
                }

                return null;
            })}

            {/* <View style={[css.flexDRSB, css.imgFull]}>
                <Pressable
                    style={[styles.imageContainer, css.width50]}
                    onPress={() => onPress('dailyutilities', '571f8fef784f3f9e7f2779c3')}
                >
                    <Image source={require(imgPath + "Handyman.png")} style={[styles.backgroundImage, css.img95,]} />
                    <View style={styles.overlay} />
                    <Text style={styles.serviceTitle}>DAILY {"\n"}UTILITIES</Text>
                </Pressable>
                <Pressable
                    style={[styles.imageContainer, css.width50]}
                    onPress={() => onPress('healthandwellness', '571f8ff1784f3f9e7f277b0c')}
                >
                    <Image
                        source={require(imgPath + "pcr.png")}
                        style={[styles.backgroundImage, css.img95]}
                    />
                    <View style={styles.overlay} />
                    <Text style={styles.serviceTitle}>Health & {"\n"}Wellness</Text>
                </Pressable>
            </View>
            <View style={[css.flexDRSB, css.imgFull]}>
                <Pressable
                    style={[styles.imageContainer, css.width50]}
                    onPress={() => onPress('lifestyledecor', '5728b53c819367ff75d7e8fa')}
                >
                    <Image
                        source={require(imgPath + "Lifestyle.png")}
                        style={[styles.backgroundImage, css.img95]}
                    />
                    <View style={styles.overlay} />
                    <Text style={styles.serviceTitle}>Lifestyle {"\n"}& Decor</Text>
                </Pressable>
                <Pressable
                    style={[styles.imageContainer, css.width50]}
                    onPress={() => onPress('others', '571f8ff0784f3f9e7f277ad5')}
                >
                    <Image
                        source={require(imgPath + "pet_groom.png")}
                        style={[styles.backgroundImage, css.img95]}
                    />
                    <View style={styles.overlay} />
                    <Text style={styles.serviceTitle}>Others</Text>
                </Pressable>
            </View> */}
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
    imageContainer: {
        width: "50%",
        height: 120,
        marginBottom: 10,
        position: "relative",
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
        borderRadius: 10,
    },
    serviceTitle: {
        position: "absolute",
        bottom: 10,
        left: 15,
        color: "#fff",
        fontSize: wp('3.9%'),
        fontFamily: 'PoppinsEB',
        textTransform: "uppercase",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(61, 61, 61, 0.48)',
        borderRadius: 10,
        width: '95%',
    },
})