import { useState } from "react";
import { StyleSheet, View, Pressable, Text, ImageBackground } from "react-native";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import css from "../commonCss";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { getActiveCategoryId, getActiveMainCategoryId, getSpecialisedCategoryBanners, loadSubCategoryContent, updateActiveSubCategory, updateCategory } from "../../reducers/categoryReducer";
import { hideLoading, showLoading } from "../../reducers/appReducer";

export default function SpecializedCategories() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const specializedCategoryBanners = useSelector(getSpecialisedCategoryBanners);

    const activeMainCategoryId = useSelector(getActiveMainCategoryId);
    const activeCategoryId = useSelector(getActiveCategoryId);

    const [overlaySpecial, setOverlaySpecial] = useState(false);
    const toggleoverlaySpecial = () => { setOverlaySpecial(!overlaySpecial) };
    const [overlaySpecial2, setOverlaySpecial2] = useState(false);
    const toggleoverlaySpecial2 = () => { setOverlaySpecial2(!overlaySpecial2) };
    const [overlaySpecial3, setOverlaySpecial3] = useState(false);
    const toggleoverlaySpecial3 = () => { setOverlaySpecial3(!overlaySpecial3) };
    const [activeBanner, setActiveBanner] = useState(null)

    const setActiveSubcategory = async (subCategory) => {
        dispatch(showLoading());
        await dispatch(updateCategory('614ed53e25da458f4ceeaa07'));
        await dispatch(updateActiveSubCategory(subCategory._id));
        await dispatch(loadSubCategoryContent(subCategory.url));
        dispatch(hideLoading());
        navigation.navigate('BookingFlow');
    }
    return (
        <>
            <View style={styles.section}>
                <Text style={[styles.homeTitles, css.textCenter]}>
                    Specialized services
                </Text>
                <Text style={[css.textCenter, css.fr, css.f12, css.greyC]}>
                    Handpicked services from innovated brands. Now available!
                </Text>
                {specializedCategoryBanners !== null &&
                    <View style={[styles.specialCatData]}>
                        <Pressable
                            style={[styles.bannerContainer]}
                            onPress={() => setActiveBanner(specializedCategoryBanners.bannerFirst._id)}
                        >
                            <View style={[styles.bannerInnerContainer]}>
                                <ImageBackground
                                    source={{ uri: specializedCategoryBanners.bannerFirst.image }}
                                    style={[styles.bannerImage]}
                                    resizeMode="cover"
                                ></ImageBackground>
                            </View>
                            {activeBanner === specializedCategoryBanners.bannerFirst._id ?
                                <View style={[styles.overlaySpecial, css.alignCenter]}
                                    onPress={() => { setActiveBanner(null) }}
                                >
                                    <Pressable
                                        style={[css.yellowBG, css.alignCenter, css.borderRadius30, { width: 120, height: 30 }]}
                                        onPress={() => { setActiveSubcategory(specializedCategoryBanners.bannerFirst) }}
                                    >
                                        <Text style={[css.fsb, css.f12, css.whiteC]}>BOOK NOW</Text>
                                    </Pressable>
                                </View>
                                :
                                null
                            }
                        </Pressable>
                        <Text style={styles.bannerName}>
                            {specializedCategoryBanners.bannerFirst.subCategoryName}
                        </Text>
                    </View>
                }
                {specializedCategoryBanners !== null &&
                    <View style={[styles.specialCatData]}>
                        <Pressable
                            style={[styles.bannerContainer]}
                            onPress={() => setActiveBanner(specializedCategoryBanners.bannerSecond._id)}
                        >
                            <View style={[styles.bannerInnerContainer]}>
                                <ImageBackground
                                    source={{ uri: specializedCategoryBanners.bannerSecond.image }}
                                    style={[styles.bannerImage2]}
                                    resizeMode="cover"
                                ></ImageBackground>
                            </View>
                            {activeBanner === specializedCategoryBanners.bannerSecond._id ?
                                <Pressable style={[styles.overlaySpecial, css.alignCenter, { height: 150 }]}
                                    onPress={() => setActiveBanner(null)}
                                >
                                    <Pressable
                                        style={[css.yellowBG, css.alignCenter, css.borderRadius30, { width: 120, height: 30 }]}
                                        onPress={() => setActiveSubcategory(specializedCategoryBanners.bannerSecond)}
                                    >
                                        <Text style={[css.fsb, css.f12, css.whiteC]}>BOOK NOW</Text>
                                    </Pressable>
                                </Pressable>
                                :
                                null
                            }
                        </Pressable>
                        <Text style={styles.bannerName}>
                            {specializedCategoryBanners.bannerSecond.subCategoryName}
                        </Text>
                    </View>
                }
                {specializedCategoryBanners !== null &&
                    <SwiperFlatList
                        renderAll
                        autoplay
                        autoplayDelay={4}
                        autoplayLoop
                        autoplayLoopKeepAnimation
                        showPagination
                        paginationDefaultColor='#fff'
                        paginationActiveColor='#2eb0e4'
                        paginationStyle={{ position: 'absolute', right: 30, bottom: -15 }}
                        paginationStyleItem={{ width: 30, height: 5, marginHorizontal: 5, elevation: 3 }}
                        data={specializedCategoryBanners.bannerThird}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <View style={[styles.specialCatData, { width: 110, marginHorizontal: 5, marginBottom: 20 }]}>
                                <Pressable
                                    style={[styles.bannerContainer]}
                                    onPress={() => setActiveBanner(item._id)}
                                >
                                    <View style={[styles.bannerInnerContainer]}>
                                        <ImageBackground
                                            source={{ uri: item.image }}
                                            style={[styles.bannerImage3]}
                                            resizeMode="cover"
                                        ></ImageBackground>
                                    </View>

                                    {activeBanner === item._id ?
                                        <Pressable style={[styles.overlaySpecial, css.alignCenter, { height: 150 }]}
                                            onPress={() => setActiveBanner(null)}
                                        >
                                            <Pressable
                                                style={[css.yellowBG, css.alignCenter, css.borderRadius30, { width: 100, height: 30 }]}
                                                onPress={() => setActiveSubcategory(item)}
                                            >
                                                <Text style={[css.fsb, css.f12, css.whiteC]}>BOOK NOW</Text>
                                            </Pressable>
                                        </Pressable>
                                        :
                                        null
                                    }
                                </Pressable>
                                <Text style={styles.bannerName}>
                                    {item.subCategoryName}
                                </Text>
                            </View>
                        )}
                    />
                }
            </View>
        </>
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
    overlaySpecial: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#21adea',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        width: '100%',
        opacity: 0.8,
    },
    bannerContainer: {
        borderBottomWidth: 10,
        borderColor: "#2eb0e4",
        borderRadius: 10,
        marginTop: 10,
    },
    bannerInnerContainer: {
        overflow: 'hidden', borderTopLeftRadius: 10, borderTopRightRadius: 10
    },
    bannerImage: {
        height: 250,
        width: '160%',
    },
    bannerImage2: {
        height: 150,
        width: '100%',
    },
    bannerImage3: {
        height: 150,
        width: '350%',
    },
    bannerName: {
        textAlign: "center",
        fontSize: wp('2.42%'),
        color: "#525252",
        marginTop: 10,
        textTransform: "uppercase",
        fontFamily: 'PoppinsBO',
    },
})