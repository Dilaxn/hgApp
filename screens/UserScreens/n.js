import React, { Component, useState, useEffect, useCallback } from "react";
import {
    StyleSheet,
    View,
    SafeAreaView,
    ScrollView,
    Image,
    TouchableOpacity,
    Pressable,
    Dimensions,
    KeyboardAvoidingView,
    TextInput,
    TouchableWithoutFeedback,
    Platform,
    Keyboard,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import "moment-timezone";
import axios from "axios";
import { BASE_URL } from "../../base_file";
import css from "../../components/commonCss";
import Text from "../../components/MyText";
import { Feather, AntDesign } from "@expo/vector-icons";
import StatusBarAll from "../../components/StatusBar";
import { connect, useDispatch, useSelector } from "react-redux";
import { getLoggedInStatus, getUser } from "../../reducers/authReducer";
import * as ImagePicker from "expo-image-picker";
import CountryPicker from "rn-country-picker";
let imgPath = "../../assets/icons/";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { parsePhoneNumber } from "libphonenumber-js";
import { showError } from "../../ErrorMessage";

const SettingAddInfoScreen = ({ navigation, token }) => {
    //export default function SettingAddInfoScreen({ navigation, token }) {
    const [isLoading, setLoading] = useState(true);
    const [previewOTP, setpreviewOTP] = useState(0);
    const [modalComingsoon, setModalComingsoon] = useState(false);
    const isLoggedIn = useSelector(getLoggedInStatus);
    const dispatch = useDispatch();
    const userData = useSelector(getUser);
    // console.log('userData [settingAddScreen]', userData);
    const [displayName, setDisplayName] = useState(userData ? userData.name : "");
    const [displayPhoneNumber, setDisplayPhoneNumber] = useState(
        userData ? userData.phoneNumber : ""
    );
    const [displayAlternatePhoneNumber, setdisplayAlternatePhoneNumber] =
        useState(userData ? userData.secondaryPhoneNumber : "");
    const [displayCountryCode, setDisplayCountryCode] = useState(
        userData ? userData.countryCode.slice(1) : "971"
    );
    const [displayAlternateCountryCode, setdisplayAlternateCountryCode] =
        useState(userData ? userData.countryCode.slice(1) : "971");
    const [otp, setOtp] = useState("");
    const [displayEmail, setDisplayEmail] = useState(
        userData ? userData.email : ""
    );
    const [displayDOB, setDisplayDOB] = useState(userData ? userData.dob : null);
    const [displayLanguage, setDisplayLanguage] = useState(
        userData ? userData.language : ""
    );
    const [displayNationality, setDisplayNationality] = useState(
        userData ? userData.nationality : ""
    );
    const [displayProfilePic, setDisplayProfilePic] = useState(
        userData ? userData.profilePicURL : ""
    );

    //console.log("userDatasInfo", userData);

    const changeProfilePic = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            //aspect: [4, 3],
            quality: 1,
        });
        console.log("imageChange", result);
        if (!result.cancelled) {
            setDisplayProfilePic(result.uri);
        }
    };
    const [date, setDate] = useState(new Date(displayDOB));
    const [mode, setMode] = useState("date");
    const [show, setShow] = useState(false);
    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === "ios");
        setDate(currentDate);
    };
    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };
    const showDatepicker = () => {
        showMode("date");
    };
    const showTimepicker = () => {
        showMode("time");
    };

    const checkValidString = (el) => {
        return el != "";
    };

    const updateUserData = async () => {

        try {
            let fdata = new FormData();
            if (isLoggedIn) {
                const api = `${BASE_URL}customer/updateProfile`;

                console.log("user loggedin");
                console.log(token)
                console.log(displayName);
                console.log(displayPhoneNumber);
                console.log(displayCountryCode);
                console.log(displayEmail);
                console.log(date);
                console.log(displayLanguage);
                console.log(displayNationality);
                console.log(displayProfilePic);


                if (!displayName) {
                    console.log("err");
                    return;
                }

                if (!displayLanguage) {
                    $.growl.error({message: "Language cannot be empty"});
                    return;
                }
                if (!date) {
                    $.growl.error({message: "Please enter your DOB"});
                    return;
                }
                if (!displayNationality) {
                    $.growl.error({message: "Please enter your nationality"});
                    return;
                }
                if (existingNumber !== newNumber && !params.otp) {
                    $.growl.error({message: "Please enter OTP to update phoneNo"});
                    return;
                }
                //
                // if (existingSecondaryPhoneNumber !== newSecondaryPhoneNumber && !params.secondaryOTP) {
                //   $.growl.error({message: "please enter OTP to update secondary phone number"});
                //   return;
                // }
                // if ($("#file-input").prop("files") && $("#file-input").prop("files")[0]) {
                //   data.append("profilePic", $("#file-input").prop("files")[0]);
                //   $("#user-img").html($("#file-input").prop("files")[0]);
                // }
                fdata.append("name", displayName);
                fdata.append("countryCode", "+971");
                // if (existingNumber !== newNumber && params.otp) {
                //   data.append("phoneNo", params.phoneNo);
                //   data.append("otp", params.otp)
                // }
                //
                // if (existingSecondaryPhoneNumber !== newSecondaryPhoneNumber && params.secondaryOTP) {
                //   data.append("secondaryPhoneNumber", params.secondaryPhoneNumber);
                //   data.append("otp", params.secondaryOTP)
                // }

                fdata.append("language", displayLanguage);
                fdata.append("dob", date);
                fdata.append("nationality", displayNationality);

                fetch('https://beta.api.homegenie.com/api/customer/updateProfile', {
                    method: 'PUT',
                    body: fdata,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                        'Content-Type': 'multipart/form-data'
                    }
                })
                    .then(response => {
                        console.log("cchk");
                        response.json()
                    })
                    .then(ress => {
                        console.log("res.statusCode",ress.statusCode);
                        navigation.goBack();
                    })
                    .catch(async err => await dispatch(
                        showError({
                            title: "Error",
                            message: err.message,
                            statusCode: err.statusCode,
                        })
                    ));
            }
        }
        catch
            (error)
        {
            console.error(error);
            //alert('User details not updated')
        }
        finally
        {
            setLoading(false);
        }


    };

    const validateNumber = (ph, countryCodeNew, fullnumber) => {
        const pnumber = fullnumber;

        console.log("pnumber", pnumber);

        if (countryCodeNew == "971") {
            const uae = /^((?:\+971|971|00971|0)?(?:50|51|52|55|56|57|58|59)\d{7})$/;

            const isValidUAE = uae.test(pnumber);

            console.log("UAE isValidUAE", isValidUAE);

            return isValidUAE && ph.isValid();
        }

        if (countryCodeNew == "91") {
            const ind = /^((?:\+91|91)?(?:[6-9])\d{9})$/;

            const isValidIN = ind.test(pnumber);

            console.log("INDIA isValidIN", isValidIN);

            return isValidIN && ph.isValid();
        }

        return ph.isValid();
    };

    const showOTPDialog = (val) => {
        //console.log(val);
        if (val.length > 7) {
            try {
                const ph = parsePhoneNumber(`+${displayCountryCode}${val}`);
                if (
                    ph &&
                    validateNumber(ph, displayCountryCode, `+${displayCountryCode}${val}`)
                ) {
                    setpreviewOTP(1);
                } else {
                    setpreviewOTP(0);
                }
            } catch (e) { }
        }
        setdisplayAlternatePhoneNumber(val);
    };

    //   sendOtp
    const resendOTP = async () => {
        if (displayAlternatePhoneNumber) {
            const header = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const OtpForm = {};
            OtpForm["secondaryPhoneNumber"] = displayAlternatePhoneNumber;
            OtpForm["countryCode"] = "+" + displayAlternateCountryCode;

            var url = `${BASE_URL}customer/resendOTPToNewNumber`;
            const response = await axios.put(url, OtpForm, header);
            //   console.log("response Data", response);
            if (response) {
                const jsonData = await response.json();
                let array = jsonData.data;
            }
        }
    };

    return (
        <SafeAreaView>
            <StatusBarAll />
            <View style={css.header}>
                <View style={css.flexDR}>
                    <TouchableOpacity
                        style={[css.whiteC, css.backButton]}
                        onPress={() => navigation.goBack()}
                    >
                        <AntDesign
                            style={[styles.backButton]}
                            name="arrowleft"
                            size={wp("4.85%")}
                            color="white"
                        />
                    </TouchableOpacity>
                    <View style={[css.flexDR_ALC]}>
                        {/* <Image
              style={[styles.titleIcon]}
              source={require(imgPath + "iconIndexWhite.png")}
            /> */}
                        <Feather name="info" size={24} color="white" />
                        <Text style={[css.headerTitle, css.marginL10, css.f24]}>
                            BASIC INFO
                        </Text>
                    </View>
                </View>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView>
                        <View style={[css.section]}>
                            <View style={[css.container]}>
                                <View style={[css.boxShadow, css.padding20]}>
                                    <View style={[css.alignCenter]}>
                                        <Pressable
                                            style={{
                                                width: 70,
                                                height: 70,
                                                borderRadius: 50,
                                                marginBottom: 5,
                                            }}
                                            onPress={changeProfilePic}
                                        >
                                            {displayProfilePic ? (
                                                <Image
                                                    style={{ borderRadius: 50, width: 70, height: 70 }}
                                                    source={{ uri: displayProfilePic }}
                                                />
                                            ) : (
                                                <Image
                                                    style={{ borderRadius: 50 }}
                                                    source={require(imgPath + "genieicon.png")}
                                                />
                                            )}
                                        </Pressable>
                                        <View>
                                            <Text style={[css.blackC, css.fm, css.f14]}>
                                                Profile Photo
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={[css.marginT10, css.line10]}>
                                        <View>
                                            <Text style={[css.blackC, css.fm, css.f24]}>
                                                UPDATE / COMPLETE BASIC INFO
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={[css.marginB5]}>
                                        <TextInput
                                            style={[form.input]}
                                            placeholder="Name"
                                            value={displayName ? displayName : ""}
                                            onChange={(text) => {
                                                setDisplayName(text.nativeEvent.text);
                                            }}
                                        />
                                        <Image
                                            style={{ position: "absolute", right: 15, top: 15 }}
                                            source={require(imgPath + "basicInfo_user.png")}
                                        />
                                    </View>
                                    <View style={[css.marginB5]}>
                                        <TextInput
                                            style={[form.input]}
                                            placeholder="Date of Birth"
                                            value={
                                                date ? moment(new Date(date)).format("DD/MM/YYYY") : ""
                                            }
                                            onFocus={showDatepicker}
                                            onDateChange={(date) => {
                                                setDate({ date: date });
                                            }}
                                        />
                                        {show && (
                                            <DateTimePicker
                                                style={[form.input]}
                                                testID="dateTimePicker"
                                                value={date}
                                                mode={mode}
                                                is24Hour={false}
                                                display="default"
                                                onChange={onDateChange}
                                            />
                                        )}
                                        <Image
                                            style={{ position: "absolute", right: 15, top: 15 }}
                                            source={require(imgPath + "basicInfo_calendar.png")}
                                        />
                                    </View>
                                    <View style={[css.marginB5, form.mobileInput]}>
                                        <CountryPicker
                                            disable={false}
                                            animationType={"fade"}
                                            containerStyle={styles.pickerStyle}
                                            pickerTitleStyle={styles.pickerTitleStyle}
                                            selectedCountryTextStyle={styles.selectedCountryTextStyle}
                                            countryNameTextStyle={styles.countryNameTextStyle}
                                            pickerTitle={"Select Country"}
                                            searchBarPlaceHolder={"Search......"}
                                            hideCountryFlag={false}
                                            hideCountryCode={false}
                                            searchBarStyle={styles.searchBarStyle}
                                            countryCode={displayCountryCode}
                                            selectedValue={(index) => setDisplayCountryCode(index)}
                                        />
                                        <TextInput
                                            style={[form.input, styles.mobileInput]}
                                            placeholder="Mobile Number"
                                            value={displayPhoneNumber ? displayPhoneNumber : ""}
                                            editable={false}
                                        />
                                        <Image
                                            style={{ position: "absolute", right: 15, top: 15 }}
                                            source={require(imgPath + "basicInfo_mobile.png")}
                                        />
                                    </View>
                                    <View style={[css.marginB5, form.mobileInput]}>
                                        <CountryPicker
                                            disable={false}
                                            animationType={"fade"}
                                            containerStyle={styles.pickerStyle}
                                            pickerTitleStyle={styles.pickerTitleStyle}
                                            selectedCountryTextStyle={styles.selectedCountryTextStyle}
                                            countryNameTextStyle={styles.countryNameTextStyle}
                                            pickerTitle={"Select Country"}
                                            searchBarPlaceHolder={"Search......"}
                                            hideCountryFlag={false}
                                            hideCountryCode={false}
                                            searchBarStyle={styles.searchBarStyle}
                                            countryCode={displayAlternateCountryCode}
                                            selectedValue={(index) =>
                                                setdisplayAlternateCountryCode(index)
                                            }
                                        />
                                        <TextInput
                                            style={[form.input, styles.mobileInput]}
                                            placeholder="Alternate Mobile Number"
                                            value={displayAlternatePhoneNumber}
                                            onChange={(text) => {
                                                showOTPDialog(text.nativeEvent.text);
                                            }}
                                            keyboardType="numeric"
                                            dataDetectorTypes={"phoneNumber"}
                                        />

                                        <Image
                                            style={{ position: "absolute", right: 15, top: 15 }}
                                            source={require(imgPath + "basicInfo_mobile.png")}
                                        />
                                    </View>
                                    {previewOTP == 1 && (
                                        <View style={[css.marginB5, form.mobileInput]}>
                                            <Pressable
                                                onPress={resendOTP}
                                                style={[
                                                    css.boxShadow,
                                                    css.yellowBtn,
                                                    css.imgFull,
                                                    css.alignItemsC,
                                                    css.justifyContentC,
                                                    {
                                                        backgroundColor: "#2eb0e4",
                                                        height: 50,
                                                        width: 108,
                                                        marginRight: 4,
                                                    },
                                                ]}
                                            >
                                                <Text style={[css.whiteC, css.fsb, css.f24]}>
                                                    Get OTP{" "}
                                                </Text>
                                            </Pressable>
                                            <TextInput
                                                style={[form.input, styles.mobileInput]}
                                                placeholder="OTP"
                                                value={otp}
                                                onChange={(text) => {
                                                    setOtp(text.nativeEvent.text);
                                                }}
                                                keyboardType="numeric"
                                                dataDetectorTypes={"phoneNumber"}
                                            />
                                        </View>
                                    )}
                                    <View style={[css.marginB5]}>
                                        <TextInput
                                            style={[form.input]}
                                            placeholder="Email"
                                            value={displayEmail ? displayEmail : ""}
                                            editable={false}
                                        />
                                        <Image
                                            style={{ position: "absolute", right: 15, top: 15 }}
                                            source={require(imgPath + "basicInfo_mail.png")}
                                        />
                                    </View>
                                    <View style={[css.marginB5]}>
                                        <TextInput
                                            style={[form.input]}
                                            placeholder="Language"
                                            value={displayLanguage ? displayLanguage : ""}
                                            onChangeText={setDisplayLanguage}
                                        />
                                        <Image
                                            style={{ position: "absolute", right: 15, top: 15 }}
                                            source={require(imgPath + "basicInfo_comment.png")}
                                        />
                                    </View>
                                    <View style={[css.marginB5]}>
                                        <TextInput
                                            style={[form.input]}
                                            placeholder="Nationality"
                                            value={displayNationality ? displayNationality : ""}
                                            onChangeText={setDisplayNationality}
                                        />
                                        <Image
                                            style={{ position: "absolute", right: 15, top: 15 }}
                                            source={require(imgPath + "basicInfo_flag.png")}
                                        />
                                    </View>
                                </View>
                                <Pressable
                                    onPress={updateUserData}
                                    style={[
                                        css.boxShadow,
                                        css.yellowBtn,
                                        css.imgFull,
                                        css.alignItemsC,
                                        css.justifyContentC,
                                        { backgroundColor: "#4bdede", height: 50 },
                                    ]}
                                >
                                    <Text style={[css.whiteC, css.fsb, css.f24]}>UPDATE </Text>
                                </Pressable>
                            </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
const bookModal = StyleSheet.create({
    modalViewFull: {
        backgroundColor: "white",
        //padding: 20,
        height: windowHeight,
    },
    modalHeader: {
        ...css.f14,
        fontFamily: "PoppinsR",
        backgroundColor: "#eff7fc",
        padding: 20,
    },
    modalBody: { ...css.f14, fontFamily: "PoppinsR", padding: 20 },
});
const form = StyleSheet.create({
    input: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        height: 50,
        width: "100%",
        paddingLeft: 20,
        paddingRight: 20,
        ...css.f12,
        fontFamily: "PoppinsR",
        color: "#525252",
    },
    mobileInput: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
    },
});
const styles = StyleSheet.create({
    titleIcon: { width: 25, height: 25 },
    header: {
        width: "100%",
        height: 120,
        paddingTop: 36,
        paddingLeft: 20,
        backgroundColor: "#2eb0e4",
        justifyContent: "center",
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 5,
        shadowColor: "#52006A",
        color: "#fff",
    },
    rbWrapper: {
        alignItems: "center",
        flexDirection: "row",
    },
    rbtextStyle: {
        ...css.f20,
        color: "#525252",
        fontFamily: "PoppinsBO",
        marginLeft: 5,
        justifyContent: "flex-end",
    },
    rbStyle: {
        height: 35,
        width: 35,
        borderRadius: 110,
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#ccc",
        alignItems: "center",
        justifyContent: "center",
    },
    selected: {
        width: 15,
        height: 15,
        borderRadius: 55,
        backgroundColor: "#2eb0e4",
    },
    //country picker style
    pickerTitleStyle: {
        justifyContent: "center",
        flexDirection: "row",
        alignSelf: "center",
        fontFamily: "PoppinsM",
        flex: 1,
        marginLeft: 10,
        fontSize: wp("3.4%"),
        color: "#525252",
    },
    pickerStyle: {
        height: 50,
        fontSize: wp("2.42%"),
        width: "35%",
        justifyContent: "center",
        padding: 10,
        borderRightWidth: 1,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "transparent",
        top: 0,
        left: 0,
        zIndex: 4,
        fontFamily: "PoppinsR",
    },
    selectedCountryTextStyle: {
        paddingLeft: 5,
        paddingRight: 5,
        marginLeft: 5,
        marginRight: 5,
        fontSize: wp("3%"),
        fontFamily: "PoppinsR",
        color: "#525252",
    },

    countryNameTextStyle: {
        paddingLeft: 10,
        fontSize: wp("3%"),
        fontFamily: "PoppinsR",
        color: "#525252",
        textAlign: "right",
    },

    searchBarStyle: {
        flex: 1,
        justifyContent: "center",
        flexDirection: "row",
        marginLeft: 8,
        marginRight: 10,
    },
    mobileInput: {
        width: 203,
    },
});

