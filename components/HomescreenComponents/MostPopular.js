import { StyleSheet, View, Pressable, Text, Dimensions, Image } from "react-native";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import { useNavigation } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import css from "../commonCss";
import TextComp from "../TextComp";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function MostPopular({ propData, onPress }) {
    const navigation = useNavigation();
    if (!propData) {
        return <View><TextComp></TextComp></View>
    }
    return (
        <View style={[styles.section]}>
            <View style={[styles.mostPopular]}><TextComp size={css.f10} color={css.whiteC} family={css.fbo}>MOST POPULAR</TextComp></View>
            <SwiperFlatList
                autoplay
                autoplayDelay={3}
                autoplayLoop
                renderAll
                data={propData}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) =>
                    <Pressable
                        android_ripple={{ color: '#525252' }}
                        style={({ pressed }) => [styles.child, pressed && styles.pressed]}
                        onPress={() => onPress(item.name, item._id)}
                    >
                        <Image style={styles.mostPopularImage} source={{ uri: item.imageURL }} />
                        <Text style={styles.textFlat}>{item.name}</Text>
                    </Pressable>
                }
            >
            </SwiperFlatList>
        </View>
    )
}

const styles = StyleSheet.create({
    section: {
        padding: 20,
        paddingBottom: 0
    },
    pressed: { opacity: 0.5 },
    mostPopular: {
        marginVertical: 10,
        backgroundColor: "#f6b700",
        width: wp('25%'),
        height: hp('2.5%'),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
    },
    child: {
        borderRadius: 10,
        width: wp('21%'),
        height: hp('10%'),
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
        marginVertical: 5,
        ...css.boxShadow,
    },
    mostPopularImage: {
        width: wp('8%'),
        height: hp('4%'),
        marginBottom: 15,
    },
    textFlat: {
        fontSize: wp('2.7%'),
        bottom: 5,
        position: 'absolute',
        color: "#525252",
        textAlign: "center",
        fontFamily: 'PoppinsM'
    },
})