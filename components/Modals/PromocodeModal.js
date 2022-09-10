import React, { useState, } from "react";
import {
    StyleSheet,
    View,
    Text,
    Image,
    Pressable,
    Dimensions,
    TextInput,
    Platform,
} from "react-native";
import Modal from 'react-native-modal';
import { AntDesign } from '@expo/vector-icons';
import css from '../commonCss';
const windowHeight = Dimensions.get('window').height;
let imgPath = '../../assets/icons/';
import OfferlistModal from "./OfferlistModal";
import { useSelector } from "react-redux";
import { getAccessToken } from "../../reducers/authReducer";
import LoginModal from "../LoginModal";

export default function PromocodeModal(props) {
    const token = useSelector(getAccessToken);
    const [isOfferlistModal, setIsOfferlistModal] = useState(false);
    const [code, setCode] = useState(null);
    const [isLoginRequestModal, setIsLoginRequestModal] = useState(false);

    return (
        <>
            <Modal
                animationType="fade"
                isVisible={props.isVisible}
                hasBackdrop={true}
                animationIn='slideInUp'
                animationInTiming={700}
                animationOut='slideOutDown'
                animationOutTiming={700}
                coverScreen={false}
                useNativeDriver={true}
                style={[styles.modalRoot]}
                hideModalContentWhileAnimating={true}
                onBackdropPress={() => props.onClose()}
                backdropOpacity={0.7}
            >
                <View style={[styles.modalViewFull]}>
                    <View style={[css.marginB30]}>
                        {token &&
                            <View style={[css.flexDRSB]}>
                                <View style={[css.width70]}>
                                    {props?.appliedPromoCode? <TextInput
                                        value={props?.appliedPromoCode}
                                        style={[styles.textInputBox]}
                                        editable={false}
                                    /> : <TextInput
                                        value={code}
                                        style={[styles.textInputBox]}
                                        placeholder="Add Promo Code"
                                        onChange={(text) => setCode(text.nativeEvent.text)}
                                    />}
                                </View>
                                <View style={[css.width30]}>
                                    {props?.appliedPromoCode? <Pressable
                                        style={[styles.removeButton]}
                                        onPress={() => props?.onRemoveOffer()}
                                    >
                                        <Text style={[css.f16, {color: "red"}, css.alignSelfC, css.fsb]}>Remove</Text>
                                    </Pressable> : <Pressable
                                        style={[styles.applyButton]}
                                        onPress={() => props.onApplyOffer(code)}
                                    >
                                        <Text style={[css.f16, css.brandC, css.alignSelfC, css.fsb]}>Apply</Text>
                                    </Pressable>}
                                </View>
                            </View>
                        }
                        <View style={[css.boxShadow, css.liteBlueBG, css.padding10, css.borderRadius10, css.marginT10]}>
                            <View style={[css.flexDRSB]}>
                                <View style={[css.flexDR]}>
                                    <View style={[css.alignSelfC]}>
                                        <AntDesign style={[css.marginR5]} name="tags" size={40} color="#2eb0e4" />
                                        {/* <Image style={[css.img30, css.marginR5,]} source={require(imgPath + 'percenttags.png')} /> */}
                                    </View>
                                    <View style={[css.flexDC]}>
                                        <Text style={[css.brandC, css.fbo, css.f16]}>Offers</Text>
                                        {token ?
                                            <Text style={[css.fr, css.f12, css.grayC]}>Select a PROMOCODE to apply</Text>
                                            :
                                            <Text style={[css.fr, css.f12, css.grayC]}>Login/Signup t view curent offers.</Text>
                                        }
                                    </View>
                                </View>
                                <View style={[css.alignSelfC]}>
                                    <Pressable onPress={() => { token ? setIsOfferlistModal(true) : setIsLoginRequestModal(true) }}>
                                        <Text style={[styles.offerButton, token ? css.yellowC : null]}>{token ? 'View Offers' : 'LOGIN'}</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            <OfferlistModal 
                isVisible={isOfferlistModal} 
                onClose={() => { setIsOfferlistModal(false) }} 
                offers={props.offers} 
                loadOffers={props.loadOffers} 
                onApplyOffer={props.onApplyOffer} 
            />

            {isLoginRequestModal &&
                <LoginModal
                    changeData={true}
                    falseData={(data) => setIsLoginRequestModal(data)}
                    userData={() => { }}
                />
            }
        </>
    );
};


const styles = StyleSheet.create({
    modalRoot: {
        margin: 0,
        marginBottom: 60,
        zIndex: 1,
    },
    modalViewFull: {
        backgroundColor: "white",
        padding: 20,
        height: 'auto',
        marginTop: 'auto',
        elevation: Platform.OS === 'android' ? 10 : 0,
        borderRadius: 20,
    },
    textInputBox: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        width: '95%',
        height: 42,
        paddingLeft: 10,
        paddingRight: 10
    },
    applyButton: {
        borderRadius: 5,
        borderWidth: 2,
        borderColor: '#2eb0e4',
        height: 40,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    removeButton: {
        borderRadius: 5,
        borderWidth: 2,
        borderColor: 'red',
        height: 40,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    offerButton: {
        ...css.brandC,
        ...css.fbo,
        ...css.f16,
        textDecorationLine: 'underline'
    }
})