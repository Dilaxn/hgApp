import React from "react";
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Image,
    SafeAreaView,
    Pressable,
    Dimensions
} from "react-native";
import Modal from 'react-native-modal';
import { SwiperFlatList, Pagination } from 'react-native-swiper-flatlist';
import { useNavigation } from '@react-navigation/native';
import css from '../commonCss';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { AntDesign } from '@expo/vector-icons';
import WebView from "react-native-webview";
let imgPath = '../../assets/icons/';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
export default function RatingModal({ isVisible, onClose, categoryRating, subCategoryName, content }) {
    const navigation = useNavigation();
    if (!categoryRating) {
        return <View></View>
    }
    let htmlData = content.content.mainBulletPoints.htmlContent;
    const customerRating = categoryRating.customerRating;
    const CustomPagination = (props) => {
        return (
            <Pagination
                {...props}
                paginationStyle={styles.paginationContainer}
                paginationStyleItem={() => {
                    <Image style={{ width: 20 }} source={require(imgPath + 'bullet_right.png')} />
                }}
                paginationDefaultColor="tomato"
                paginationActiveColor="white"
            />
        );
    };
    return (
        <Modal
            isVisible={true}
            hasBackdrop={true}
            animationIn='fadeIn'
            animationInTiming={500}
            animationOut='fadeOut'
            animationOutTiming={500}
            hideModalContentWhileAnimating={true}
            useNativeDriver={true}
            onBackButtonPress={() => onClose()}
            onBackdropPress={() => onClose()}
        >
            <SafeAreaView>
                <ScrollView>
                    <View style={css.modalNewView}>
                        <View style={[css.modalNewHeader, css.whiteBG]}>
                            <Pressable style={[css.flexDR, css.line10, css.marginB0]} onPress={() => onClose()}>
                                <AntDesign style={[css.marginR10]} name='arrowleft' size={wp('6%')} color='#525252' />
                                <Text style={[css.fbo, css.f18, css.blackC]}>Why HomeGenie? </Text>
                            </Pressable>
                        </View>
                        <View style={[css.modalNewBody, css.paddingT0]}>
                            <View style={[css.flexDR]}>
                                <View style={[css.width20]}>
                                    <Image style={[css.marginR20, css.img50]} source={{ uri: categoryRating.imageURL.original }} />
                                </View>
                                <Text style={[css.fbo, css.f20, css.blackC, css.alignSelfC, css.width80]}>{subCategoryName}</Text>
                            </View>
                            <View style={[css.marginT5, { flex: 1 }]}>
                                <WebView
                                    source={{ html: htmlData }}
                                    automaticallyAdjustContentInsets={true}
                                    scalesPageToFit={false}
                                    style={{ height: 180 }}
                                />
                            </View>
                        </View>
                        <View style={[css.brandBG, css.padding20,]}>
                            <Image source={require(imgPath + 'live.png')} />
                            <Text style={[css.whiteC, css.feb, css.f20]}>SERVICE RATING</Text>
                            <View style={[css.flexDR]}>
                                <View style={[css.width50]}>
                                    <View style={[css.flexDC]}>
                                        <View style={[css.flexDR]}>
                                            <Image source={require(imgPath + 'star-white.png')} />
                                            <Text style={[css.fm, css.f18, css.whiteC]}> {categoryRating.averageRating ? categoryRating.averageRating : '4.3'}/5</Text>
                                        </View>
                                        <View><Text style={[css.fm, css.f12, css.whiteC]}>Based on {categoryRating.totalCount ? categoryRating.totalCount : '2589'} Ratings</Text></View>
                                    </View>
                                </View>
                                <View style={[css.width50]}>
                                    <View style={[css.flexDC]}>
                                        <View style={[css.flexDR]}>
                                            <Text style={[css.fm, css.f18, css.whiteC]}> {categoryRating.lastYearData ? categoryRating.lastYearData : '450'}</Text>
                                        </View>
                                        <View><Text style={[css.fm, css.f12, css.whiteC]}>Booking lasr year</Text></View>
                                    </View>
                                </View>
                            </View>
                            {customerRating.length > 0 &&
                                <View style={[css.marginT10]}>
                                    <Text style={[css.f20, css.fbo, css.whiteC]}>CUSTOMER FEEDBACK</Text>
                                    <View style={[css.padding20, css.borderRadius10, css.imgFull, { backgroundColor: '#258fc980' }]}>
                                        <SwiperFlatList
                                            autoplay
                                            autoplayDelay={2}
                                            autoplayLoop
                                            // showPagination
                                            // PaginationComponent={CustomPagination}
                                            paginationStyleItem={() => {
                                                <Image style={{ width: 20 }} source={require(imgPath + 'bullet_right.png')} />
                                            }}
                                            style={[css.imgFull]}
                                            data={customerRating}
                                            keyExtractor={(item, index) => index}
                                            renderItem={({ item }) => (
                                                <View style={[{ width: windowWidth }]}>
                                                    <Text style={[css.f16, css.fm, css.whiteC]}>{(item.customerFeedback).substring(0, 50)}</Text>
                                                    <Text style={[css.f12, css.fbo, css.whiteC, css.marginT20]}>{item.customerName}</Text>
                                                    <Text style={[css.f12, css.fm, css.whiteC, css.width70]}>{item.community} {item.city} {item.customerRatingDate}</Text>
                                                </View>
                                            )}
                                        />
                                    </View>
                                </View>
                            }
                        </View>
                        <View style={[css.modalNewBody, css.imgFull]}>
                            <View style={[css.flexDR]}>
                                <View style={[css.width30]}><Image style={{ resizeMode: 'contain', width: wp('20%'), height: wp('20%') }} source={require(imgPath + 'warranty.png')} /></View>
                                <View style={[css.marginL10, css.width70]}>
                                    <Text style={[css.fbo, css.blackC, css.f18]}>HomeGenie Happiness Warranty</Text>
                                    <Text style={[css.fm, css.blackC, css.f14]}>As provided in the bill estimate. {'\n'} For more details, visit </Text>
                                    <Pressable onPress={() => { onClose(), navigation.navigate('Browser', { url: 'https://www.homegenie.com/en/warranty' }) }}>
                                        <Text style={[css.brandC, css.fm, css.f14]}>HomeGenie warranty policy</Text>
                                    </Pressable>
                                    <Text style={[css.blackC, css.fm, css.f14]}>To know more about our COVID19 precautions, please visit,</Text>
                                    <Pressable onPress={() => { onClose(), navigation.navigate('Browser', { url: 'https://www.homegenie.com/en/covid-19-precautions' }) }}>
                                        <Text style={[css.brandC, css.fm, css.f14]}>covid-19-precautions.</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
};


const styles = StyleSheet.create({
    paginationContainer: {
        top: 0,
    },
    pagination: {
        borderRadius: 2,
    },
})