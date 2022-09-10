import { StyleSheet, View, Pressable, Text, Dimensions, Image } from "react-native";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import css from "../commonCss";
import TextComp from "../TextComp";
const imgPath = '../../assets/icons/';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const windowWidth = Dimensions.get('window').width;

export default function OfferPromos({ onPress, propData }) {
    if (!propData) {
        return <View><TextComp></TextComp></View>
    }
    return (
        <View style={styles.section}>
            <Text style={[styles.homeTitles, css.textLeft]}>Offers & Promos</Text>
            <SwiperFlatList
                autoplay
                autoplayDelay={3}
                autoplayLoop
                renderAll
                data={propData}
                contentContainerStyle={{}}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <Pressable
                        style={[styles.swiperOffer]}
                        onPress={() => onPress(item.categoryName)}
                    >
                        <Image
                            key={item._id}
                            style={[styles.swiperOfferImage]}
                            source={{
                                uri: item.image,
                            }}
                        />
                        <View style={[styles.claimContainer]}>
                            <Text style={[css.fm, css.whiteC, css.f10]}>{item.soldCount} claimed already! </Text>
                        </View>
                        {item.trending &&
                            <View style={[styles.trendingImageContainer]}>
                                <Image
                                    style={[styles.trendingImage]}
                                    source={require(imgPath + "trending.png")}
                                />
                            </View>
                        }
                    </Pressable>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    section: {
        padding: 20,
        paddingBottom: 0
    },
    homeTitles: {
        color: "#2EB0E4",
        textTransform: "uppercase",
        fontSize: wp('3.9%'),
        marginBottom: 10,
        fontFamily: 'PoppinsSB',
    },
    pressed: { opacity: 0.5 },
    swiperOffer: {
        marginTop: 10,
        borderRadius: 10
    },
    swiperOfferImage: {
        width: wp('87%'),
        marginRight: 20,
        height: hp('25%'),
        borderRadius: 10,
        resizeMode: 'stretch',
    },
    claimContainer: { position: 'absolute', top: 0, left: 20, width: wp('30%'), height: wp('5%'), backgroundColor: '#f6b700', alignItems: 'center', justifyContent: 'center' },
    trendingImageContainer: { top: -15, right: -10, position: 'absolute' },
    //trendingImage: { width: wp('25%'), height: hp('10%') }
})