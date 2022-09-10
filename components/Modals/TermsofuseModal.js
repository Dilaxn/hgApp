import React, { useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Dimensions,
    Pressable
} from "react-native";
import Modal from 'react-native-modal';
import { AntDesign } from '@expo/vector-icons';
import css from '../commonCss';
const windowHeight = Dimensions.get('window').height;
import BackArrow from "../ui/BackArrow";
import { useNavigation } from "@react-navigation/native";

export default function TermsofuseModal(props) {
    const navigation = useNavigation();
    return (
        <Modal
            animationType="fade"
            isVisible={props.isVisible}
            hasBackdrop={true}
            animationIn='slideInRight'
            animationInTiming={700}
            animationOut='slideOutRight'
            animationOutTiming={700}
            coverScreen={true}
            useNativeDriver={true}
            style={{ margin: 0, zIndex: 11 }}
            hideModalContentWhileAnimating={true}
            onBackButtonPress={() => props.onClose()}
        >
            <View style={bookModal.modalViewFull}>
                <BackArrow onPress={() => props.onClose()} icon='arrowright' text={null} />
                <View style={[bookModal.modalBody]}>
                    <View style={[css.flexDR, css.line20]}>
                        <AntDesign style={[css.marginR10]} name="infocirlceo" size={24} color='#2eb0e4' />
                        <Text style={[css.f24, css.lGreyC, css.fsb, { lineHeight: 28 }]}>Terms of use</Text>
                    </View>
                    <ScrollView>
                        <View style={[css.spaceB10]}>
                            <Text style={[css.fm, css.blackC, css.f14]}>HomeGenie is a online on-demand "managed" marketplace which ensure that its Users get the Services they booked to the quality, price and as per their schedule they desire. We not only identify, train and onboard Service delivery Partners (or "Genie") using a very stringent criteria but also ensure that they are matched to only the right Service requested by the User based on verifying their skills, legal status, ratings and reviews, in real-time. All these activities are conducted on HomeGenie platform, our proprietary purpose built technology system. Kindly refer to the Terms of Use at
                                <Text onPress={() => { props.onClose(), navigation.navigate('Browser', { url: 'https://www.homegenie.com/en/term-of-use/' }) }}>
                                    <Text style={[css.brandC, css.fm, css.f14]}> https://www.homegenie.com/en/term-of-use/</Text>
                                </Text> for further information. </Text>
                        </View>
                        <View style={[css.spaceB10]}>
                            <Text style={[css.fm, css.brandC,]}>Cancellation charges:</Text>
                        </View>
                        <View style={[css.spaceB20]}>
                            <Text style={[css.fm, css.blackC,]}>Service booked by the User can be cancelled at any time before the booking has been attended at the User location. A cancellation charge might be applicable depending upon how close to the booking date/ time was the booking cancelled and whether a Service Delivery Partner (or "Genie") has already been assigned to the booking. Upon trying to cancel, the HomeGenie Platform will show the applicable cancellation charges in case the User proceeds with the cancellation. Kindly refer to the section on cancellation policy at
                                <Text onPress={() => { props.onClose(), navigation.navigate('Browser', { url: 'https://www.homegenie.com/en/pricing-policies' }) }}>
                                    <Text style={[css.brandC, css.fm, css.f14]}> https://www.homegenie.com/en/pricing-policies/ </Text>
                                </Text>
                                for further information.</Text>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const bookModal = StyleSheet.create({
    modalViewFull: {
        backgroundColor: "white",
        padding: 20,
        height: windowHeight,
    }
})