import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Image,
    Pressable,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import Modal from 'react-native-modal';
import { List } from 'react-native-paper';
import WebView from "react-native-webview";
import { AntDesign } from '@expo/vector-icons';
import css from '../commonCss';
const windowHeight = Dimensions.get('window').height;
let imgPath = '../../assets/icons/';
import { FlatList } from "react-native-gesture-handler";
import BackArrow from "../ui/BackArrow";

export default function OfferlistModal({ offers = [], loadOffers, onClose, isVisible, onApplyOffer }) {

    useEffect(() => {
        if (offers.length === 0) {
            loadOffers();
        }
    }, [offers]);

    return (
        <Modal
            animationType="fade"
            isVisible={isVisible}
            hasBackdrop={true}
            animationIn='slideInRight'
            animationInTiming={700}
            animationOut='slideOutRight'
            animationOutTiming={700}
            coverScreen={true}
            useNativeDriver={true}
            style={{ margin: 0, zIndex: 4000 }}
            hideModalContentWhileAnimating={true}
            onBackdropPress={() => onClose()}
            onBackButtonPress={() => onClose()}
        >
            <ScrollView>
                <View style={bookModal.modalViewFull}>
                    <View>
                        <View style={[css.flexDR, css.marginT20, css.marginB20]} >
                            <BackArrow onPress={() => onClose()} />
                        </View>
                    </View>
                    <View style={[bookModal.modalBody]}>
                        <View style={[css.flexDR, css.line10]}>
                            <AntDesign style={[css.marginR10]} name="tags" size={40} color="#2eb0e4" />
                            <Text style={[css.f24, css.lGreyC, css.alignSelfC, css.fsb]}>Offers</Text>
                        </View>

                        {
                            offers.length > 0 &&
                            <FlatList
                                data={offers}
                                keyExtractor={(item) => item._id}
                                renderItem={({ item }) => (
                                    <View style={[css.flexDRSB, css.line10]}>
                                        <View style={[css.flexDC, css.width80]}>
                                            <Text style={[css.fsb, css.f16, css.blackC]}>{item.promo.description}</Text>
                                            <Text style={[css.fm, css.f14, css.blackC]}>{item.name}</Text>
                                            <View style={[css.flexDR, css.width100]}>
                                                {!item.promo.onlyCard &&
                                                    <View style={[css.brandBG, css.alignCenter, { width: 70, height: 30, borderRadius: 5 }]}>
                                                        <Text style={[css.whiteC, css.f11, css.fbo]}>{item.promo.name}</Text>
                                                    </View>
                                                }
                                                <View style={[css.width100]}>
                                                    <List.AccordionGroup>
                                                        <List.Accordion
                                                            title="+Terms & conditions"
                                                            id="1"
                                                            titleStyle={[css.brandC, css.f14, css.fm, { textDecorationLine: 'underline', }]}
                                                            style={[css.BGwhite, css.padding0]}
                                                            right={props => (
                                                                <Text></Text>
                                                            )}
                                                        >
                                                            <View style={[css.liteBlueBG, css.borderRadius20, css.padding20]}>
                                                                <WebView
                                                                    source={{ html: item.specialTnc }}
                                                                    automaticallyAdjustContentInsets={true}
                                                                    scalesPageToFit={false}
                                                                    style={{ height: 200, backgroundColor: 'transparent', overflow: 'hidden' }}
                                                                />
                                                            </View>
                                                        </List.Accordion>
                                                    </List.AccordionGroup>
                                                </View>
                                            </View>
                                        </View>
                                        {!item.promo.onlyCard &&
                                            <View style={[css.width20]}>
                                                <TouchableOpacity
                                                    style={[css.alignCenter, css.borderRadius10, { borderColor: '#2eb0e4', borderWidth: 2, width: 70, height: 40, }]}
                                                    onPress={() => { onApplyOffer(item.promo.name), onClose() }}
                                                >
                                                    <Text style={[css.brandC]}>APPLY</Text>
                                                </TouchableOpacity>
                                            </View>
                                        }
                                    </View>
                                )}
                            />
                        }
                    </View >
                </View >
            </ScrollView >
        </Modal >
    );
};

const bookModal = StyleSheet.create({
    modalViewFull: {
        backgroundColor: "white",
        padding: 20,
        height: windowHeight,
    }
})