export default connect(
    (state) => ({ token: state.auth.token }),
    null
)(SettingAddInfoScreen);


const payload = {
    token: token,
    user: {
        name: displayName,
        email: displayEmail,
        phoneNumber: displayPhoneNumberNew,
        countryCode: displayCountryCode,
        dob: displayDOB,
        nationality: displayNationality,
        profilePicURL: displayProfilePic,
        // phoneVerified: data.userDetails.phoneVerified,
        // emailVerified: data.userDetails.emailVerified,
        // firstTimeLogin: data.userDetails.firstTimeLogin,
        language: displayLanguage,
        // customerAddresses: data.userDetails.customerAddresses[0],
        // DefaultAddressFind: data.defaultAddress.find(x => x._id === customerAddresses),
        //defaultCards: data.userDetails.defaultCards._id,
        //customerAddresses: addressData || null,
        //defaultCards: data.defaultCards ? data.defaultCards.Digit : null,
        // IsdefaultAddress: addressData.IsdefaultAddress,
        // addressType: addressData.addressType,
        // apartmentNo: addressData.apartmentNo,
        // city: addressData.city,
        // community: addressData.community,
        // emirate: addressData.emirate,
        // nickName: addressData.nickName,
        // id: data.userDetails._id,
        secondaryPhoneNumber: data.userDetails.secondaryPhoneNumber || null
    },
}
await dispatch({ type: 'hg/auth/user/VERIFY_OTP_SUCCESS', payload });



