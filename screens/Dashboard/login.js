import { View, StyleSheet, Image, ScrollView, Pressable, RefreshControl } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import Modal from "react-native-modal";
import Whatsapp from "../../components/whtsApp";
import Text from "../../components/MyText";
import SocialMedia from "../../components/socialMedia";
import LoginModal from "../../components/LoginModal";
import css from "../../components/commonCss";
import {
  getLoggedInStatus,
  getUser,
  logout,
  verifyOTP,
  login,
} from "../../reducers/authReducer";
import HeaderTitle from "../../components/ui/HeaderTitle";
import ModalComingSoon from "../../components/Modals/ModalComingSoon";
import { getWallet, getWalletTransaction } from "../../reducers/walletReducer";
import { hideLoading, showLoading } from "../../reducers/appReducer";
import { getNotificationData, getNotifications } from "../../reducers/notificationReducer";
import TextComp from "../../components/TextComp";
import { useNavigation } from "@react-navigation/native";
let imgPath = "../../assets/icons/";

export default function Login(props) {
  const navigation = useNavigation()
  const isLoggedIn = useSelector(getLoggedInStatus);
  const userData = useSelector(getUser);
  const [isModalComponentVisible, setIsModalComponentVisible] = useState(false);
  const dispatch = useDispatch();
  const [user, setUser] = useState(isLoggedIn);
  const [displayName, setDisplayName] = useState(
    userData ? userData.name : null
  );
  const [displayEmail, setDisplayEmail] = useState(
    userData ? userData.email : null
  );
  const [displayProfilePic, setDisplayProfilePic] = useState(
    userData ? userData.profilePicURL : ""
  );
  const [token, setToken] = useState(null);
  const [dispalyPhone, setDisplayPhone] = useState(null);
  const [loginModal, setLoginModal] = useState(false);
  const [addcardModal, setAddcardModal] = useState(false);
  const notificationData = (useSelector(getNotificationData))
  // const [notificationData, setNotificationData] = useState(null)
  let notificationLength = notificationData.length;
  console.log('notificationData [account screen]', notificationLength);
  if (notificationLength > 99) {
    notificationLength = '99+'
  }
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    if (user) {
      await dispatch(showLoading())
      setUser(isLoggedIn);
      //load wallet data form backend
      await dispatch(getWallet());
      await dispatch(getWalletTransaction());
      await dispatch(getNotifications())
      await dispatch(hideLoading())
    } else {
      navigation.navigate('HomePage');
    }
  }, [isLoggedIn]);
  const handleLogout = async () => {
    await dispatch(logout());
    setUser(false);
    toggleAddcardModal();
  };
  useEffect(async () => {
    await dispatch(showLoading())
    setUser(isLoggedIn);
    //load wallet data form backend
    await dispatch(getWallet());
    await dispatch(getWalletTransaction());
    await dispatch(getNotifications())
    await dispatch(hideLoading())
  }, [isLoggedIn]);
  const toggleAddcardModal = () => {
    setAddcardModal(!addcardModal);
  };
  return (
    <View style={[styles.screen]}>
      <HeaderTitle title="my accounts" />
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={<RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />}
      >
        {user ? (
          <View>
            <View style={[css.liteBlueBG]}>
              <View style={[css.flexDRSB, { padding: 15, paddingTop: 5, paddingBottom: 5 }]} >
                <View style={[css.flexDR]}>
                  <View>
                    {userData.profilePicURL ? (
                      <Image
                        resizeMode="cover"
                        style={[
                          {
                            borderRadius: 500,
                            width: 60,
                            height: 60,
                            marginRight: 15,
                          },
                        ]}
                        source={{ uri: userData.profilePicURL }}
                      />
                    ) : (
                      <Image
                        resizeMode="contain"
                        style={[
                          css.img50,
                          { borderRadius: 50, marginRight: 15 },
                        ]}
                        source={require(imgPath + "guest-icon.png")}
                      />
                    )}
                  </View>
                  <View style={[css.flexDC, css.alignSelfC]}>
                    <Text style={[css.fbo, css.f16, css.blackC]}>
                      {userData ? userData.name : ""}
                    </Text>
                    <Text style={[css.fm, css.f12, css.blackC]}>
                      {userData ? userData.email : ""}
                    </Text>
                  </View>
                </View>
                <Pressable
                  style={[css.alignSelfC, { borderColor: '#2eb0e4', borderWidth: 2, borderRadius: 100, padding: 5, marginRight: 10 }]}
                  onPress={() => props.navigation.navigate("NotificationPage")}
                //  onPress={() => setIsModalComponentVisible(true)}
                >
                  <MaterialIcons
                    name="notifications-none"
                    size={24}
                    color="#2eb0e4"
                  />
                  <View style={[css.BGmaroon, { position: 'absolute', top: -10, right: -10, borderRadius: 100, padding: 5, alignItems: 'center', justifyContent: 'center', width: 30, height: 30 }]}>
                    <Text style={[css.whiteC, css.f9, css.fr]}>{notificationLength}</Text>
                  </View>
                </Pressable>
              </View>
            </View>
            <View style={[styles.section]}>
              <View style={[styles.container]}>
                <Pressable
                  style={[css.flexDR, css.line10, styles.accountLinks]}
                  onPress={() =>
                    props.navigation.navigate("Bookings", {
                      paramKey: token,
                    })
                  }
                >
                  <Image
                    style={[css.marginR10, css.img20]}
                    source={require(imgPath + "booking-history.png")}
                  />
                  <Text style={[css.text]}>Bookings</Text>
                </Pressable>
                <Pressable
                  style={[css.flexDR, css.line10, styles.accountLinks]}
                  onPress={() => props.navigation.navigate("Offers")}
                >
                  <Image
                    style={[css.marginR10, css.img20]}
                    source={require(imgPath + "offer-icon.png")}
                  />
                  <Text style={[css.text]}>Offers</Text>
                </Pressable>
                <Pressable
                  style={[css.flexDR, css.line10, styles.accountLinks]}
                  onPress={() => props.navigation.navigate("WalletPage")}
                //onPress={() => props.navigation.navigate('PaymentStatus')}
                >
                  <Image
                    style={[css.marginR10, css.img20]}
                    source={require(imgPath + "wallet.png")}
                  />
                  <Text style={[css.text]}>Wallet</Text>
                </Pressable>
                <Pressable
                  style={[css.flexDR, css.line10, styles.accountLinks]}
                  onPress={() => props.navigation.navigate("SettingPage")}
                >
                  <Image
                    style={[css.marginR10, css.img20]}
                    source={require(imgPath + "settings.png")}
                  />
                  <Text style={[css.text]}>Settings</Text>
                </Pressable>
                <Pressable
                  style={[css.flexDR, css.line10, styles.accountLinks]}
                  onPress={() => props.navigation.navigate("SupportPage")}
                >
                  <Image
                    style={[css.marginR10, css.img20]}
                    source={require(imgPath + "Support.png")}
                  />
                  <Text style={[css.text]}>Support</Text>
                </Pressable>
                <Pressable
                  style={[css.flexDR, css.line10, styles.accountLinks]}
                  onPress={() => toggleAddcardModal()}
                //onPress={() => setUser(false)}
                >
                  <Image
                    style={[css.marginR10, css.img20]}
                    source={require(imgPath + "logout.png")}
                  />
                  <Text style={[css.text, css.brandC, css.fsb]}>SIGNOUT</Text>
                </Pressable>
              </View>
            </View>
            <SocialMedia />
          </View>
        ) : (
          <View>
            <View style={[css.liteBlueBG]}>
              <View
                style={[
                  css.flexDRSB,
                  { padding: 15, paddingTop: 10, paddingBottom: 10 },
                ]}
              >
                <View style={[css.flexDRSB, css.imgFull]}>
                  <View style={[css.flexDR]}>
                    <View>
                      <Image
                        resizeMode="contain"
                        style={[
                          css.img50,
                          { borderRadius: 50, marginRight: 15 },
                        ]}
                        source={require(imgPath + "guest-icon.png")}
                      />
                    </View>
                    <Text
                      style={[css.fbo, css.f18, css.blackC, css.alignSelfC]}
                    >
                      Guest
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.section]}>
              <View style={[styles.container]}>
                <Pressable
                  style={[css.flexDR, css.line, styles.accountLinks]}
                  onPress={() => props.navigation.navigate("SupportPage")}
                >
                  <Image
                    style={[css.marginR10, css.img20]}
                    source={require(imgPath + "Support.png")}
                  />
                  <Text style={[css.text]}>Support</Text>
                </Pressable>
                <Pressable
                  style={[css.flexDR, css.line10, styles.accountLinks]}
                  onPress={() => setLoginModal(true)}
                >
                  <Image
                    style={{
                      marginRight: 10,
                      width: 18,
                      height: 18,
                      resizeMode: "contain",
                    }}
                    source={require(imgPath + "signin.png")}
                  />
                  <Text style={[css.text]}>Login/Signup</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
        <View>
          <View style={[styles.section]}>
            <Whatsapp />
            <View style={[css.marginT5]}>
              <Text style={[css.f12, css.fsb, css.grayC]}>
                VERSION 1.8.6 Copyright HomeGenie
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={css.centeredView}>
        {loginModal && (
          <LoginModal
            changeData={loginModal}
            falseData={(data) => setLoginModal(data)}
            getEmail={(e) => setDisplayEmail(e)}
            getName={(e) => setDisplayName(e)}
            getPhone={(e) => setDisplayPhone(e)}
            getToken={(e) => setToken(e)}
            userData={(data) => setUser(data)}
          />
        )}
      </View>
      <Modal
        isVisible={addcardModal}
        //animationIn='fadeInLeft'
        animationInTiming={700}
        //animationOut='fadeOutRight'
        animationOutTiming={700}
        avoidKeyboard={true}
        // backdropTransitionInTiming={700}
        // backdropTransitionOutTiming={700}
        coverScreen={true}
        useNativeDriver={true}
      //hideModalContentWhileAnimating={true}
      >
        <View style={css.centeredView}>
          <View style={css.modalNewView}>
            <View style={[css.modalNewHeader]}>
              <View>
                <Text
                  style={[
                    css.modalNewText,
                    { ...css.f18, color: "#525252", fontFamily: "PoppinsSB" },
                  ]}
                >
                  Logout
                </Text>
              </View>
            </View>
            <View
              style={[css.modalNewBody, css.alignItemsC, css.justifyContentC]}
            >
              <View>
                <Text>Are you sure you want to Logout?</Text>
              </View>
              <View style={[css.flexDRSE, css.imgFull]}>
                <Pressable
                  onPress={() => {
                    handleLogout();
                  }}
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
                  <Text style={[css.blackC, css.fsb, css.f16]}>Yes</Text>
                </Pressable>
                <Pressable
                  onPress={() => toggleAddcardModal()}
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
                  <Text style={[css.whiteC, css.fsb, css.f16]}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <ModalComingSoon
        isVisible={isModalComponentVisible}
        onClose={() => setIsModalComponentVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },
  section: {
    padding: 20,
  },
  container: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  accountLinks: {
    borderBottomColor: "#C9C9C920",
    paddingTop: 10,
    paddingBottom: 15,
    marginBottom: 5,
  },
});
