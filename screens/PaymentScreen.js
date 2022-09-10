import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Linking,
  Pressable,
  Alert,
  FlatList,
  TextInput,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "../base_file";
import { connect, useSelector } from "react-redux";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import Text from "../components/MyText";
import Modal from "react-native-modal";
import css from "../components/commonCss";
import { RadioButton } from "react-native-paper";
import Checkbox from "expo-checkbox";
import { useDispatch } from "react-redux";
import { updatePayment, getAllMyCard } from "../reducers/jobDetailReducer";
//import { getCurrentBookings, loadBookings } from '../reducers/myBookingsReducer'
import { getAccessToken } from "../reducers/authReducer";
import HeaderTitle from "../components/ui/HeaderTitle";
import { hideLoading, showLoading } from "../reducers/appReducer";
import TextComp from "../components/TextComp";
import CardType from "credit-card-type";
import YesOrNoModalGeneric from "../components/Modals/YesOrNoModalGeneric";
import { getWallet, getWalletData } from "../reducers/walletReducer";
import { update } from "lodash";
import { showError } from "../ErrorMessage";

const PaymentScreen = ({
  props,
  navigation,
  currentBookings,
  pastBookings,
  token,
  route,
}) => {
  const jobId = route.params.jobId;
  const amount = route.params.amount;
  const [paymentData, setPaymentData] = useState([]);
  const [amountPaidModal, setamountPaidModal] = useState(false);
  const dispatch = useDispatch();
  const [getCards, setGetCards] = useState([]);
  const [cardRadioBtnValue, setCardRadioBtnValue] = useState(null);
  const [errorCard, setErrorCard] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [deleteCardId, setDeleteCardId] = useState(null);
  const [showWallet, setshowWallet] = useState(false);
  const [WalletAmountInput, setWalletAmountInput] = useState(null);
  let walletData = useSelector(getWalletData);
  const filterCard = (cardRadioBtnValue) => {
    const select = getCards.filter((item) => item._id == cardRadioBtnValue);
    setSelectedCard(select);
  };
  console.log("walletData", cardRadioBtnValue);
  const getAllCards = async () => {
    try {
      const res = await axios.get(`${BASE_URL}customer/getAllMyCard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("all cards ", res);
      const allCards = res.data.data.cards;
      console.log("allCardsss", allCards);
      const cardList = allCards?.map((item) => {
        const cardT = item?.Digit ? CardType(item?.Digit) : null;
        return {
          type: cardT?.[0]?.type || null,
          ...item,
        };
      });
      setGetCards(cardList);
    } catch (e) {
      console.log(e);
    }
  };

  const cashPayment = async (jobId, amount) => {
    const isUpdated = await dispatch(updatePayment(token, jobId, amount));
    if (isUpdated) {
      setamountPaidModal(true);
    } else {
      Alert.alert("Error", "Update Failed");
    }
  };

  const valueNull = async () => {
    setErrorCard("Please choose anyone option");
  };

  const deleteCard = async (id) => {
    console.log("item deleted", id);

    let formData = new FormData();
    formData.append("cardId", id);

    console.log("formData ", formData);

    setDeleteCardId(null);

    try {
      dispatch(showLoading());

      // const res = await axios.put(`${BASE_URL}customer/deleteCards`, {
      //     headers: {
      //         Authorization: `Bearer ${token}`
      //     },
      //     body: formData
      // });

      const res = await fetch(`${BASE_URL}customer/deleteCards`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log("deleteCard cards ", res);
      getAllCards();
      dispatch(hideLoading());
    } catch (e) {
      dispatch(hideLoading());
      console.log("deleteCard catch blocks ", e);
      console.log(e);
    }
  };

  useEffect(() => {
    dispatch(getWallet());

    if (token != null) {
      dispatch(showLoading());
      getAllCards();
      dispatch(hideLoading());
    } else {
      navigation.navigate("AccountPage");
    }
  }, []);

  const paymentBtnLabel = () => {
    if (cardRadioBtnValue === "cash" || cardRadioBtnValue === null) {
      return "PAY NOW";
    }

    return "PROCEED";
  };

  const updateWallet = async (amount, jobId, selectedCard) => {
    if (!showWallet) {
      navigation.navigate("NewCard", {
        amount: amount,
        jobId: jobId,
      });
      return;
    }
    if (WalletAmountInput > parseFloat(walletData.totalAmount)) {
      dispatch(
        showError({
          title: "Error",
          message: "Wallet balance is low",
          statusCode: 400,
        })
      );
      return;
    }
    if (amount < WalletAmountInput) {
      dispatch(
        showError({
          title: "Warning",
          message: "Enter only the required amount",
          statusCode: 400,
        })
      );
      return;
    }
    dispatch(showLoading());
    // let data = {};
    // data["appointmentId"] = jobId;
    // data["amount"] = amount;
    let data = new FormData();
    data.append("appointmentId", jobId);
    data.append("amount", amount);
    console.log(data);
    const api = `${BASE_URL}customer/payWithWallet`;
    const response = await fetch(api, {
      method: "POST",
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
      body: data,
    });
    const jsonData = await response.json();
    if (jsonData?.statusCode != 200) {
      dispatch(
        showError({
          title: "Error",
          message: jsonData?.message,
          statusCode: jsonData?.statusCode,
        })
      );
    } else {
      if (amount - WalletAmountInput > 0) {
        amount -= WalletAmountInput;
        if (selectedCard != null && selectedCard != undefined) {
          navigation.navigate("NewCard", {
            amount: amount,
            jobId: jobId,
            cardDetails: selectedCard,
          });
        } else {
          navigation.navigate("NewCard", {
            amount: amount,
            jobId: jobId,
          });
        }
      } else {
        navigation.navigate("MyBookingPage");
      }
    }
    console.log("jsonData", jsonData);

    dispatch(hideLoading());
  };

  // Proceed Payment
  const onProceed = () => {
    // Cash on delivery
    if (cardRadioBtnValue === "cash") {
      cashPayment(jobId, amount);
      return;
    }

    // When no option selected
    if (cardRadioBtnValue === null) {
      valueNull(jobId, cardRadioBtnValue);
      return;
    }

    // New Card
    if (cardRadioBtnValue === "anotherCard") {
      updateWallet(amount, jobId, null);

      return;
    }
    updateWallet(amount, jobId, selectedCard);
    // Existing Card
  };

  const getCardIcon = (type) => {
    //"american-express" | "diners-club" | "discover" | "elo" | "hiper" | "hipercard" | "jcb" | "maestro" | "mastercard" | "mir" | "unionpay" | "visa"

    switch (type) {
      case "visa":
        return "cc-visa";

      case "mastercard":
        return "cc-mastercard";

      case "discover":
        return "cc-discover";

      case "maestro":
        return "credit-card"; //"cc-maestro"

      case "american-express":
        return "cc-amex";

      default:
        return "credit-card";
    }
  };

  return (
    <View style={[styles.screen]}>
      {/* <HeaderTitle title='Payment Method' /> */}
      <View style={[styles.header]}>
        <Pressable
          style={({ pressed }) => [
            styles.buttonContainer,
            pressed && styles.pressed,
          ]}
          onPress={() => navigation.navigate("MyBookingPage")}
        >
          <AntDesign
            style={[styles.backButton]}
            name="arrowleft"
            size={24}
            color="white"
          />
          <Text style={[styles.headerTitle]}>Payment</Text>
        </Pressable>
      </View>
      <ScrollView>
        <View style={[css.container]}>
          <View style={[css.alignItemsC, css.marginT10]}>
            <Text style={[css.fsb, css.f18, css.blackC]}>
              Please select a payment method
            </Text>
          </View>
          <View style={[css.alignItemsC, css.marginT10]}>
            <Text style={[css.greyC, css.f14, css.fr, css.textCenter]}>
              NOTE: You will receive a system generated invoice on your
              registered email address immediately after you complete the
              payment. If not received, please check your SPAM folder or contact{" "}
              <Text
                style={[css.greyC, css.fm, css.f14]}
                onPress={() => Linking.openURL("mailto:support@homegenie.com")}
              >
                support@homegenie.com
              </Text>
            </Text>
          </View>
          <View
            style={[
              css.borderGrey1,
              css.borderRadius5,
              css.padding10,
              css.liteBlueBG,
              css.marginT20,
              css.paddingT20,
              css.paddingB20,
            ]}
          >
            <View style={[css.borderGrey1, css.borderRadius5, css.whiteBG]}>
              <View style={[css.line10, css.padding10, css.borderColorLite]}>
                <Text style={[css.brandC, css.f14, css.fm, css.textCenter]}>
                  Select from your saved cards
                </Text>
              </View>
              {getCards.length > 0 ? (
                <>
                  <RadioButton.Group
                    onValueChange={(newValue) => {
                      setCardRadioBtnValue(newValue), filterCard(newValue);
                    }}
                    value={cardRadioBtnValue}
                  >
                    <FlatList
                      data={getCards}
                      contentContainerStyle={[
                        css.padding10,
                        css.line10,
                        css.borderColorLite,
                      ]}
                      keyExtractor={(item) => item._id}
                      renderItem={({ item }) => (
                        <View style={[css.flexDRSB, { alignItems: "center" }]}>
                          <View style={[css.flexDR]}>
                            <RadioButton value={item._id} />
                            <TextComp style={[{ paddingTop: 10 }]}>
                              {item.Digit}
                            </TextComp>
                          </View>
                          <View
                            style={[
                              { alignItems: "center", flexDirection: "row" },
                            ]}
                          >
                            <View style={{ paddingRight: 10 }}>
                              <FontAwesome
                                name={getCardIcon(item?.type)}
                                size={24}
                                color={"#bababa"}
                              />
                            </View>
                            <View>
                              <Pressable
                                onPress={() => {
                                  // deleteCard(item._id)
                                  setDeleteCardId(item._id);
                                }}
                              >
                                <FontAwesome
                                  name="trash-o"
                                  size={24}
                                  color="#2eb0e4"
                                />
                              </Pressable>
                            </View>
                          </View>
                        </View>
                      )}
                    />
                  </RadioButton.Group>
                </>
              ) : (
                <View style={[css.line10, css.padding10, css.borderColorLite]}>
                  <Text style={[css.cMaroon, css.f14, css.fm, css.textCenter]}>
                    You have not added any cards.
                  </Text>
                </View>
              )}
              <View style={[css.padding10]}>
                <RadioButton.Group
                  onValueChange={(newValue) => setCardRadioBtnValue(newValue)}
                  value={cardRadioBtnValue}
                >
                  <View style={[css.flexDR]}>
                    <RadioButton value="anotherCard" />
                    <TextComp style={[css.brandC, { paddingTop: 10 }]}>
                      Use another card
                    </TextComp>
                  </View>
                  <View style={[css.flexDR]}>
                    <RadioButton value="cash" />
                    <TextComp style={[css.brandC, { paddingTop: 10 }]}>
                      Cash on delivery
                    </TextComp>
                  </View>
                </RadioButton.Group>
              </View>
              {cardRadioBtnValue != "cash" && (
                <View
                  style={[
                    css.padding10,
                    css.BGliteBlue,
                    css.marginR10,
                    css.marginL10,
                    css.marginB10,
                    css.borderRadius5,
                    css.flexDC,
                  ]}
                >
                  <View style={[css.flexDR, css.spaceT20]}>
                    <Checkbox
                      style={[css.marginR5]}
                      value={showWallet}
                      onValueChange={() => setshowWallet(!showWallet)}
                      color={showWallet ? "#2eb0e4" : undefined}
                      backgroundColor={"#ffffff"}
                    />
                    <TextComp style={[css.alignSelfC]}>
                      Use Wallet amount
                    </TextComp>
                    <TextInput
                      style={[
                        css.borderGrey1,
                        css.borderRadius5,
                        css.imgFull,
                        css.fr,
                        css.padding5,
                        css.f14,
                        { height: 30, width: 90, marginLeft: 40 },
                      ]}
                      placeholder="Amount"
                      keyboardType="numeric"
                      value={WalletAmountInput}
                      onChange={(text) =>
                        setWalletAmountInput(text.nativeEvent.text)
                      }
                    />
                  </View>
                  <View>
                    <TextComp
                      style={[
                        css.fl,
                        css.f20,
                        css.padding10,
                        css.yellowC,
                        { fontWeight: "700" },
                      ]}
                    >
                      Total Balance - {walletData.totalAmount} AED
                    </TextComp>
                  </View>
                </View>
              )}
            </View>
          </View>
          <View>
            {/* {cardRadioBtnValue === 'cash' ?
                            <Pressable
                                style={[css.blueBtn, css.imgFull, css.marginT20, css.boxShadow, css.alignItemsC, css.justifyContentC, css.borderRadius30, { height: 50 }]}
                                onPress={() => cashPayment(jobId, amount)}
                            >
                                <Text style={[css.fsb, css.whiteC, css.f16]}>PAY NOW</Text>
                            </Pressable>
                            : cardRadioBtnValue === null ?
                                <Pressable
                                    style={[css.blueBtn, css.imgFull, css.marginT20, css.boxShadow, css.alignItemsC, css.justifyContentC, css.borderRadius30, { height: 50 }]}
                                    onPress={() => valueNull(jobId, cardRadioBtnValue)}
                                >
                                    <Text style={[css.fsb, css.whiteC, css.f16]}>PAY NOW</Text>
                                </Pressable>
                                :
                                cardRadioBtnValue === 'anotherCard' ?
                                    <Pressable
                                        style={[css.blueBtn, css.imgFull, css.marginT20, css.boxShadow, css.alignItemsC, css.justifyContentC, css.borderRadius30, { height: 50 }]}
                                        onPress={() => navigation.navigate('NewCard', {
                                            amount: amount, jobId: jobId
                                        })}
                                    >
                                        <Text style={[css.fsb, css.whiteC, css.f16]}>PROCEED</Text>
                                    </Pressable>
                                    :
                                    <Pressable
                                        style={[css.blueBtn, css.imgFull, css.marginT20, css.boxShadow, css.alignItemsC, css.justifyContentC, css.borderRadius30, { height: 50 }]}
                                        onPress={() => navigation.navigate('NewCard', {
                                            amount: amount, jobId: jobId, cardDetails: selectedCard
                                        })}
                                    >
                                        <Text style={[css.fsb, css.whiteC, css.f16]}>PROCEED old</Text>
                                    </Pressable>
                        } */}
            <Pressable
              style={[
                css.blueBtn,
                css.imgFull,
                css.marginT20,
                css.boxShadow,
                css.alignItemsC,
                css.justifyContentC,
                css.borderRadius30,
                { height: 50 },
              ]}
              onPress={onProceed}
            >
              <Text style={[css.fsb, css.whiteC, css.f16]}>
                {paymentBtnLabel()}
              </Text>
            </Pressable>
            {errorCard && (
              <TextComp style={[css.cMaroon, css.textCenter, css.spaceT10]}>
                {errorCard}
              </TextComp>
            )}
          </View>
        </View>
      </ScrollView>

      <Modal
        isVisible={amountPaidModal}
        animationIn="fadeIn"
        animationInTiming={700}
        animationOut="fadeOut"
        animationOutTiming={700}
        coverScreen={true}
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}
      >
        <View style={css.centeredView}>
          <View style={css.modalNewView}>
            <View style={[css.modalNewHeader]}>
              <View>
                <Text style={[css.modalNewText, css.f14, css.blackC, css.fm]}>
                  Your amount {amount} was paid.
                </Text>
              </View>
            </View>
            <View style={[css.modalNewBody, css.alignItemsC, css.paddingT0]}>
              <View
                style={[
                  css.flexDRSA,
                  css.alignItemsC,
                  css.imgFull,
                  css.alignItemsC,
                ]}
              >
                <Pressable
                  onPress={() => navigation.navigate("MyBookingPage")}
                  style={[
                    css.boxShadow,
                    css.alignItemsC,
                    css.justifyContentC,
                    css.spaceT20,
                    css.yellowBG,
                    css.borderRadius30,
                    { width: "40%", height: 40 },
                  ]}
                >
                  <Text style={[css.whiteC, css.fm, css.f14]}>Got it</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {deleteCardId && (
        <YesOrNoModalGeneric
          isVisible={deleteCardId}
          onClose={() => setDeleteCardId(null)}
          onYes={() => {
            deleteCard(deleteCardId);
          }}
          title={"Note"}
          message={"Are you sure you want to delete this card?"}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FAFBFF",
  },
  pressed: { opacity: 0.5 },
  header: {
    width: "100%",
    height: 70,
    padding: 20,
    backgroundColor: "#2eb0e4",
    justifyContent: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 10,
    shadowColor: "#000",
  },
  buttonContainer: { flexDirection: "row", alignItems: "center" },
  headerTitle: {
    color: "#fff",
    ...css.f20,
    fontFamily: "PoppinsSB",
    textTransform: "uppercase",
  },
  backButton: {
    marginRight: 10,
  },
});

export default connect(
  (state) => ({
    currentBookings: state.bookings.currentBookings,
    pastBookings: state.bookings.pastBookings,
    token: state.auth.token,
  }),
  null
)(PaymentScreen);
