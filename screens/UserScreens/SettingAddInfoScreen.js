import React, { Component, useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
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
import {getLoggedInStatus, getUser, VERIFY_OTP_SUCCESS} from "../../reducers/authReducer";
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
import {hideLoading, showLoading} from "../../reducers/appReducer";
import {getCustomerDetail, getCustomerDetails, loadAddress} from "../../reducers/userReducer";
import {getAllMyCard} from "../../reducers/paymentReducer";

const SettingAddInfoScreen = ({ navigation, token }) => {
  //export default function SettingAddInfoScreen({ navigation, token }) {
  const [isLoading, setLoading] = useState(true);
  const [previewOTP, setpreviewOTP] = useState(0);
  const [previewOTP2, setpreviewOTP2] = useState(0);
  const [modalComingsoon, setModalComingsoon] = useState(false);
  const isLoggedIn = useSelector(getLoggedInStatus);
  const dispatch = useDispatch();
  const userData = useSelector(getUser);
  const customerDetailsData = useSelector(getCustomerDetails);
  console.log('userData [settingAddScreen]', customerDetailsData);
  const [displayName, setDisplayName] = useState(customerDetailsData[0] ? customerDetailsData[0].name : "");
  const [displayPhoneNumber, setDisplayPhoneNumber] = useState(
      customerDetailsData[0] ? customerDetailsData[0].deviceToken : ""
  );
const [x,setX]=useState(0)
  const [displayPhoneNumberNew, setDisplayPhoneNumberNew] =
    useState(customerDetailsData[0] ? customerDetailsData[0].deviceToken : "");

  const [displayAlternatePhoneNumber, setDisplayAlternatePhoneNumber] =
    useState(userData ? userData.secondaryPhoneNumber : "");

  const [displayAlternatePhoneNumberNew, setDisplayAlternatePhoneNumberNew] =
    useState(userData ? userData.secondaryPhoneNumber : "");

  const [displayCountryCode, setDisplayCountryCode] = useState(
      customerDetailsData[0] ? customerDetailsData[0].countryCode.slice(1) : "971"
  );
  const [displayAlternateCountryCode, setdisplayAlternateCountryCode] =
    useState(customerDetailsData[0] ? customerDetailsData[0].countryCode.slice(1) : "971");
  const [otp, setOtp] = useState("");
  const [otp2, setOtp2] = useState("");
  const [displayEmail, setDisplayEmail] = useState(
      customerDetailsData[0] ? customerDetailsData[0].email : ""
  );
  const [displayDOB, setDisplayDOB] = useState(customerDetailsData[0] ? customerDetailsData[0].dob : null);
  const [displayLanguage, setDisplayLanguage] = useState(
      customerDetailsData[0] ? customerDetailsData[0].language : ""
  );
  const [displayNationality, setDisplayNationality] = useState(
      customerDetailsData[0] ? customerDetailsData[0].nationality : ""
  );
  const [displayProfilePic, setDisplayProfilePic] = useState(
    userData ? userData.profilePicURL : ""
  );
  //const customerDetailsData = useSelector(getCustomerDetails);

  const setUserDetails = async () => {
    let CD = customerDetailsData;
    console.log("customerDetailsData[0]",CD)
    if(CD[0]!==null){
      console.log("name[0]",CD[0].name)
      setDisplayName(CD[0].name)
    }
  }


  useEffect(async () => {
    if (token != null) {
        await dispatch(showLoading());
        await dispatch(getCustomerDetail(displayEmail));
        await dispatch(hideLoading());
    } else {
      navigation.navigate('AccountPage');
    }
  }, [x]);
  //console.log("userDatasInfo", userData);

  // const changeProfilePic = async () => {
  //   // No permissions request is necessary for launching the image library
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     //base64: true,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 0.5,
  //   });
  //
  //   if (!result.cancelled) {
  //     console.log('image selected', result.uri)
  //     setDisplayProfilePic(result.uri);
  //   }
  // };
  const [date, setDate] = useState(new Date(displayDOB));
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const onDateChange = (event, selectedDate) => {
    console.log("selectedDate", selectedDate, "datee", date.toJSON())
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

  // const checkValidString = (el) => {
  //   return el != "";
  // };

  const updateUserData = async () => {
    if (isLoggedIn) {
      try {
        console.log("token", token);
        console.log("date", date);
        const api = `${BASE_URL}customer/updateProfile`;

        if (!displayName) {
          await dispatch(
            showError({
              title: "Error",
              message: "please check your Name",
              statusCode: 400,
            })
          )
          return;
        }

        if (!displayLanguage) {
          await dispatch(
            showError({
              title: "Error",
              message: "please check your language",
              statusCode: 400,
            })
          )
          return;
        }
        if (!date) {
          await dispatch(
            showError({
              title: "Error",
              message: "please check your D.O.B",
              statusCode: 400,
            })
          )
          return;
        }
        if (!displayNationality) {
          await dispatch(
            showError({
              title: "Error",
              message: "please check your Nationality",
              statusCode: 400,
            })
          )
          return;
        }
        if (displayPhoneNumber !== displayPhoneNumberNew && !otp) {
          await dispatch(
            showError({
              title: "Error",
              message: "please check your OTP for your new contact number",
              statusCode: 400,
            })
          );
          return;
        }

        if (displayAlternatePhoneNumber !== displayAlternatePhoneNumberNew && !otp2) {
          await dispatch(
            showError({
              title: "Error",
              message: "please check your OTP for your new contact number",
              statusCode: 400,
            })
          );
          return;
        }

        let fdata = new FormData();
        fdata.append("name", displayName);
        fdata.append("countryCode", "+971");
        fdata.append("language", displayLanguage);
        fdata.append("dob", date.toJSON());
        fdata.append("nationality", displayNationality);
        fdata.append("profilePic", displayProfilePic);
        if (displayPhoneNumber !== displayPhoneNumberNew && otp) {
          fdata.append("secondaryPhoneNumber", displayAlternatePhoneNumberNew);
          fdata.append("otp", Number(otp))
        }

        if (displayAlternatePhoneNumber !== displayAlternatePhoneNumberNew && otp2) {
          fdata.append("secondaryPhoneNumber", displayAlternatePhoneNumberNew);
          fdata.append("otp", Number(otp))
        }

        console.log("form data", fdata);
        fetch(api, {
          method: 'PUT',
          body: fdata,
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          }
        })
          .then(response => response.json())
          .then(async data => {
            if (data.statusCode === 200) {
              // console.log("datacc",data.data.userDetails);
setX(!x)
              setDisplayName(displayName)
              await dispatch(
                  showError({
                    title: "Success",
                    message: "User data successfully updated",
                    statusCode: 200,
                  })
              );
              // navigation.goBack();
            } else {
              console.log("dataaaa", data);
              // throw data;
            }


          })
          .catch(async err => await dispatch(
            showError({
              title: "Error",
              message: err?.message,
              statusCode: err?.statusCode,
            })
          ));
      } catch (err) {
        await dispatch(
          showError({
            title: "Error",
            message: err?.message,
            statusCode: err?.statusCode,
          })
        )
        //alert('User details not updated')
      } finally {
        setLoading(false);
      }
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


  // const showOTPDialog = (val) => {
  //   //console.log(val);
  //   if (val.length > 7) {
  //     try {
  //       const ph = parsePhoneNumber(`+${displayCountryCode}${val}`);
  //       if (
  //         ph &&
  //         validateNumber(ph, displayCountryCode, `+${displayCountryCode}${val}`)
  //       ) {
  //         setpreviewOTP(1);
  //       } else {
  //         setpreviewOTP(0);
  //       }
  //     } catch (e) { }
  //   }
  //   setDisplayPhoneNumberNew(val);
  // };

  const showOTPDialog2 = (val) => {
    //console.log(val);
    if (val.length > 7) {
      try {
        const ph = parsePhoneNumber(`+${displayCountryCode}${val}`);
        if (
          ph &&
          validateNumber(ph, displayCountryCode, `+${displayCountryCode}${val}`)
        ) {
          setpreviewOTP2(1);
        } else {
          setpreviewOTP2(0);
        }
      } catch (e) { }
    }
    console.log("1111111")
    setDisplayAlternatePhoneNumberNew(val);
    console.log("222222222")
  };

  //   sendOtp
  const resendOTP = async (phoneType) => {
    var data = new FormData();
    if (phoneType === 'primaryPhone') {
      data.append("phoneNo", displayPhoneNumberNew);
    } else if (phoneType === 'secondaryPhone') {
      console.log("sending otp to secondary number");
      data.append("secondaryPhoneNumber", displayAlternatePhoneNumberNew);
    }
    data.append("countryCode", "+971");


    let url = `${BASE_URL}customer/resendOTPToNewNumber`;
    fetch(url, {
      method: 'PUT',
      body: data,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.statusCode);
        console.log("sent otp to secondary number");
      })
      .catch(async err => await dispatch(
        showError({
          title: "Error",
          message: err?.message,
          statusCode: err?.statusCode,
        })
      ));

  };

  return (
    <View>
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
                  {/* <View style={[css.alignCenter]}>
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
                  </View> */}
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
                    <View>
                      <TextInput
                        style={[form.input, styles.mobileInput]}
                        placeholder="Mobile Number"
                        value={displayPhoneNumberNew ? displayPhoneNumberNew : ""}
                      editable={false}
                      />
                      <Image
                        style={{ position: "absolute", right: 15, top: 15 }}
                        source={require(imgPath + "basicInfo_mobile.png")}
                      />
                    </View>
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
                      value={displayAlternatePhoneNumberNew ? displayAlternatePhoneNumberNew : ""}
                      onChange={(text) => {
                        showOTPDialog2(text.nativeEvent.text);
                      }}
                      keyboardType="numeric"
                      dataDetectorTypes={"phoneNumber"}
                    />

                    <Image
                      style={{ position: "absolute", right: 15, top: 15 }}
                      source={require(imgPath + "basicInfo_mobile.png")}
                    />
                  </View>
                  {previewOTP2 == 1 && (
                    <View style={[css.marginB5, form.mobileInput]}>
                      <Pressable
                        onPress={() => {
                          resendOTP("secondaryPhone")
                        }}
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
                        value={otp2}
                        onChange={(text) => {
                          setOtp2(text.nativeEvent.text);
                        }}
                        // onChangeText={newText => setOtp2(newText)}
                        keyboardType="numeric"
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
    </View>
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
