import React, { Component, useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
  FlatList,
  Dimensions,
  RefreshControl,
} from "react-native";
import Modal from "react-native-modal";
import { RadioButton } from 'react-native-paper';
import { useDispatch, useSelector } from "react-redux";
import { getAccessToken } from "../../reducers/authReducer";
import { AntDesign, Feather } from '@expo/vector-icons';
import css from "../../components/commonCss";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { BASE_URL } from "../../base_file";
import { hideLoading, showLoading } from "../../reducers/appReducer";
import { getAllMyCardData, getAllMyCard, deleteSavedCards } from "../../reducers/paymentReducer";
let imgPath = "../../assets/icons/";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function SettingAddCardScreen({ navigation }) {
  const [isLoading, setLoading] = useState(true);
  const [radioValue, setRadioValue] = useState(null);
  console.log('radioValue [select radio button]', radioValue);
  const [addcardModal, setAddcardModal] = useState(false);
  const toggleAddcreditModal = () => {
    setAddcardModal(!addcardModal);
  };
  const [deleteCard, setDeleteCard] = useState(null);
  const [removecardModal, setRemovecardModal] = useState(false);
  const toggleRemovecreditModal = () => {
    setRemovecardModal(!removecardModal);
  };
  const allCardData = useSelector(getAllMyCardData);
  const dispatch = useDispatch();
  const token = useSelector(getAccessToken);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    if (token) {
      await setRefreshing(true);
      await dispatch(showLoading())
      await dispatch(getAllMyCard())
      await dispatch(hideLoading())
      await setRefreshing(false);
    } else {
      navigation.navigate('HomePage');
    }
  }, []);
  useEffect(async () => {
    if (token) {
      await dispatch(showLoading())
      await dispatch(getAllMyCard())
      await dispatch(hideLoading())
    } else {
      navigation.navigate('HomePage');
    }
  }, []);

  const handleOpenNewCard = () => {
    setAddcardModal(!addcardModal);
    navigation.navigate("NewCard", {
      amount: 1,
    });
  };
  const handleDeleteCard = async (deleteCard) => {
    setRemovecardModal(!removecardModal);
    const params = {
      cardId: deleteCard
    };
    const isUpdated = await dispatch(deleteSavedCards(params));
    if (isUpdated) {
      onRefresh();
    } else {
      navigation.navigate('AccountPage')
    }

  }
  return (
    <View>
      <View style={css.header}>
        <View style={css.flexDR}>
          <TouchableOpacity
            style={[css.whiteC, css.backButton]}
            onPress={() => navigation.goBack()}
          >
            <AntDesign style={[styles.backButton]} name="arrowleft" size={wp('4.85%')} color="white" />
          </TouchableOpacity>
          <View style={[css.flexDR_ALC]}>
            <Feather name="credit-card" size={wp('6%')} color="white" />
            <Text style={[css.headerTitle, css.marginL10, css.f24]}>
              ADD CARD
            </Text>
          </View>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={<RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />}
      >
        {allCardData.length == 0 ? (
          <View style={[css.section]}>
            <View style={[css.container, { height: windowHeight - 100 }]}>
              <View style={[css.flexDCSB, css.alignItemsC, { flex: 1 }]}>
                <View>
                  <Text style={[css.f24, css.textCenter, css.blackC]}>
                    ADD CARD
                  </Text>
                </View>
                <View style={[css.imgBR150, css.whiteBG, css.alignCenter]}>
                  <Image
                    style={[css.img100]}
                    source={require(imgPath + "iconAddCard.png")}
                  />
                </View>
                <TouchableOpacity
                  style={[
                    css.blueBtn,
                    css.boxShadow,
                    css.imgFull,
                    { height: 50 },
                  ]}
                  onPress={() => setAddcardModal(true)}
                >
                  <Text style={[css.whiteC, css.f18, css.textCenter, css.fsb]}>
                    + ADD CARD
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View style={[css.section]}>
            <View style={[css.container]}>
              <View
                style={{
                  borderRadius: 5,
                  borderColor: "#ccc",
                  borderWidth: 1,
                  padding: 10,
                  backgroundColor: "#F2F4F8",
                }}
              >
                <Text
                  style={[
                    css.f24,
                    css.fm,
                    css.marginT10,
                    css.marginB10,
                    css.blackC,
                  ]}
                >
                  ADD / REMOVE YOUR CARDS
                </Text>
                <View
                  style={[
                    css.whiteBG,
                    css.borderGrey1,
                    css.borderRadius5,
                    css.marginB10,
                  ]}
                >
                  <Text
                    style={[
                      css.line5,
                      css.brandC,
                      css.f18,
                      css.fm,
                      css.padding20,
                    ]}
                  >
                    Select card to pay with
                  </Text>
                  <FlatList
                    data={allCardData}
                    keyExtractor={(item, index) => {
                      return item._id;
                    }}
                    renderItem={({ item }) => (
                      <View>
                        <RadioButton.Group onValueChange={newValue => setRadioValue(newValue)} value={radioValue}>
                          <View style={[css.flexDRSB, css.padding20, css.line10, css.imgFull]}>
                            <View style={{ width: 'auto' }}><RadioButton value={item._id} /></View>
                            <View style={[css.width70]}><Text style={[styles.rbtextStyle]}>
                              {item.Digit ? item.Digit : ""}
                            </Text></View>
                            <Pressable style={[css.width10]} onPress={() => { setDeleteCard(item._id), setRemovecardModal(true) }}>
                              <Feather name="trash" size={wp('4.5%')} color="#2eb0e4" />
                            </Pressable>
                          </View>
                        </RadioButton.Group>
                      </View>
                    )}
                  />
                </View>
              </View>
              <View style={[css.flexDCSB, css.alignItemsC]}>
                <TouchableOpacity
                  style={[
                    css.blueBtn,
                    css.boxShadow,
                    css.imgFull,
                    css.marginT20,
                    { height: 50 },
                  ]}
                  onPress={() => setAddcardModal(true)}
                >
                  <Text style={[css.whiteC, css.f18, css.textCenter, css.fsb]}>
                    + ADD CARD
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      <Modal
        isVisible={addcardModal}
        animationIn="flipInX"
        animationInTiming={700}
        animationOut="flipOutX"
        animationOutTiming={700}
        coverScreen={true}
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}
      >
        <View style={css.centeredView}>
          <View style={css.modalNewView}>
            <View style={[css.modalNewHeader]}>
              <View>
                <Text
                  style={[
                    css.modalNewText,
                    {
                      ...css.f18,
                      color: "#525252",
                      lineHeight: 26,
                      letterSpacing: 0.5,
                    },
                  ]}
                >
                  To <Text style={[css.brandC]}>ADD CARD</Text>, a security{" "}
                  {"\n"} payment of AED 1.00 will be {"\n"} processed to ensure
                  the card is {"\n"} verified.
                </Text>
              </View>
            </View>
            <View
              style={[css.modalNewBody, css.alignItemsC, css.justifyContentC]}
            >
              <View>
                <Text
                  style={[
                    css.modalNewText,
                    {
                      ...css.f18,
                      color: "#525252",
                      lineHeight: 26,
                      letterSpacing: 0.5,
                    },
                  ]}
                >
                  Should we proceed?
                </Text>
              </View>
              <View style={[css.flexDRSE, css.imgFull]}>
                <TouchableOpacity
                  onPress={() => handleOpenNewCard()}
                  style={[
                    css.boxShadow,
                    css.alignItemsC,
                    css.justifyContentC,
                    css.spaceT20,
                    {
                      backgroundColor: "#f4f4f4",
                      width: "40%",
                      height: 50,
                      borderRadius: 10,
                    },
                  ]}
                >
                  <Text style={[css.blackC, css.fsb, css.f18]}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setAddcardModal(!addcardModal)}
                  style={[
                    css.boxShadow,
                    css.alignItemsC,
                    css.justifyContentC,
                    css.spaceT20,
                    {
                      backgroundColor: "#f6b700",
                      width: "40%",
                      height: 50,
                      borderRadius: 10,
                    },
                  ]}
                >
                  <Text style={[css.whiteC, css.fsb, css.f18]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={removecardModal}
        animationIn="flipInX"
        animationInTiming={700}
        animationOut="flipOutX"
        animationOutTiming={700}
        coverScreen={true}
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}
      >
        <View style={css.centeredView}>
          <View style={css.modalNewView}>
            <View style={[css.modalNewHeader]}>
              <View>
                <Text
                  style={[
                    css.modalNewText,
                    {
                      ...css.f20,
                      color: "#525252",
                      lineHeight: 26,
                      letterSpacing: 0.2,
                      fontFamily: "PoppinsM",
                    },
                  ]}
                >
                  Are you sure you want to delete the card?
                </Text>
              </View>
            </View>
            <View
              style={[css.modalNewBody, css.alignItemsC, css.justifyContentC]}
            >
              <View style={[css.flexDRSE, css.imgFull]}>
                <TouchableOpacity
                  onPress={() => setRemovecardModal(!removecardModal)}
                  style={[
                    css.boxShadow,
                    css.alignItemsC,
                    css.justifyContentC,
                    css.spaceT20,
                    {
                      backgroundColor: "#f4f4f4",
                      width: "40%",
                      height: 50,
                      borderRadius: 10,
                    },
                  ]}
                >
                  <Text style={[css.blackC, css.fsb, css.f18]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteCard(deleteCard)}
                  style={[
                    css.boxShadow,
                    css.alignItemsC,
                    css.justifyContentC,
                    css.spaceT20,
                    {
                      backgroundColor: "#f6b700",
                      width: "40%",
                      height: 50,
                      borderRadius: 10,
                    },
                  ]}
                >
                  <Text style={[css.whiteC, css.fsb, css.f18]}>
                    Yes, I'm sure
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

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
    ...css.f18,
    color: "#525252",
    fontFamily: "PoppinsSB",
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
});
