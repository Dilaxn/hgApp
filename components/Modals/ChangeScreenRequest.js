import React, { useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    Pressable,
} from "react-native";
import Modal from 'react-native-modal';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import css from '../commonCss';



export default function ChangeScreenRequest({ isVisible, onClose, onCancel }) {
    return (
        <Modal
            isVisible={isVisible}
            animationIn='slideInDown'
            animationInTiming={500}
            animationOut='slideOutDown'
            animationOutTiming={500}
            useNativeDriver={true}
            hideModalContentWhileAnimating={true}
        >
            <View style={[css.centeredView, css.imgFull]}>
                <View style={css.modalNewView}>
                    <View style={[css.modalNewHeader, styles.modalHeader]}>
                        <View>
                            <Text style={[css.fm, css.f14, css.blackC, css.alignSelfC]}>Are you sure you want to change?</Text>
                            <Text style={[css.fm, css.f14, css.blackC, css.alignSelfC, css.marginT10]}>You will loose all information entered.</Text>
                        </View>
                    </View>
                    <View style={[css.modalNewBody]}>
                        <View style={[css.flexDRSB]}>
                            <Pressable onPress={() => onCancel()} style={{ flex: 1, marginRight: 10 }}><View style={[styles.yesBtn]}><Text style={[styles.yesBtnText]}>YES, CHANGE</Text></View></Pressable>
                            <Pressable onPress={() => onClose()} style={{ flex: 1 }}><View style={[styles.noBtn]}><Text style={[styles.noBtnText]}>NO, CONTINUE</Text></View></Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    activeText: {
        color: '#fff',
    },
    rbWrapper: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    modalHeader: { padding: 40 },
    yesBtn: {
        backgroundColor: '#F2F4F8',
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
    yesBtnText: { color: '#525252', fontFamily: 'PoppinsM', fontSize: wp('3.4%') },
    noBtn: {
        backgroundColor: '#F6AD00',
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
    },
    noBtnText: { color: '#fff', fontFamily: 'PoppinsM', fontSize: wp('3.4%') },
})