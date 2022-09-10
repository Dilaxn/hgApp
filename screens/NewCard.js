import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  Text,
} from "react-native";
import { connect } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../base_file";
import Checkbox from "expo-checkbox";
import css from "../components/commonCss";
import { useDispatch } from "react-redux";
import {
  cardPayment,
  getJobDetail,
  loadJobDetails,
  oldCardPayment,
  saveCardApi,
} from "../reducers/jobDetailReducer";
import HeaderTitle from "../components/ui/HeaderTitle";
import TextComp from "../components/TextComp";
import { hideLoading, showLoading } from "../reducers/appReducer";
import { useNavigation } from "@react-navigation/native";
import { Formik } from "formik";
import * as Yup from "yup";
import valid from "card-validator"; //import statement
import { TextInputMask } from "react-native-masked-text";
import { showError } from "../ErrorMessage";
const CardSchema = Yup.object().shape({
  // firstName: Yup.string()
  //   .min(2, 'Too Short!')
  //   .max(50, 'Too Long!')
  //   .required('Required'),
  // lastName: Yup.string()
  //   .min(2, 'Too Short!')
  //   .max(50, 'Too Long!')
  //   .required('Required'),
  // email: Yup.string().email('Invalid email').required('Required'),
  cardHolderName: Yup.string()
    .min(4, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  cardNumber: Yup.string()
    .test(
      "test-number",
      "Credit Card number is invalid",
      (value) => valid.number(value).isValid
    )
    .required(),
  cardSecurityCode: Yup.string()
    .test("test-cvv", "Invalid CVV", (value) => value?.length >= 3) //valid.cvv(value).isValid
    .required(),
  expiryMonth: Yup.string()
    .test(
      "test-month",
      "Invalid Month",
      (value) => valid.expirationMonth(value).isValid
    )
    .required(),
  expiryYear: Yup.string()
    .test(
      "test-year",
      "Invalid Year",
      (value) => valid.expirationYear(value).isValid
    )
    .required(),
});

//import MessageModal from "../components/Modals/MessageModal";
let imgPath = "../assets/icons/";

const NewCard = ({ token, route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const jobId = route.params.jobId;
  var amount = route.params.amount;
  const card = route.params.cardDetails || null;

  //const [cardError, setCardError] = useState({});
  //const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [isSaveCardChecked, setSaveCardChecked] = useState(false);
  const [cardNumber, setCardNumber] = useState(card ? card[0].Digit : null);
  const [cardMonth, setCardMonth] = useState(null);
  const [cardYear, setCardYear] = useState(null);
  const [cardHolderName, setCardHolderName] = useState(null);
  const [cardCvv, setCardCvv] = useState(null);
  const [getCVVError, setCVVError] = useState(false);
  var jobdetail;
  // error for CVV if user use old payment
  useEffect(async () => {
    // if cvv exist and length more than or equal to 3
    await dispatch(loadJobDetails(jobId));
    setCVVError(cardCvv && cardCvv.length >= 3);
    if (jobId != null && jobId != undefined) {
      jobdetail = getJobDetail();
      amount -= parseFloat(jobdetail?.walletDeductAmount);
    }
  }, [cardCvv]);

  const payCharges = async (values) => {
    console.log("payCharges ", values);
    console.log("merchantId ", jobId);
    let cardExpiry = values.expiryYear + values.expiryMonth;

    const cardNumber = values.cardNumber?.replace(/\s/g, "");

    let formData = new FormData();
    formData.append("cardHolderName", values.cardHolderName);
    formData.append("cardNumber", cardNumber);
    formData.append("cardSecurityCode", values.cardSecurityCode);
    formData.append("expiryDate", cardExpiry);

    await dispatch(showLoading());
    var isUpdated = 0;

    if (route.params.jobId != undefined) {
      formData.append("merchantId", jobId);
      formData.append("remember_me", isSaveCardChecked ? "YES" : "NO");
      isUpdated = await dispatch(cardPayment(token, formData));
    } else {
      isUpdated = await dispatch(saveCardApi(token, formData));
    }

    await dispatch(hideLoading());

    if (isUpdated.data) {
      console.log(`[success][App][Payment][New card][success]`, isUpdated);
      if (route.params.jobId != undefined) {
        navigation.replace("BrowserNoBack", {
          url: isUpdated.data.url,
          jobId: jobId,
          token: token,
          amount: amount,
        });
      } else {
        navigation.replace("BrowserNoBack", {
          url: isUpdated.data.url,
        });
      }
    } else {
      console.log(`[Error][App][Payment][New card][Error]`, isUpdated);
      await dispatch(
        showError({
          title: "Error",
          message: isUpdated?.message,
          statusCode: isUpdated?.statusCode,
        })
      );
    }
  };

  const [cardInfo, setCardInfo] = useState({
    cardHolderName: null,
    cardSecurityCode: null,
    expiryDate: null,
    expiryMonth: null,
    expiryYear: null,
  });

  const payChargesOldCard = async () => {
    console.log("cardCvv ", cardCvv);

    if (cardCvv && cardCvv?.length >= 3) {
      let tokenName = card[0].payfortId;
      let formData = new FormData();
      formData.append("merchantId", jobId);
      formData.append("tokenName", tokenName);
      formData.append("id", cardCvv);

      await dispatch(showLoading());
      const isUpdated = await dispatch(oldCardPayment(token, formData));
      await dispatch(hideLoading());

      if (isUpdated.data) {
        console.log(`[success][App][Payment][old card][success]`, isUpdated);
        navigation.replace("BrowserNoBack", {
          url: isUpdated.data.url,
          jobId: jobId,
          token: token,
          amount: amount,
        });
      } else {
        console.log(`[Error][App][Payment][old card][Error]`, isUpdated);
        await dispatch(
          showError({
            title: "Error",
            message: isUpdated?.message,
            statusCode: isUpdated?.statusCode,
          })
        );
      }
    }
  };

  return (
    <View style={[styles.screen]}>
      <HeaderTitle title="Cards" />
      <ScrollView>
        <View style={[css.container]}>
          <Formik
            initialValues={{ email: "" }}
            validationSchema={CardSchema}
            onSubmit={payCharges}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View style={[styles.boxShadow]}>
                <View
                  style={[
                    css.flexDRSB,
                    css.line10,
                    css.borderColorLite,
                    css.padding20,
                  ]}
                >
                  <TextComp>Amont to be paid</TextComp>
                  <TextComp style={[css.brandC, css.fbo]}>
                    AED {amount ? amount : "0.00"}
                  </TextComp>
                </View>
                <View style={[css.padding20]}>
                  <View style={[css.flexDC]}>
                    <TextComp>CARD NUMBER</TextComp>

                    {card !== null ? (
                      <TextInput
                        style={styles.input}
                        underlineColorAndroid="transparent"
                        placeholderTextColor="#ccc"
                        autoCapitalize="none"
                        keyboardType="number-pad"
                        value={cardNumber}
                        editable={false}
                      />
                    ) : (
                      <TextInputMask
                        type={"credit-card"}
                        options={{
                          obfuscated: false,
                          mask: "9999 9999 9999 9999",
                        }}
                        placeholderTextColor="#ccc"
                        placeholder="5124  4524  4245  4452"
                        value={values.cardNumber}
                        onChangeText={handleChange("cardNumber")}
                        onBlur={handleBlur("cardNumber")}
                        style={styles.input}
                      />
                    )}

                    {!!errors.cardNumber && touched.cardNumber ? (
                      <Text style={[styles.error]}>{errors.cardNumber}</Text>
                    ) : null}
                  </View>
                  <View style={[css.flexDRSB]}>
                    {card === null && (
                      <>
                        <View style={[css.flexDC]}>
                          <View>
                            <TextComp>EXPIRY DATE</TextComp>
                          </View>
                          <View style={[css.flexDR]}>
                            <TextInput
                              style={[
                                styles.input,
                                css.textCenter,
                                css.marginR10,
                              ]}
                              underlineColorAndroid="transparent"
                              placeholder="MM"
                              placeholderTextColor="#ccc"
                              autoCapitalize="none"
                              keyboardType="number-pad"
                              maxLength={2}
                              value={values.expiryMonth}
                              onChangeText={handleChange("expiryMonth")}
                              onBlur={handleBlur("expiryMonth")}
                            />
                            <TextInput
                              style={[styles.input, css.textCenter]}
                              underlineColorAndroid="transparent"
                              placeholder="YY"
                              placeholderTextColor="#ccc"
                              autoCapitalize="none"
                              keyboardType="number-pad"
                              maxLength={2}
                              value={values.expiryYear}
                              onChangeText={handleChange("expiryYear")}
                              onBlur={handleBlur("expiryYear")}
                            />
                          </View>
                        </View>
                      </>
                    )}
                    <View style={[css.flexDC]}>
                      <TextComp>CVV</TextComp>
                      <TextInputMask
                        type={"only-numbers"}
                        options={{
                          obfuscated: false,
                          mask: "9999",
                        }}
                        placeholderTextColor="#ccc"
                        placeholder="CVV"
                        maxLength={4}
                        value={values.cardSecurityCode}
                        onChangeText={(value) => {
                          handleChange("cardSecurityCode")(value);
                          setCardCvv(value);
                        }}
                        onBlur={handleBlur("cardSecurityCode")}
                        style={[styles.input, css.textCenter]}
                      />
                    </View>
                  </View>
                  <View style={[css.flexDRSB]}>
                    {(!!errors.expiryMonth && touched.expiryMonth) ||
                    (!!errors.expiryYear && touched.expiryYear) ? (
                      <Text style={[styles.error]}>Enter a valid Date</Text>
                    ) : (
                      card === null && <Text />
                    )}

                    {(!!errors.cardSecurityCode && touched.cardSecurityCode) ||
                    getCVVError ? (
                      <Text style={[styles.error]}>
                        {errors.cardSecurityCode}
                      </Text>
                    ) : null}
                  </View>

                  {card === null && (
                    <View style={[css.flexDC]}>
                      <TextComp>CARD HOLDER NAME</TextComp>
                      <TextInput
                        style={styles.input}
                        underlineColorAndroid="transparent"
                        placeholder="ENTER CARD HOLDER NAME"
                        placeholderTextColor="#ccc"
                        autoCapitalize="none"
                        value={values.cardHolderName}
                        onChangeText={handleChange("cardHolderName")}
                        onBlur={handleBlur("cardHolderName")}
                      />
                      {!!errors.cardHolderName && touched.cardHolderName ? (
                        <Text style={[styles.error]}>
                          {errors.cardHolderName}
                        </Text>
                      ) : null}
                    </View>
                  )}
                  <View style={[css.flexDRSB, css.spaceT10]}>
                    {card === null ? (
                      <>
                        {route.params.jobId != undefined && (
                          <View style={[css.flexDR]}>
                            <TextComp style={[css.marginR5]}>
                              Save this Card
                            </TextComp>
                            <Checkbox
                              style={[styles.checkbox]}
                              value={isSaveCardChecked}
                              onValueChange={setSaveCardChecked}
                              color={isSaveCardChecked ? "#2eb0e4" : undefined}
                            />
                          </View>
                        )}
                        <View>
                          <Pressable
                            style={[styles.payButton]}
                            onPress={() => handleSubmit()}
                          >
                            <TextComp style={[css.whiteC]}>
                              {route.params.jobId != undefined
                                ? "PAYNew"
                                : "Add Card"}
                            </TextComp>
                          </Pressable>
                        </View>
                      </>
                    ) : (
                      <View style={[css.imgFull]}>
                        <View style={[css.flexDRR]}>
                          <Pressable
                            style={[styles.payButton]}
                            onPress={() => payChargesOldCard()}
                          >
                            <TextComp style={[css.whiteC]}>PAYOld</TextComp>
                          </Pressable>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            )}
          </Formik>
          <View>
            <TextComp>
              HomeGenie, we do not store any payment card details on its
              platform. All details entered by our customers at the time of
              payment are instantly transmitted to the respective bank through
              PAYFORT, a secure only payment gateway. In addition, all card
              payments on HomeGenie platform utilize the Advanced 3D secure
              authentication method using OTP (one time password) feature.
            </TextComp>
            <TextComp
              style={[css.textCenter, css.greyC, css.spaceT20, css.spaceB10]}
            >
              Payment Powered by
            </TextComp>
            <View style={[{ alignItems: "center", justifyContent: "center" }]}>
              <Image
                style={[{ width: 90, height: 30 }]}
                source={require(imgPath + "payfort.png")}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      {/* <MessageModal isVisibe={messageModalOpen} onClose={navigation.navigate('MyBookingPage')} message={cardError.error} message2={cardError.message} button='ok' /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  boxShadow: {
    elevation: Platform.OS === "android" ? 4 : 0,
    shadowColor: "#525252",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 20,
  },
  payButton: {
    width: 100,
    height: 50,
    backgroundColor: "#4BDEDE",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  error: {
    color: "red",
  },
});

export default connect(
  (state) => ({
    token: state.auth.token,
  }),
  null
)(NewCard);
