import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { BASE_URL } from '../base_file';
import { login, verifyOTP } from '../reducers/authReducer';
import { StyleSheet, View, Pressable, TextInput } from "react-native";
import Modal from 'react-native-modal';
import Checkbox from 'expo-checkbox';
import Text from "./MyText";
import css from './commonCss';
import CountryPicker from 'rn-country-picker';
import parsePhoneNumber from 'libphonenumber-js';
import BackArrow from "./ui/BackArrow";
import { useNavigation } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import TextComp from "./TextComp";


const LoginModal = (props) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [email, setEmail] = useState(null);
    const [userName, setUserName] = useState(null);
    const [nameCheck, setNameCheck] = useState(false);
    const [emailCheck, setEmailCheck] = useState(false);
    const [phone, setPhone] = useState(null);
    const [otp, setOtp] = useState(null);
    const [user, setUser] = useState('inn');
    const [loginModal, setLoginModal] = useState(false);
    const [registerModal, setRegisterModal] = useState(false);
    const [otpModal, setOtpModal] = useState(false);
    const [OtpCodeOne, setOtpCodeOne] = useState(null);
    const [OtpCodeTwo, setOtpCodeTwo] = useState(null);
    const [OtpCodeThree, setOtpCodeThree] = useState(null);
    const [OtpCodeFour, setOtpCodeFour] = useState(null);
    const [displayName, setDisplayName] = useState(null);
    const [displayEmail, setDisplayEmail] = useState(null);
    const [userData, setUserData] = useState(null);
    const [otpSend, setOtpSend] = useState(true);
    const [modalComingsoon, setModalComingsoon] = useState(false);
    const [activeModal, setActiveModal] = useState('login');
    const [isMobileInvalid, setIsMobileInvalid] = useState(false);
    const [isOtpInvalid, setIsOtpInvalid] = useState(false);
    const [isCheckedRemember, setCheckedRemember] = useState(false);

    const [accessToken, setAccessToken] = useState(null);

    const [show, setShow] = useState(true);
    const [countryCode, setCountryCode] = useState('');
    const [selectedCallingCode, setSelectedCallingCode] = useState('');
    const [countryCodeNew, setCountryCodeNew] = useState('971')
    const [countryPlus, setCountryPlus] = useState('+')
    const firtOtp = useRef();
    const secondOtp = useRef();
    const thirdOtp = useRef();
    const fourthOtp = useRef();
    const validateNumber = (ph, countryCodeNew, fullnumber) => {
        const pnumber = fullnumber;
        console.log("pnumber", pnumber)
        if (countryCodeNew == "971") {
            const uae = /^((?:\+971|971|00971|0)?(?:50|51|52|55|56|57|58|59)\d{7})$/
            const isValidUAE = uae.test(pnumber);
            console.log("UAE isValidUAE", isValidUAE)
            return isValidUAE && ph.isValid();
        }
        if (countryCodeNew == "91") {
            const ind = /^((?:\+91|91)?(?:[6-9])\d{9})$/
            const isValidIN = ind.test(pnumber);
            console.log("INDIA isValidIN", isValidIN)
            return isValidIN && ph.isValid();
        }
        return ph.isValid();
    }
    const handleLogin = async () => {
        const ph = parsePhoneNumber(`+${countryCodeNew}${phone}`);
        if (!(ph && validateNumber(ph, countryCodeNew, `+${countryCodeNew}${phone}`))) {
            setIsMobileInvalid(true);
            return
        }
        setIsMobileInvalid(false);
        const data = await dispatch(login(phone, countryPlus + countryCodeNew));
        if (data.isRegistered) {
            setActiveModal('otp');
            firtOtp.current.focus()
        } else {
            setActiveModal(false);
            setActiveModal('register');
        }
    };
    const handleOtpVerification = async () => {
        let otpData = String(OtpCodeOne) + String(OtpCodeTwo) + String(OtpCodeThree) + String(OtpCodeFour);
        const data = {
            deviceType: "WEBSITE",
            deviceToken: "151",
            phoneNo: phone,
            countryCode: countryPlus + countryCodeNew,
            timezone: "Asia/Calcutta",
            latitude: "17.3753",
            longitude: "78.4744",
            OTPCode: otpData
        };
        //const otpfailed = await dispatch(VERIFY_OTP_FAIL())
        const resp = await dispatch(verifyOTP(data));
        if (!resp) {
            setIsOtpInvalid(true);
            return;
        }
        setOtpModal(false)
        setUser('in')
        props.userData(true)
        setOtpCodeOne(null);
        setOtpCodeTwo(null);
        setOtpCodeThree(null);
        setOtpCodeFour(null);
        setDisplayEmail(resp.userDetails.email);
        setDisplayName(resp.userDetails.name);
        if (props.onSuccess) {
            props.onSuccess();
            return;
        }
        props.falseData(false)
    };
    const ResetOtpApi = () => {
        setOtpCodeOne(null);
        setOtpCodeTwo(null);
        setOtpCodeThree(null);
        setOtpCodeFour(null);
        firtOtp.current.focus()
        const ph = parsePhoneNumber(`+${countryCodeNew}${phone}`);
        if (!(ph && validateNumber(ph, countryCodeNew, `+${countryCodeNew}${phone}`))) {
            setIsMobileInvalid(true);
            return
        }
        let data = new FormData();
        data.append('phoneNo', phone);
        data.append('countryCode', countryPlus + countryCodeNew)
        fetch(`${BASE_URL}customer/validatePhoneNo`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: data
        })
            .then(response => response.json())
            .then(res => {
                setOtpSend(false)
            })
    }

    const signUpApi = () => {
        const ph = parsePhoneNumber(`+${countryCodeNew}${phone}`);
        if (!(ph && validateNumber(ph, countryCodeNew, `+${countryCodeNew}${phone}`))) {
            setIsMobileInvalid(true);
            return
        }
        if (userName == null) {
            setNameCheck(true)
        } if (email == null) {
            setEmailCheck(true)
        } else {
            setNameCheck(false)
            setEmailCheck(false)
            let params = new FormData();
            params.append("name", userName);
            params.append("email", email);
            params.append("phoneNo", phone);
            params.append("countryCode", countryPlus + countryCodeNew)
            params.append("deviceType", "WEBSITE");
            params.append("appVersion", "100");
            params.append("timezone", "Asia/Calcutta");
            params.append("country", "Dubai");
            params.append("latitude", "17.3753");
            params.append("longitude", "78.4744");
            params.append("deviceToken", '151');
            fetch(`${BASE_URL}customer/registerViaPhone`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json'
                },
                body: params
            })
                .then(response => response.json())
                .then(res => {
                    if (res.message == 'Success') {
                        // setRegisterModal(false);
                        // setOtpModal(true);
                        setActiveModal(false);
                        setActiveModal('otp');
                    } if (res.message != 'Success') {
                    }
                })
        }
    }

    if (activeModal === 'login') {
        return (
            <>
                <Modal
                    animationType="fade"
                    isVisible={true}
                    hasBackdrop={true}
                    style={{ padding: 0 }}
                    animationIn='fadeIn'
                    animationInTiming={500}
                    animationOut='fadeOut'
                    animationOutTiming={500}
                    useNativeDriver={true}
                    hideModalContentWhileAnimating={true}
                // onBackButtonPress={() => props.falseData(false)}
                // onBackdropPress={() => props.falseData(false)}
                >
                    <View>
                        <View style={[styles.modalView]}>
                            <View style={[styles.signupModalContainer, css.borderRadius10,]}>
                                <View style={[styles.modalHeader, css.BGliteGrey, css.padding20, { borderTopLeftRadius: 10, borderTopRightRadius: 10 }]}>
                                    {(props.noLogin === true) ?
                                        <BackArrow
                                            style={[{ marginTop: 0, marginBottom: 0 }]}
                                            onPress={() => navigation.navigate('Home')}
                                        /> : (props.arrow === false) ?
                                            <Text></Text>
                                            :
                                            <BackArrow
                                                style={[{ marginTop: 0, marginBottom: 0 }]}
                                                onPress={() => props.falseData(false)}
                                            />
                                    }
                                    <Text style={[css.fm, css.f16, css.blackC, css.marginT20, css.textCenter]}>Login/Signup to HomeGenie</Text>
                                    <Text style={[css.fm, css.f12, css.greyC, css.marginT5, css.textCenter]}>Login/Signup to access your stored addressess and service booking details.</Text>
                                </View>
                                <View style={[styles.modalBody, { alignItems: 'center', padding: 20 }]}>
                                    <View style={[css.flexDR, css.alignItemsC, css.width90]}>
                                        <CountryPicker
                                            disable={false}
                                            animationType={'fade'}
                                            containerStyle={styles.pickerStyle}
                                            pickerTitleStyle={styles.pickerTitleStyle}
                                            selectedCountryTextStyle={styles.selectedCountryTextStyle}
                                            countryNameTextStyle={styles.countryNameTextStyle}
                                            pickerTitle={'Select Country'}
                                            searchBarPlaceHolder={'Search......'}
                                            hideCountryFlag={false}
                                            hideCountryCode={false}
                                            searchBarStyle={styles.searchBarStyle}
                                            countryCode={countryCodeNew}
                                            selectedValue={(index) => setCountryCodeNew(index)}
                                        />
                                        <TextInput
                                            style={[css.borderGrey1, css.borderRadius5, css.imgFull, css.padding10, css.fr, css.f14, { height: 60, paddingLeft: '40%' }]}
                                            placeholder="Enter Mobile number"
                                            keyboardType="numeric"
                                            value={phone}
                                            onChange={(text) => setPhone(text.nativeEvent.text)}
                                        />
                                    </View>
                                    <View style={[css.flexDR, css.spaceT20]}>
                                        <Checkbox
                                            style={[css.marginR5]}
                                            value={isCheckedRemember}
                                            onValueChange={setCheckedRemember}
                                            color={isCheckedRemember ? '#2eb0e4' : undefined}
                                        />
                                        <TextComp color={[css.greyC]}>Remember me</TextComp>
                                    </View>
                                    <Pressable
                                        style={[styles.offerBooknow]}
                                        onPress={() => handleLogin()}
                                    >
                                        <Text style={[styles.textStyle, styles.offerBooknowText]}>Login/Signup</Text>
                                    </Pressable>
                                    {isMobileInvalid && <Text style={{ color: 'crimson', marginTop: 10 }}>Invalid Mobile Number!</Text>}
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </>
        );
    }

    if (activeModal === 'register') {

        return (
            <Modal
                animationType="fade"
                isVisible={true}
                hasBackdrop={true}
                animationIn='fadeIn'
                animationInTiming={500}
                animationOut='fadeOut'
                animationOutTiming={500}
                useNativeDriver={true}
                hideModalContentWhileAnimating={true}
                onBackButtonPress={() => props.falseData(false)}
                onBackdropPress={() => props.falseData(false)}
            >
                <View>
                    <View style={[styles.modalView]}>
                        <View style={[styles.signupModalContainer, css.borderRadius10]}>
                            <View style={[styles.modalHeader, { backgroundColor: '#F4F4F4', borderTopLeftRadius: 10, borderTopRightRadius: 10, padding: 20 }]}>
                                <BackArrow
                                    style={[{ marginTop: 0, marginBottom: 0 }]}
                                    onPress={() => props.falseData(false)}
                                    text={null}
                                />
                                <Text style={[css.fm, css.f18, css.blackC, css.marginT20, css.textCenter]}>SIGNUP</Text>
                                <Text style={[css.fm, css.f14, css.greyC, css.marginT5, css.textCenter]}>Signup and enjoy all the features including our amazing offers.</Text>
                            </View>
                            <View style={[styles.modalBody, { alignItems: 'center', padding: 20 }]}>
                                <TextInput
                                    style={[styles.input]}
                                    id="Name"
                                    placeholder="Name"
                                    keyboardType="default"
                                    required
                                    autoCapitalize="none"
                                    errorMessage="please enter your name"
                                    onChange={(text) => setUserName(text.nativeEvent.text)}
                                    value={userName}
                                />
                                {nameCheck && <Text style={[css.errorText]}>Please enter your name</Text>}
                                <TextInput
                                    style={[styles.input]}
                                    id="Email"
                                    placeholder="Email"
                                    keyboardType="email-address"
                                    required
                                    autoCapitalize="none"
                                    errorMessage="please enter your email-id."
                                    onChange={(text) => setEmail(text.nativeEvent.text)}
                                    value={email}
                                />
                                {emailCheck && <Text style={[css.errorText]}>Please enter your Email</Text>}
                                <Pressable
                                    style={[styles.offerBooknow]}
                                    onPress={() => signUpApi()}
                                >
                                    <Text style={[styles.offerBooknowText]}>SIGNUP</Text>
                                </Pressable>
                            </View>
                            <View style={[styles.modalFooter, { backgroundColor: '#F4F4F4', padding: 20, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }]}>
                                <Pressable
                                    onRequestClose={() => {
                                        props.falseData(false)
                                    }}
                                    onPress={() => { props.falseData(true), setActiveModal('login') }}
                                >
                                    {isMobileInvalid && <Text style={{ color: 'crimson', marginTop: 10, marginBottom: 10 }}>Invalid Mobile Number !!!</Text>}

                                    <Text style={[css.text, css.textCenter, { color: '#7e7e7e', fontSize: wp('3%') }]}>Already have an account? <Text style={[css.brandC, css.fm, css.f12]}>Login</Text></Text></Pressable>
                            </View>

                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    if (activeModal === 'otp') {
        return (
            <Modal
                animationType="fade"
                isVisible={true}
                hasBackdrop={true}
                animationIn='fadeIn'
                animationInTiming={500}
                animationOut='fadeOut'
                animationOutTiming={500}
                useNativeDriver={true}
                hideModalContentWhileAnimating={true}
                onBackButtonPress={() => props.falseData(false)}
                onBackdropPress={() => props.falseData(false)}
            >
                <View >
                    <View style={[styles.modalView]}>
                        <View style={[styles.signupModalContainer, css.borderRadius10]}>
                            <View style={[styles.modalHeader, css.padding20, css.BGliteGrey, { borderTopLeftRadius: 10, borderTopRightRadius: 10 }]}>
                                <BackArrow
                                    style={[{ marginTop: 0, marginBottom: 0 }]}
                                    onPress={() => props.falseData(false)}
                                    text={null}
                                />
                                <Text style={[css.fm, css.f18, css.blackC, css.marginT20, css.textCenter]}>ONE TIME PASSCODE (OTP)</Text>
                                <Text style={[css.fm, css.f14, css.greyC, css.marginT5, css.textCenter]}>Please enter 4 digit code sent via SMS</Text>
                            </View>
                            <View style={[styles.modalBody, { alignItems: 'center', padding: 20 }]}>
                                <View style={[css.flexDR]}>
                                    <TextInput
                                        style={[css.borderGrey1, css.borderRadius10, css.textCenter, css.marginR10, css.f24, css.fm, css.blackC, css.width15, { height: 45 }]}
                                        placeholder=""
                                        keyboardType="numeric"
                                        value={OtpCodeOne}
                                        maxLength={1}
                                        onChange={(text) => {
                                            setOtpCodeOne(text.nativeEvent.text);
                                            secondOtp.current.focus();
                                        }}
                                        ref={firtOtp}
                                    />
                                    <TextInput
                                        style={[css.borderGrey1, css.borderRadius10, css.textCenter, css.marginR10, css.f24, css.fm, css.blackC, css.width15, { height: 45 }]}
                                        placeholder=""
                                        keyboardType="numeric"
                                        value={OtpCodeTwo}
                                        maxLength={1}
                                        onChange={(text) => {
                                            setOtpCodeTwo(text.nativeEvent.text);
                                            thirdOtp.current.focus();
                                        }}
                                        ref={secondOtp}
                                    />
                                    <TextInput
                                        style={[css.borderGrey1, css.borderRadius10, css.textCenter, css.marginR10, css.f24, css.fm, css.blackC, css.width15, { height: 45 }]}
                                        placeholder=""
                                        keyboardType="numeric"
                                        value={OtpCodeThree}
                                        maxLength={1}
                                        onChange={(text) => {
                                            setOtpCodeThree(text.nativeEvent.text);
                                            fourthOtp.current.focus();
                                        }}
                                        ref={thirdOtp}
                                    />
                                    <TextInput
                                        style={[css.borderGrey1, css.borderRadius10, css.textCenter, css.marginR10, css.f24, css.fm, css.blackC, css.width15, { height: 45 }]}
                                        placeholder=""
                                        keyboardType="numeric"
                                        value={OtpCodeFour}
                                        maxLength={1}
                                        onChange={(text) => setOtpCodeFour(text.nativeEvent.text)}
                                        ref={fourthOtp}
                                    />
                                </View>

                                <Pressable
                                    style={[styles.offerBooknow]}
                                    //onPress={() => onSubmitLogin()}
                                    onPress={() => handleOtpVerification()}
                                >
                                    <Text style={[styles.textStyle, styles.offerBooknowText]}>CONFIRM</Text>
                                </Pressable>
                                {isOtpInvalid && <Text style={[css.fm, css.f14, { color: 'red' }]}>Invalid Otp</Text>}
                                {/* <Text style={{ color: 'green' }}>{otpSend ? 'OTP Sent' : 'OTP Sent Again'}</Text> */}
                                {!isOtpInvalid && <Text style={[css.fm, css.f14, { color: 'green' }]}>{otpSend ? 'OTP Sent' : 'OTP Sent Again'}</Text>}
                            </View>
                            <View style={[styles.modalFooter, { paddingBottom: 20, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }]}>
                                <Pressable
                                    style={[styles.brand]}
                                    onPress={() => ResetOtpApi()}
                                >
                                    <Text style={[css.fm, css.f14, css.brandC, css.textCenter]}>Resend OTP</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    return null;
};

const styles = StyleSheet.create({
    offerBooknow: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 50,
        backgroundColor: '#f6b700',
        borderColor: '#f6b700',
        borderWidth: 1,
        width: '90%',
        height: 50,
        marginTop: 20,
        marginBottom: 15,
        ...css.boxShadow,
    },
    offerBooknowText: {
        fontSize: wp('3.4%'),
        fontFamily: 'PoppinsM',
        color: '#fff',
    },
    //ModalCss
    modalView: {
        backgroundColor: "white",
        borderRadius: 10,
        ...css.boxShadow,
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 2
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 4,
        // elevation: 5,
        width: '100%'
    },
    //country picker style
    pickerTitleStyle: {
        justifyContent: 'center',
        flexDirection: 'row',
        alignSelf: 'center',
        fontFamily: 'PoppinsM',
        flex: 1,
        marginLeft: 10,
        fontSize: wp('3.4%'),
        color: '#525252',
    },
    pickerStyle: {
        height: 60,
        fontSize: wp('2.42%'),
        width: '35%',
        marginBottom: 10,
        justifyContent: 'center',
        padding: 10,
        borderRightWidth: 1,
        borderRadius: 0,
        borderColor: '#ccc',
        backgroundColor: 'transparent',
        position: 'absolute',
        //top: StatusBar.currentHeight + 20,
        top: 0,
        left: 0,
        zIndex: 4,
        fontFamily: 'PoppinsR'
    },
    selectedCountryTextStyle: {
        paddingLeft: 5,
        paddingRight: 5,
        marginLeft: 5,
        marginRight: 5,
        fontSize: wp('3%'), fontFamily: 'PoppinsR', color: '#525252',
    },

    countryNameTextStyle: {
        paddingLeft: 10,
        fontSize: wp('3%'), fontFamily: 'PoppinsR', color: '#525252',
        textAlign: 'right',
    },

    searchBarStyle: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        marginLeft: 8,
        marginRight: 10,
    },
    input: { borderColor: '#ccc', borderWidth: 1, borderRadius: 5, width: '90%', height: 40, marginTop: 20, padding: 5, fontFamily: 'PoppinsM', fontSize: wp('3.4%'), color: '#525252' },
});

export default LoginModal;