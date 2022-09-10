import React, { useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Image,
    Dimensions,
    SafeAreaView
} from "react-native";
import Modal from 'react-native-modal';
import css from '../commonCss';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
let imgPath = '../../assets/icons/';
import BackArrow from "../ui/BackArrow";

export default function ScopedetailsModal(props) {
    let data = props.data
    if (!data) {
        return null
    }
    let serviceNote = data.serviceNotes;
    serviceNote = serviceNote.split("<br>").join("\n");
    let serviceNotes = serviceNote.split("<br />").join("\n");
    serviceNotes = serviceNotes.split("<div>").join("");
    serviceNotes = serviceNotes.split("</div>").join("\n");

    const customerNotes = data.customerNotes;
    const availability = data.emergencyBookingAllowed;

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
            style={{ margin: 0 }}
            hideModalContentWhileAnimating={true}
            onBackButtonPress={() => props.onClose()}
        >
            <SafeAreaView>
                <ScrollView>
                    <View style={bookModal.modalViewFull}>
                        <BackArrow onPress={() => props.onClose()} style={css.flexDRR} text={null} />
                        <View style={[bookModal.modalBody]}>
                            <View style={[css.flexDR, css.line20]}>
                                <Image style={[css.img30, css.marginR10]} source={require(imgPath + 'expert.png')} />
                                <Text style={[css.f24, css.lGreyC, css.alignSelfC, css.fsb]}>Scope Details</Text>
                            </View>
                            <View style={[css.line20]}>
                                <Text style={[css.f18, css.fsb, css.ttC, css.blackC, css.spaceB10]}>What's Included</Text>
                                <Text style={[css.fm, css.blackC, css.spaceB5,]}>{serviceNotes}</Text>
                            </View>
                            <View style={[css.spaceB20]}>
                                <Text style={[css.f18, css.fsb, css.ttC, css.blackC, css.spaceB10]}>NOTES</Text>
                                <Text style={[css.fm, css.blackC, css.spaceB5,]}>{customerNotes}</Text>
                            </View>
                            <View style={[css.line20]}>
                                <Text style={[css.f18, css.fsb, css.ttC, css.blackC, css.spaceB10]}>Availability</Text>
                                <View style={[css.flexDRSA]}>
                                    {availability === true ?
                                        <Image style={{ width: 50, height: 56 }} source={require(imgPath + 'emergency-2x.png')} />
                                        :
                                        <Image source={require(imgPath + 'emergency-2x-grey.png')} />
                                    }
                                    <Image style={{ width: 50, height: 57 }} source={require(imgPath + 'sameday-2x.png')} />
                                    <Image style={{ width: 53, height: 56 }} source={require(imgPath + 'schedule-2x.png')} />
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
const styles = StyleSheet.create({
    activeText: {
        color: '#fff',
    },
    rbWrapper: {
        alignItems: 'center',
        flexDirection: 'row',
    },
})