import React, { StyleSheet, View, ScrollView, Image, Pressable, Linking } from "react-native";
import css from '../../commonCss';
import Text from '../../MyText';
import TextComp from '../../TextComp';
import ShadowCard from "../../ui/ShadowCard";
import { useDispatch, useSelector } from "react-redux";
import { getGenie, getJobDetail, getSingleJob, loadGenie } from "../../../reducers/jobDetailReducer";
import EmergencyGenie from "./components/EmergencyGenie";
import NormalGenieSearch from "./components/NormalGenieSearch";
import { useEffect, useState, useRef } from "react";
import { hideLoading, showLoading } from "../../../reducers/appReducer";
const imgPath = '../../../assets/icons/';

function useInterval(callback, delay, stop) {
    const savedCallback = useRef();
    const interval = useRef();

    useEffect(() => {
        savedCallback.current = callback;

        if (stop?.()) { // call stop to check if you need to clear the interval
            clearInterval(interval.current); // call clearInterval
        }
    });

    useEffect(() => {
        function tick() {
            savedCallback.current();
        }

        interval.current = setInterval(tick, delay); // set the current interval id to the ref

        return () => clearInterval(interval.current);
    }, [delay]);
}

export default function StepGenieSearch({ navigation, bookingId }) {
    // let genieData = useSelector(getGenie) || null;
    const [jobDetail, setJobDetail] = useState(useSelector(getJobDetail));

    const [getGenie, setGenie] = useState(null);
    const [isTimeout, setTimeout] = useState(false);
    // const genie = useSelector(getGenie) || null;
    const dispatch = useDispatch();
    const dd = useSelector(getJobDetail);


    useEffect(async () => {
        if (dd === null) {
            console.log('jobdetail loading........');
            await dispatch(getSingleJob(bookingId));
            await dispatch(showLoading());
            console.log("detail1")
            // setJobDetail(dd);
            await dispatch(hideLoading());
            // if (dd.supplierList && dd.supplierList.length) {
            //     await dispatch(loadGenie(dd.supplierList[0].driverID));
            // }
            // console.log("hide loading")
            // await dispatch(hideLoading());
            // console.log("hide loading2")
        }
        if(jobDetail !== null){
            console.log("detail1",jobDetail)

            if (jobDetail.supplierList && jobDetail.supplierList.length) {
                await dispatch(loadGenie(jobDetail.supplierList[0].driverID));
            }
            console.log("hide loading")
            await dispatch(hideLoading());
            console.log("hide loading2")
        }
    }, [bookingId])

    //console.log("dddd",dd.charges)

    // useEffect(async () => {

    //     const interval = setInterval(async () => {
    //         console.log("setInterval ",bookingId)

    //         if(bookingId) {
    //             const detail = await dispatch(getSingleJob(bookingId));

    //             if(isTimeout) {
    //                 clearInterval(interval);
    //                 console.log("itstime out")
    //             }

    //             if(detail?.driverData) {
    //                 console.log("genie FOUND")
    //                 setGenie(detail?.driverData);

    //                 clearInterval(interval);
    //             }
    //         }

    //     }, 5000);

    //     return () => {

    //         try {
    //             console.log("Cleaning up")
    //             clearInterval(interval);
    //             console.log("done cleaning")

    //         } catch (error) {
    //             console.log("error interval ",error)
    //         }
    //     }

    // }, [])

    useInterval(async () => {

        console.log("setInterval ", bookingId)

        if (bookingId) {
            const dd = await dispatch(getSingleJob(bookingId));

            if (isTimeout) {
                // clearInterval(interval);
                console.log("itstime out")
            }

            if (dd?.driverData) {
                console.log("genie FOUND")
                setGenie(dd?.driverData);

                // clearInterval(interval);
            }
        }

        console.log("Every 5 seconds");
    }, 5000, () => isTimeout == true || getGenie != null);

    const handleTimeout = () => {
        console.log("handleTimeout set true")
        setTimeout(true);
    }
    console.log('jobDetail [genie search]', jobDetail);
    return (
        <>
            <ScrollView>
                <View style={[styles.container]}>
                    {dd &&
                    <ShadowCard>
                        {dd.charges.emergencyCharges !== 0 ?
                            <EmergencyGenie navigation={navigation} jobDetail={dd} genie={getGenie} bookingId={bookingId} timeout={handleTimeout} />
                            :
                            <NormalGenieSearch navigation={navigation} jobDetail={dd} genie={getGenie} bookingId={bookingId} />
                        }
                    </ShadowCard>
                    }
                    <View style={[styles.innerContainer]}>
                        <TextComp styles={[css.textCenter]}>Download HomeGenie app today for the best experience and prices!</TextComp>
                        <View style={[css.flexDR]}>
                            <Image style={[styles.appImage]} source={require(imgPath + 'google-play-store.png')} />
                            <Image style={[styles.appImage]} source={require(imgPath + 'app-store.png')} />
                        </View>
                        <TextComp styles={[css.textCenter, css.f10, css.fr]}>For any support, call or WhatsApp us on <Text style={[css.brandC, css.f10, css.fr]} onPress={() => Linking.openURL('tel:+971800443643')}>+971(0)80 0443643 (HGENIE)</Text> and <Text style={[css.brandC, css.f10, css.fr]} onPress={() => Linking.openURL('mailto: support@homegenie.com')}>support@homegenie.com</Text>  from 8 AM to 8 PM (SAT-THU) except public holidays.</TextComp>
                    </View>
                </View>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    innerContainer: { padding: 30, alignItems: 'center' },
    titleContainer: { borderBottomWidth: 1, borderBottomColor: '#ccc', width: '100%' },
    title: { textAlign: 'center', marginBottom: 10 },
    appImage: { margin: 10 }
})



