import React from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import Modal from 'react-native-modal';
import css from '../commonCss';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function YesOrNoModal(props) {
    return (
        <Modal
            //animationType="fade"
            isVisible={props.isVisible}
            //animationIn='fadeIn'
            animationInTiming={500}
            //animationOut='fadeOut'
            animationOutTiming={500}
            coverScreen={true}
            useNativeDriver={true}
            style={{ margin: 0 }}
            hideModalContentWhileAnimating={true}
            onBackdropPress={() => props.onClose()}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={[styles.modalHeader]}>
                        <Text style={styles.modalText}>Are you sure want to change the city?</Text>
                        <Text style={styles.modalText}>You will loose all information entered.</Text>
                    </View>
                    <View style={[styles.modalBody]}>
                        <View style={[css.flexDRSB]}>
                            <TouchableOpacity
                                style={[styles.cancelBtn]}
                                onPress={() => props.onClose()}
                            >
                                <Text style={[styles.cancelBtnText]}>Yes, Change</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.continueBtn]}
                                onPress={() => props.onClose()}
                            >
                                <Text style={[styles.continueBtnText]}>No, Continue</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </View>
        </Modal>
    );
};
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%'
    },
    modalHeader: {
        padding: 40,
        backgroundColor: '#f2f4f8',
        borderRadius: 10,
        width: '100%',
        paddingBottom: 30,
    },
    modalBody: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        width: '100%',
    },
    modalText: {
        textAlign: "center",
        fontSize: wp('3%'),
        fontFamily: 'PoppinsR',
        color: '#606060',
        marginBottom: 10
    },
    cancelBtn: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f2f4f8',
        height: 40,
        borderRadius: 27,
        fontFamily: 'PoppinsM',
        textAlign: 'center',
        textTransform: 'uppercase',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
        width: '45%'
    },
    cancelBtnText: {
        fontSize: wp('3.4%'),
        fontFamily: 'PoppinsM',
        letterSpacing: 0.25,
        color: '#000000a3',
        textTransform: 'uppercase',
    },
    continueBtn: {
        backgroundColor: '#f6b700',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        borderRadius: 27,
        fontFamily: 'PoppinsM',
        textAlign: 'center',
        textTransform: 'uppercase',
        ...css.boxShadow,
        width: '45%',
    },
    continueBtnText: {
        fontSize: wp('3.4%'),
        fontFamily: 'PoppinsM',
        letterSpacing: 0.25,
        color: '#fff',
        textTransform: 'uppercase',
    },
});
