import React from "react";
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Image,
    Dimensions,
    SafeAreaView,
    Pressable,
} from "react-native";
import Modal from 'react-native-modal';
import css from '../commonCss';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import BackArrow from "../ui/BackArrow";
import { useNavigation } from "@react-navigation/native";
const windowHeight = Dimensions.get('window').height;
let imgPath = '../../assets/icons/';

export default function PricingdetailModal(props) {
    const navigation = useNavigation();
    let data = props.data
    if (!data) {
        return null
    }

    let serviceType = (data.unitCharges.firstUnitCharges > 0) ? 'Fixed price service' : (data.callOutCharges > 0) ? 'Inpection based services' : 'Survey based service';
    let PRICE = (serviceType == 'Fixed price service') ? data.unitCharges.firstUnitCharges : data.callOutCharges;
    let ADDITIONAL_PRICE = (serviceType == 'Fixed price service') && data.unitCharges.restUnitCharges;
    let mainUnitNote = data.pricingUnitNote.mainUnitNote ? data.pricingUnitNote.mainUnitNote : null;
    mainUnitNote = mainUnitNote.replace('PRICE', PRICE)
    let additionalUnitNote = data.pricingUnitNote.additionalUnitNote ? data.pricingUnitNote.additionalUnitNote : null;
    additionalUnitNote = additionalUnitNote.replace('PRICE', ADDITIONAL_PRICE)
    const asteriskNote = data.pricingUnitNote.asteriskNote ? data.pricingUnitNote.asteriskNote : null

    return (
        <Modal
            animationType="fade"
            isVisible={props.isVisible}
            hasBackdrop={true}
            animationIn='slideInLeft'
            animationInTiming={700}
            animationOut='slideOutLeft'
            animationOutTiming={700}
            coverScreen={true}
            useNativeDriver={true}
            style={{ margin: 0, }}
            hideModalContentWhileAnimating={true}
            onBackButtonPress={() => props.onClose()}
        >
            <SafeAreaView>
                <ScrollView>
                    <View style={bookModal.modalViewFull}>
                        <View>
                            <BackArrow onPress={() => props.onClose()} style={css.flexDRR} text={null} />
                        </View>
                        <View style={[bookModal.modalBody]}>
                            <View style={[css.flexDR, css.line10]}>
                                <Image style={[css.img30, css.marginR10]} source={require(imgPath + 'priceverification.png')} />
                                <Text style={[css.f24, css.lGreyC, css.alignSelfC, css.fsb]}>Pricing Details</Text>
                            </View>
                            <View style={[css.line20]}>
                                <Text style={[css.f18, css.fsb, css.brandC, css.spaceB10]}>{serviceType}</Text>
                                <Text style={[css.fm, css.blackC, css.spaceB10,]}>{mainUnitNote} {'\n'} {additionalUnitNote}</Text>
                                <Text style={[css.fm, css.blackC]}>{asteriskNote}</Text>
                            </View>
                            <View style={[css.line20]}>
                                <Text style={[css.f16, css.fm, css.blackC, css.spaceB10]}>NOTES</Text>
                                <Text style={[css.fm, css.blackC, css.spaceB5, css.f12]}>Additional charges apply for Emergency bookings, based on availability and permissions from community/ building, as confirmed by the Customer. VAT charges are not included and are based on the total invoice Amount.</Text>
                            </View>
                            <View style={[css.line20]}>
                                <Text style={[css.f18, css.fsb, css.ttC, css.blackC, css.spaceB10]}>Warranty</Text>
                                <View style={[css.flexDR]}>
                                    <View style={[css.width30]}>
                                        {/* <Image style={{ width: 100, height: 90 }} source={require(imgPath + 'warranty.png')} /> */}
                                        <Image style={[css.marginR20, { width: wp('20%'), height: wp('20%') }]} source={require(imgPath + 'warranty.png')} />
                                    </View>
                                    <View style={[css.flexDC, css.alignSelfC]}>
                                        <Text style={[css.greyC, css.fm, css.f12]}>For more details, visit </Text>
                                        <Pressable onPress={() => { props.onClose(), navigation.navigate('Browser', { url: 'https://www.homegenie.com/en/warranty/' }) }}>
                                            <Text style={[css.brandC, css.f12, css.fm]} >HomeGenie Warranty Policy</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>

        </Modal>
    );
};

const bookModal = StyleSheet.create({
    modalViewFull: {
        backgroundColor: "white",
        padding: 20,
        height: windowHeight,
    },
})