import axios from "axios";
import { BASE_URL } from "../base_file";
import { JobDetailConverter } from "../converters/jobDetailConverter";
import {showError} from "../ErrorMessage";

export const LOAD_JOB_DETAIL = "hg/jobdetails/JOB_DETAIL";
export const LOAD_JOB_DETAIL_SUCCESS = "hg/jobdetails/JOB_DETAIL_SUCCESS";
export const LOAD_JOB_DETAIL_FAIL = "hg/jobdetails/JOB_DETAIL_FAIL";

export const LOAD_GENIE_DATA = "hg/jobdetails/GENIE_DATA";
export const LOAD_GENIE_DATA_SUCCESS = "hg/jobdetails/GENIE_DATA_SUCCESS";
export const LOAD_GENIE_DATA_FAIL = "hg/jobdetails/GENIE_DATA_FAIL";

const initialState = {
    jobdetail: null,
    genie: null,
};

export default function (state = initialState, action = {}) {
    switch (action.type) {
        case LOAD_JOB_DETAIL:
            return {
                ...state,
                isJobdetailLoading: true,
                isJobdetailLoadError: null,
            };
        case LOAD_JOB_DETAIL_SUCCESS:
            // console.log('HEllo', action.payload)
            return {
                ...state,
                isJobdetailLoading: false,
                isJobdetailLoadError: null,
                jobdetail: action.payload,
            };
        case LOAD_JOB_DETAIL_FAIL:
            return {
                ...state,
                isJobdetailLoading: false,
                isJobdetailLoadError: true,
            };
        case LOAD_GENIE_DATA:
            return {
                ...state,
                isGenieLoading: true,
                isGenieLoadError: null,
            };
        case LOAD_GENIE_DATA_SUCCESS:
            // // console.log('HEllo', action.payload)
            return {
                ...state,
                isGenieLoading: false,
                isGenieLoadError: null,
                genie: action.payload,
            };
        case LOAD_JOB_DETAIL_FAIL:
            return {
                ...state,
                isGenieLoading: false,
                isGenieLoadError: true,
            };
        default:
            return state;
    }
}

