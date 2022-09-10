import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    Image,
    Pressable,
    FlatList,
    Text,
} from "react-native";
import css from "../components/commonCss";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MessageModal from "../components/Modals/MessageModal";
import * as Clipboard from 'expo-clipboard';
import LoadingOverlay from "../components/ui/LoadingOverlay";
import HeaderTitle from "../components/ui/HeaderTitle";
import ModalTermsandCondition from "../components/Modals/ModalTermsandCondition";
import { useSelector } from "react-redux";
import { getOffers } from "../reducers/categoryReducer";
import ShadowCard from "../components/ui/ShadowCard";
let imgPath = '../assets/icons/';

export default function OfferScreen({ navigation }) {
    let offerData = useSelector(getOffers)
    const [messageModalVisible, setMessageModalVisible] = useState(false);
    const [termsModalVisible, setTermsModalVisible] = useState(false);
    const [termsData, setTermsData] = useState(null);
    const getTermsandConditions = (id) => {
        let data = offerData.filter(x => x._id === id);
        data = data.map((item) => ({
            _id: item._id,
            termsCondition: item.termsCondition,
        }))
        setTermsData(data);
    }
    if (termsData != null) {
        var termsCondition = termsData[0].termsCondition;
    }
    return (
        <>
            <HeaderTitle title='Offers' />
            {!offerData ?
                <LoadingOverlay />
                :
                <ScrollView>
                    <View style={[styles.screen]}>
                        <View style={[styles.section]}>
                            <ShadowCard style={[css.borderRadius10, css.BGwhite, css.padding20]}>
                                <Text style={[css.fr, css.f12, css.blackC]}>Current Offer you should not miss!</Text>
                                <FlatList
                                    data={offerData}
                                    keyExtractor={(item) => item._id}
                                    renderItem={({ item }) => (
                                        <View style={[{ borderBottomWidth: 1, borderColor: '#ccc', marginTop: 15 }]}>
                                            <Image
                                                resizeMode="stretch"
                                                style={[{ width: '100%', height: hp('20%'), borderRadius: 10, marginBottom: 10 }]}
                                                //style={[{ width: wp('100%'), height: hp('25%'), resizeMode: 'stretch', borderRadius: 10, marginBottom: 10 }]}
                                                source={{ uri: item.image }}
                                            />
                                            <View style={{ position: 'absolute', top: 0, left: 15, width: wp('30%'), height: hp('3%'), backgroundColor: '#f6b700', alignItems: 'center', justifyContent: 'center' }}>
                                                <Text style={[css.fr, css.f10, css.whiteC]}>{item.soldCount} claimed already! </Text>
                                            </View>
                                            {item.trending && <Image
                                                style={{ top: -15, right: -10, position: 'absolute', width: wp('35%'), resizeMode: 'contain' }}
                                                source={require(imgPath + "trending.png")}
                                            />}
                                            <Pressable onPress={() => { getTermsandConditions(item._id); navigation.navigate('Browser1', { url: termsCondition, title: 'Terms & Condition' }) }}>
                                                <Text style={[css.brandC, css.f12, css.fr]}>* Terms & Conditions</Text>
                                            </Pressable>
                                            <Text style={[css.f20, css.fbo, css.brandC]}>{item.name}</Text>
                                            {item.promoName &&
                                                <Text style={[css.f14, css.brandC, css.fbo]}>{item.promoName}</Text>
                                            }
                                            <Text style={[css.f12, css.fr, css.blackC]}>{item.name}</Text>
                                            <Text style={[css.f12, css.fr, css.blackC]}>Valid till date {item.validDate}</Text>
                                            <View style={[css.flexDRSB, css.marginB20, css.marginT20]}>
                                                {item.promoName ?
                                                    <Pressable
                                                        style={[styles.offerCopyCode]}
                                                        onPress={() => (Clipboard.setString(item.promoName), setMessageModalVisible(true))}
                                                    >
                                                        <Text style={[css.brandC, css.f14, css.fm]}>Copy Code</Text>
                                                    </Pressable>
                                                    :
                                                    <Pressable style={[styles.offerCopyCode, { borderWidth: 0 }]} >
                                                        <Text style={[css.brandC, css.f14, css.fm]}> </Text>
                                                    </Pressable>
                                                }
                                                <Pressable
                                                    style={[css.yellowBtn, css.borderRadius30, css.boxShadow, { height: 35, width: '35%' }]}
                                                    onPress={() => navigation.navigate('GetgenieCategories')}
                                                >
                                                    <Text style={[css.fm, css.whiteC, css.f14]}> Book Now</Text>
                                                </Pressable>
                                            </View>
                                        </View>
                                    )}
                                />
                            </ShadowCard>
                        </View>
                        <Pressable style={[styles.section]} onPress={() => navigation.navigate('ReferEarnPage')}>
                            <View style={[css.flexDR]}>
                                <Image source={require(imgPath + "speaker.png")} />
                                <Text style={[css.brandC, css.alignSelfC, css.f18, css.fm, css.marginL10]}> Refer and Earn </Text>
                            </View>
                        </Pressable>
                    </View>
                </ScrollView>
            }
            <MessageModal isVisible={messageModalVisible} onClose={() => setMessageModalVisible(false)} message='Promo code copied!' />
            <ModalTermsandCondition isVisible={termsModalVisible} onClose={() => setTermsModalVisible(false)} termsData={termsData} />
        </>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    section: {
        padding: 20,
    },
    offerCopyCode: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        borderColor: '#2eb0e4',
        borderWidth: 1,
        width: '35%',
        height: 35
    }
});