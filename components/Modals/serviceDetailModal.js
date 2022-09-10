import React, { Component, useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Text,
    SafeAreaView,
    ScrollView,
    Button,
    Image,
    ViewBase,
    Linking,
    BackHandler,
    TouchableOpacity,
    TouchableHighlight,
    Pressable,
    Alert,
    FlatList,
    SafeAreaViewDecider,
    VirtualizedList,
    TextInput,
    Dropdown,
    TouchableWithoutFeedback,
    Dimensions,
} from "react-native";
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { List } from 'react-native-paper';
import Modal from 'react-native-modal';
import StatusBarAll from "../StatusBar";
import css from '../commonCss';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
let imgPath = '../../assets/icons/';

const serviceDetailModal = (props) => {
    const [scopeModalVisible, setscopeModalVisible] = useState(false);
    const togglescopeModal = () => { setscopeModalVisible(!scopeModalVisible) };
    return (
        <Modal
            isVisible={scopeModalVisible}
            animationIn='slideInLeft'
            animationInTiming={700}
            animationOut='slideOutLeft'
            animationOutTiming={700}
            coverScreen={true}
            useNativeDriver={true}
            style={{ margin: 0, }}
            hideModalContentWhileAnimating={true}
        >
            <ScrollView>
                <View style={bookModal.modalViewFull}>
                    <View>
                        <TouchableOpacity
                            style={[css.flexDRR, css.padding20]}
                            onPress={() => setscopeModalVisible(!scopeModalVisible)}
                        >
                            <Image source={require(imgPath + 'backArrowBlack.png')} />
                        </TouchableOpacity>
                    </View>
                    <View style={[bookModal.modalBody]}>
                        <View style={[css.flexDR, css.line20]}>
                            <Image style={[css.img30, css.marginR10]} source={require(imgPath + 'expert.png')} />
                            <Text style={[css.f24, css.lGreyC, css.alignSelfC, css.fsb]}>Scope Details</Text>
                        </View>
                        <View style={[css.line20]}>
                            <Text style={[css.f18, css.fsb, css.ttC, css.blackC, css.spaceB10]}>what's included</Text>
                            <Text style={[css.fm, css.blackC, css.spaceB5,]}>- Visit the customer location,{"\n"} - Inspection and diagnosis of the issue, on-site,{"\n"} - For minor repair - work that can be completed, on the spot, in 1 hour,{"\n"} - For major repair - detailed diagnosis and bill estimation, including ascertaining the availability of material and/ or spare parts,{"\n"} - Testing and demo; and{"\n"} - Post-inspection cleanup.</Text>
                        </View>
                        <View style={[css.spaceB20]}>
                            <Text style={[css.f18, css.fsb, css.ttC, css.blackC, css.spaceB10]}>NOTES</Text>
                            <Text style={[css.fm, css.blackC, css.spaceB5,]}>Customer to assist in getting access to community and service location, and electricity and water connection to be active.</Text>
                        </View>
                        <View style={[css.line20]}>
                            <Text style={[css.f18, css.fsb, css.ttC, css.blackC, css.spaceB10]}>Availability</Text>
                            <View style={[css.flexDRSA]}>
                                <Image style={{ width: 50, height: 56 }} source={require(imgPath + 'emergency-2x.png')} />
                                <Image style={{ width: 50, height: 57 }} source={require(imgPath + 'sameday-2x.png')} />
                                <Image style={{ width: 51, height: 56 }} source={require(imgPath + 'friday-2x.png')} />
                                <Image style={{ width: 53, height: 56 }} source={require(imgPath + 'schedule-2x.png')} />
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
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
    // modal-css
})
export default serviceDetailModal;