const loadError = async (data) => {
    console.log('allError statusCode', data.statusCode);
    if (data.statusCode != 200) {
        await dispatch(
            showError({
                title: "Error",
                message: data?.message,
                statusCode: data?.statusCode,
            })
        );
    }
}
export const loadJobDetails = (t, jobId, bookingStatus) => async (dispatch, getState) => {
    const { token } = getState().auth;
    try {
        const res = await axios.post(
            `${BASE_URL}customer/getJobDetails`,
            { appointmentId: jobId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("statusCode [loadJobDetails]", res.data.statusCode);
        console.log("message [loadJobDetails]", res.data.message);
        console.log("token [loadJobDetails]", token);
        console.log("jobId [loadJobDetails]", jobId);
        await loadError(res.data);
        const payload = JobDetailConverter.fromApi(
            res.data.data[0],
            bookingStatus
        );
        //console.log('Loaded....... JOB DAGTA [job Reducer]', res);
        dispatch({ type: LOAD_JOB_DETAIL_SUCCESS, payload });
        return payload;
    } catch (e) {
        // console.log('CATCH');
        // console.log(e)
        dispatch({
            type: LOAD_JOB_DETAIL_FAIL,
            payload: e,
        });
    }
};

export const loadGenie = (gid) => async (dispatch, getState) => {
    const { token } = getState().auth;
    try {
        let res = await axios.get(
            `${BASE_URL}customer/getDriverDetails?id=${gid}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("statusCode [loadGenie]", res.data.statusCode);
        console.log("message [loadGenie]", res.data.message);
        await loadError(res.data);
        const payload = res.data.data;
        // console.log('Loaded....... GINE DAGTA');
        dispatch({ type: LOAD_GENIE_DATA_SUCCESS, payload });
        return res.data.data;
    } catch (e) {
        // console.log('CATCH');
        // console.log(e)
        dispatch({
            type: LOAD_GENIE_DATA_FAIL,
            payload: e,
        });
    }
};

export const addRating = (token, data) => async (dispatch) => {
    try {
        const res = await axios.post(
            `${BASE_URL}customer/driverRatingComments`,
            data,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("statusCode [addRating]", res.data.statusCode);
        console.log("message [addRating]", res.data.message);
        await loadError(res.data);
        return true;
    } catch (e) {
        // console.log('CATCH');
        // console.log(e)
        return false;
    }
};

export const cancelJob = (token, data) => async (dispatch) => {
    try {
        const res = await axios.put(`${BASE_URL}customer/JobCancelCharge`, data, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log("statusCode [cancelJob]", res.data.statusCode);
        console.log("message [cancelJob]", res.data.message);
        await loadError(res.data);
        return true;
    } catch (e) {
        // console.log('CATCH');
        // console.log(e)
        return false;
    }
};

export const getJobCancelCharge = (token, jobId) => async (dispatch) => {
    try {
        // console.log('cancelChargeeee');
        const res = await axios.get(
            `${BASE_URL}customer/JobCancelChargeCalculation?jobId=${jobId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("statusCode [getJobCancelCharge]", res.data.statusCode);
        console.log("message [getJobCancelCharge]", res.data.message);
        await loadError(res.data);
        return res.data.data.cancelCharge;
    } catch (e) {
        // console.log('CATCH');
        // console.log(e)
        return false;
    }
};

export const updateInspection = (token, data) => async (dispatch) => {
    // console.log('tokenReducer', token);
    // console.log('dataReducer', data);
    try {
        const res = await axios.put(
            `${BASE_URL}customer/acceptOrRejectedJobOnce/`,
            data,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("statusCode [updateInspection]", res.data.statusCode);
        console.log("message [updateInspection]", res.data.message);
        await loadError(res.data);
        return true;
    } catch (e) {
        // console.log('CATCH');
        // console.log(e)
        return false;
    }
};

export const updatePayment = (token, jobId, amount) => async (dispatch) => {
    try {
        const res = await axios.get(
            `${BASE_URL}customer/cashPayment?appointmentID=${jobId}&amount=${amount}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("statusCode [updatePayment]", res.data.statusCode);
        console.log("message [updatePayment]", res.data.message);
        await loadError(res.data);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
};

export const getAllMyCard = (token) => async (dispatch) => {
    try {
        const res = await axios.get(`${BASE_URL}customer/getAllMyCard`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log("statusCode [getAllMyCard]", res.data.statusCode);
        console.log("message [getAllMyCard]", res.data.message);
        await loadError(res.data);
        const allCards = res.data.data.cards;
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
};

export const cardPayment = (token, formData) => async (dispatch) => {
    try {
        const response = await fetch(`${BASE_URL}customer/paymentDetails`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });
        const json = await response.json();
        await loadError(json);
        return json;
    } catch (e) {
        // console.log('CATCH');
        // console.log(e)
        return false;
    }
};

export const saveCardApi = (token, formData) => async (dispatch) => {
    try {
        const response = await fetch(`${BASE_URL}customer/addCard`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });
        const json = await response.json();
        await loadError(json);
        return json;
    } catch (e) {
        // console.log('CATCH');
        // console.log(e)
        return false;
    }
};

export const oldCardPayment = (token, formData) => async (dispatch) => {
    try {
        const response = await fetch(`${BASE_URL}customer/pay`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });
        const json = await response.json();
        console.log("jsonAPI", json);
        await loadError(json);
        return json;
    } catch (e) {
        // console.log('CATCH');
        // console.log(e)
        return false;
    }
};

export const rejectAdvancePayment = (token, data) => async (dispatch) => {
    // console.log('tokenReducer', token);
    // console.log('dataReducer', data);
    try {
        const res = await axios.put(
            `${BASE_URL}customer/acceptOrRejectedJobOnce/`,
            data,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("statusCode [rejectAdvancePayment]", res.data.statusCode);
        console.log("message [rejectAdvancePayment]", res.data.message);
        await loadError(res.data);
        return true;
    } catch (e) {
        // console.log('CATCH');
        // console.log(e)
        return false;
    }
};

export const getSingleJob = (id) => async (dispatch, getState) => {
    const { token } = getState().auth;
    const fd = new FormData();
    fd.append("appointmentId", id);
    if(id===null){
        console.log("appointmentIdnull");
    }
    else{
        console.log("appointmentId", id);
    }
    //console.log("appointmentId", id);
    try {
        console.debug(`[Log][App][Job Reducer][Single Job][Loading...!!!]`);
        // const res = await fetch(`${BASE_URL}customer/getJobDetails`, {
        //   method: "POST",
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //     Accept: "*/*",
        //     "Content-Type": "multipart/form-data",
        //   },
        //   body: fd,
        // });

        fetch(`${BASE_URL}customer/getJobDetails`, {
            method: 'POST',
            body: fd,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            }
        })
            .then(response => response.json())
            .then(async data => {
                if (data.statusCode === 200) {
                    console.log("datacc",data.data[0]);
                    // await dispatch(
                    //     showError({
                    //       title: "Success",
                    //       message: "User data successfully updated",
                    //       statusCode: 200,
                    //     })
                    // );
                    const payload = JobDetailConverter.fromApi(
                        data.data[0]
                    );
                    //console.log('Loaded....... JOB DAGTA [job Reducer]', res);
                    dispatch({ type: LOAD_JOB_DETAIL_SUCCESS, payload });
                    return payload;
                } else {
                    console.log("dataaaa", data);
                }


            })
            .catch(async err => await dispatch(
                showError({
                    title: "Error",
                    message: err?.message,
                    statusCode: err?.statusCode,
                })
            ));

        // const  data  = await res.json();
        // console.log("respopnse [getSingleJob]", res);
        // console.log("statusCode [getSingleJob]", res.data.statusCode);
        // console.log("message [getSingleJob]", res.data.message);
        // const json = await response.json();
        // await loadError(json);
        // console.debug(`[Log][App][Job Reducer][Single Job][Loaded...!!!]`);
        // return data[0];
    } catch (e) {
        console.log("errrrrr")
        dispatch({
            type: LOAD_JOB_DETAIL_FAIL,
            payload: e,
        });
        return false;
    }
};

// https://beta.api.homegenie.com/api/customer/getJobDetails
//Selectors
export const getJobDetail = (state) => state.jobdetails.jobdetail;
export const getGenie = (state) => state.jobdetails.genie;


import { useState } from "react";
import { StyleSheet, View, ScrollView, Image, Pressable, Linking, Text } from "react-native";
import TextComp from "../../../TextComp";
import css from '../../../commonCss'
import ButtonComp from "../../../ui/ButtonComp";
const imgPath = '../../../../assets/icons/';
import moment from "moment";
import { Entypo } from '@expo/vector-icons';
import { useTimer } from 'react-timer-hook';
import { useSelector } from "react-redux";
import { getAccessToken } from "../../../../reducers/authReducer";
import { Feather } from '@expo/vector-icons';


//let genie = 'found';
export default function EmergencyGenie({ navigation, jobDetail, genie, bookingId, timeout = () => null }) {
    const token = useSelector(getAccessToken)
    const { utc_timing: { requestedTime } } = jobDetail;
    const bookedOn = moment(requestedTime).format('DD MMM YYYY, HH:mm');
    console.log('genie [EMEGENCY GENIE SEARCH]', genie);
    const [isNotFound, setNotFound] = useState(false);

    function MyTimer({ expiryTimestamp }) {
        const {
            seconds,
            minutes,
        } = useTimer({ expiryTimestamp, onExpire: genieNotFound });
        return (
            <TextComp styles={[css.brandC, css.fbo]}>{minutes}{':'}{seconds > 9 ? seconds : "0" + seconds}</TextComp>
        );
    }

    const time = new Date();
    time.setSeconds(time.getSeconds() + 900);

    const genieNotFound = () => {
        timeout();
        setNotFound(true);
        console.log("SET NOT FOUND")
    }

    console.log("jobDetail---",jobDetail)

    return (
        <>
            {jobDetail &&
            <View style={[{ padding: 30, alignItems: 'center' }]}>
                {genie === null ?
                    (isNotFound == false ? <>
                        <View style={[styles.titleContainer]}>
                            <TextComp styles={[styles.title]}>Thank you! {'\n'} Your booking has been received.</TextComp>
                        </View>
                        <View style={[css.flexDR, css.spaceT10]}>
                            <Image
                                style={[css.img40, css.marginR10]}
                                source={{ uri: jobDetail.categoryImage.original }} />
                            <TextComp styles={[css.alignSelfC, css.f12]}><TextComp styles={[css.fbo, css.f12]}>
                                {jobDetail.categoryName}</TextComp> / {jobDetail.subCategory.subCategoryName}</TextComp>
                        </View>
                        <View style={[css.flexDR]}>
                            <TextComp styles={[css.alignSelfC, css.f20, css.fbo, css.marginR10, css.blackC]}>JOB ID</TextComp>
                            <TextComp styles={[css.alignSelfC, css.f20, css.fbo, css.brandC]}>{jobDetail.uniqueCode}</TextComp>
                        </View>
                        <View style={[styles.dateTimeContainer]}>
                            <TextComp styles={[css.f12, css.grayC]}>Booking Date and Time : {bookedOn}</TextComp>
                        </View>
                        <View style={[styles.genieSearchBox]}>
                            <View style={[styles.genieLoading]}>
                                <Image style={[styles.imageLoading]} source={require(imgPath + 'loading-genie.gif')} />
                            </View>
                            <View style={[css.line10, css.imgFull]}><TextComp styles={[css.textCenter, css.spaceT10]}>Searching for a HomeGenie</TextComp></View>
                            <View style={[styles.waitingTime]}>
                                <TextComp>Average waiting time</TextComp>
                                <TextComp styles={[css.brandC, css.textCenter]}>
                                    <MyTimer expiryTimestamp={time} />
                                </TextComp>
                            </View>
                        </View>
                    </> : <>
                        <View style={[styles.titleContainer]}>
                            <TextComp styles={[styles.title]}>Genie not found</TextComp>
                        </View>
                        <View style={[css.flexDR, css.spaceT10]}>
                            <Image
                                style={[css.img40, css.marginR10]}
                                source={{ uri: jobDetail.categoryImage.original }} />
                            <TextComp styles={[css.alignSelfC, css.f12]}><TextComp styles={[css.fbo, css.f12]}>
                                {jobDetail.categoryName}</TextComp> / {jobDetail.subCategory.subCategoryName}</TextComp>
                        </View>
                        <View style={[css.flexDR]}>
                            <TextComp styles={[css.alignSelfC, css.f20, css.fbo, css.marginR10, css.blackC]}>JOB ID</TextComp>
                            <TextComp styles={[css.alignSelfC, css.f20, css.fbo, css.brandC]}>{jobDetail.uniqueCode}</TextComp>
                        </View>
                        <View style={[styles.dateTimeContainer]}>
                            <TextComp styles={[css.f10, css.grayC]}>Booking Date and Time : {bookedOn}</TextComp>
                        </View>
                        <View style={[css.flexDC]}>
                            <Entypo style={[css.textCenter]} name="emoji-sad" size={24} color="#2eb0e4" />
                            <TextComp styles={[css.textCenter]}>Apologies, we are {'\n'} unable to assign a {'\n'} Genie to your {'\n'} booking at this moment.</TextComp>
                        </View>
                    </>) : <>
                        <View style={[styles.titleContainer]}>
                            <TextComp styles={[styles.title]}>Thank you! {'\n'}your booking has been received.</TextComp>
                        </View>
                        <View style={[css.flexDR, css.spaceT10]}>
                            <Image
                                style={[css.img40, css.marginR10]}
                                source={{ uri: jobDetail.categoryImage.original }} />
                            <TextComp styles={[css.alignSelfC, css.f12]}><TextComp styles={[css.fbo, css.f12]}>
                                {jobDetail.categoryName}</TextComp> / {jobDetail.subCategory.subCategoryName}</TextComp>
                        </View>
                        <View style={[css.flexDR]}>
                            <TextComp styles={[css.alignSelfC, css.f20, css.fbo, css.marginR10, css.blackC]}>JOB ID</TextComp>
                            <TextComp styles={[css.alignSelfC, css.f20, css.fbo, css.brandC]}>{jobDetail.uniqueCode}</TextComp>
                        </View>
                        <View style={[styles.dateTimeContainer]}>
                            <TextComp styles={[css.f10, css.grayC]}>Booking Date and Time : {bookedOn}</TextComp>
                        </View>

                        <View style={[styles.genieAssigned, css.borderGrey1, css.borderRadius10, css.imgFull]}>
                            <View style={[css.flexDR, styles.genieHeader, css.padding20]}>
                                <View style={[css.flexDC, css.marginR20, css.width30]}>
                                    <Image style={[styles.genieLogo, css.imgg90, css.borderBlack1, css.borderRadius50]}
                                           source={{ uri: genie.profilePicURL.original }}
                                    />
                                    {/* <Pressable style={[css.alignCenter, css.marginT5]}
                                        onPress={() => setGenieModal(true)}
                                        ><Text style={[css.brandC, css.f12, css.fm, css.textCenter]}>View Profile</Text>
                                        </Pressable> */}
                                </View>
                                <View style={[css.width60]}>
                                    <View>
                                        <Text style={[css.fbo, css.f20, css.blackC]}>{genie.name}</Text>
                                    </View>
                                    <View style={[css.flexDR]}>
                                        <Image style={[css.img20]} source={require(imgPath + 'star-fill.png')} />
                                        <Text style={[css.fr, css.f12, css.blackC, css.alignSelfC, css.marginL5]}>star</Text>
                                    </View>
                                    <Pressable style={[styles.genieFooter, css.brandBG, css.alignCenter, css.imgFull, css.spaceT10, { height: 60, borderRadius: 10 }]}>
                                        <Text onPress={() => Linking.openURL('tel:' + genie.phoneNo)} style={[css.feb, css.f18, css.whiteC]}>
                                            <Feather name="phone-call" size={16} color="white" />
                                            {' '} CALL NOW</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </>

                }
                <View>
                    <TextComp styles={[css.textCenter, css.spaceT10]}>We will intimate you via email, SMS and app notifications the service expert (or "Genie") for the service.</TextComp>
                </View>
                <View style={[styles.buttonContainer, css.flexDR, css.spaceT10]}>
                    <ButtonComp
                        buttonContainer={[css.blueBtn, css.marginR10, { flex: 1 }]}
                        onPress={() => navigation.navigate("JobdetailPage", {
                            token: token, jobId: bookingId, bookingStatus: 'ongoing', redirect: 'MyBookings'
                        })}
                    >VIEW DETAILS</ButtonComp>
                    <ButtonComp
                        buttonContainer={[css.yellowBtn, { flex: 1 }]}
                        onPress={() => navigation.navigate('GetgenieCategories')}
                    >BOOK SERVICE</ButtonComp>
                </View>
            </View>
            }
        </>
    )
}

const styles = StyleSheet.create({
    container: { padding: 20 },
    innerContainer: { padding: 30, alignItems: 'center' },
    titleContainer: { borderBottomWidth: 1, borderBottomColor: '#ccc', width: '100%' },
    title: { textAlign: 'center', marginBottom: 10 },
    imageLoading: { width: 60, height: 60, borderRadius: 50, overlayColor: '#eff7fc', },
    genieSearchBox: { backgroundColor: '#eff7fc', flex: 1, flexDirection: 'column', alignItems: 'center', padding: 20, marginTop: 10, width: '100%', borderRadius: 10 },
})