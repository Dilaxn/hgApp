import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  Pressable,
  Alert,
  FlatList,
  RefreshControl,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import { TabView, TabBar } from "react-native-tab-view";
import axios from "axios";
import Text from "../components/MyText";
import Modal from "react-native-modal";
import LoginModal from "../components/LoginModal";
import ReviewGenieModal from "../components/Modals/ReviewGenieModal";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import css from "../components/commonCss";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentBookings,
  getPastBookings,
  loadBookings,
  getPendingRating,
  updateInspection,
} from "../reducers/myBookingsReducer";
import { addRating } from "../reducers/jobDetailReducer";
import {
  getLoggedInStatus,
  getUser,
  getAccessToken,
} from "../reducers/authReducer";
import { BASE_URL } from "../base_file";
import HeaderTitle from "../components/ui/HeaderTitle";
import MyBookingSearch from "../components/MyBookings/MyBookingSearch";
import StartBooking from "../components/MyBookings/StartBooking";
import { hideLoading, showLoading } from "../reducers/appReducer";
let imgPath = "../assets/icons/";

export default function MyBookingScreen({ props, navigation }) {
  const currentBookings = useSelector(getCurrentBookings);
  const pastBookings = useSelector(getPastBookings);
  const token = useSelector(getAccessToken);
  const [userName, setUserName] = useState(token);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const [userData, setUserData] = useState();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "1", title: "Current Bookings" },
    { key: "2", title: "Past Bookings" },
  ]);
  const isFocused = useIsFocused();
  const [filteredBookings, setFilteredBookings] = useState(null);
  const [isLoginRequestModal, setIsLoginRequestModal] = useState(false);

  const [pendingReview, setPendingReview] = useState([]);
  const [displayReview, setDisplayReview] = useState(false);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    if (token) {
      setRefreshing(true);
      await dispatch(showLoading());
      await dispatch(loadBookings());
      setRefreshing(false);
      await dispatch(hideLoading());
    } else {
      setIsLoginRequestModal(true);
      console.log("no tokenREfresh");
    }
  }, []);

  const handleLoginBack = React.useCallback(() => {
    console.log("Hello");
    navigation.navigate("HomePage");
  }, []);

  const filter = (searchText) => {
    const bookings = index === 1 ? pastBookings : currentBookings;
    if (bookings.length) {
      const filteredItems = bookings.filter((item) => {
        const searchString = `${item.subcategory.subCategoryName} ${item.uniqueCode} ${item.status} ${item.dateScheduled}`;

        var regex = new RegExp(searchText, "gi");
        return searchString.trim().match(regex) !== null;
      });
      setFilteredBookings(filteredItems);
      return;
    }
    setFilteredBookings(null);
  };

  useEffect(() => {
    setFilteredBookings(null);
  }, [index]);

  const inspectionAcceptReject = async (status, jobId) => {
    const params = {
      jobId: jobId,
      status: status,
    };
    const isUpdated = await axios.put(
      `${BASE_URL}customer/acceptOrRejectedJobOnce/`,
      params,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (isUpdated) {
      navigation.navigate("MyBookingPage", refresh());
    } else {
      Alert.alert("Error", "Please try again later");
    }
  };
  const [advancePaynowModal, setadvancePaynowModal] = useState(false);
  const toggleadvancePaynowModal = () => {
    setadvancePaynowModal(!advancePaynowModal);
  };
  const [advanceJobId, setadvanceJobId] = useState(null);
  const [advanceAmount, setadvanceAmount] = useState(null);

  useFocusEffect(
    useCallback(() => {
      if (token) {
        async function fetchData() {
          console.log("calling apis");
          await dispatch(showLoading());
          const dataBookings = await dispatch(loadBookings(token));
          const pendingReview = await dispatch(getPendingRating(token));
          await dispatch(hideLoading());

          console.log("pendingReview", pendingReview);

          setPendingReview(pendingReview?.length > 0 ? pendingReview[0] : []);
          setDisplayReview(pendingReview?.length > 0);
        }
        console.log("useFocusEffect loadBookings");

        fetchData();
      } else {
        setIsLoginRequestModal(true);
        console.log("no token");
      }
    }, [isFocused])
  );

  const getPendingReview = async () => {
    await dispatch(showLoading());
    const pendingReview = await dispatch(getPendingRating(token));
    await dispatch(hideLoading());

    setPendingReview(pendingReview);

    setDisplayReview(pendingReview?.length > 0);
  };

  const updateRating = async (params) => {
    //console.log("updateRating", params)
    setDisplayReview(false);

    // update review
    const isUpdated = await dispatch(addRating(token, params));

    if (isUpdated) {
      navigation.navigate("MyBookingPage");
    } else {
      navigation.navigate("HomePage");
    }
    getPendingReview();
  };

  const refresh = async () => {
    if (token) {
      console.log("useFocusEffect loadBookings");
      await dispatch(showLoading());
      await dispatch(loadBookings(token));
      await dispatch(hideLoading());
    } else {
      console.log("no tokenBookings");
    }
  };
  const renderScene = ({ route }) => {
    switch (route.key) {
      case "1":
        return (
          <View style={[styles.screen, styles.bookingTabs]}>
            {!!currentBookings && currentBookings.length > 0 ? (
              <View style={css.container}>
                <MyBookingSearch onChangeText={(text) => filter(text)} />
                <FlatList
                  data={
                    filteredBookings !== null
                      ? filteredBookings
                      : currentBookings
                  }
                  keyExtractor={(item) => item._id}
                  style={{ marginBottom: 50 }}
                  renderItem={({ item }) => (
                    <View>
                      <View style={[styles.screen4box, css.boxShadow]}>
                        <View
                          style={[
                            styles.bookingHead,
                            css.line10,
                            css.padding10,
                          ]}
                        >
                          <View style={[css.flexDR]}>
                            <Image
                              style={[css.img30, css.marginR10]}
                              source={{ uri: item.category.imageURL.thumbnail }}
                            />
                            <Text style={[css.f16, css.blackC, css.fsb]}>
                              {item.category.name}
                            </Text>
                          </View>
                        </View>
                        <View style={[styles.bookingBody, css.padding10]}>
                          <View style={[css.flexDR]}>
                            <Text
                              style={[
                                css.width25,
                                css.f14,
                                css.liteBlackC,
                                css.fm,
                              ]}
                            >
                              Job ID
                            </Text>
                            <Text
                              style={[
                                css.width75,
                                css.f14,
                                css.blackC,
                                css.fbo,
                              ]}
                            >
                              {item.uniqueCode}
                            </Text>
                          </View>
                          <View style={[css.flexDR]}>
                            <Text
                              style={[
                                css.width25,
                                css.f12,
                                css.liteBlackC,
                                css.fr,
                              ]}
                            >
                              Service
                            </Text>
                            <Text
                              style={[css.width75, css.f12, css.blackC, css.fm]}
                            >
                              {item.subcategory.subCategoryName}
                            </Text>
                          </View>
                          <View style={[css.flexDR]}>
                            <Text
                              style={[
                                css.width25,
                                css.f12,
                                css.liteBlackC,
                                css.fr,
                              ]}
                            >
                              Location
                            </Text>
                            <Text
                              style={[css.width75, css.f12, css.blackC, css.fm]}
                            >
                              {item.nickName}
                            </Text>
                          </View>
                          <View style={[css.flexDR]}>
                            <Text
                              style={[
                                css.width25,
                                css.f12,
                                css.liteBlackC,
                                css.fr,
                              ]}
                            >
                              Status
                            </Text>
                            <View style={[css.flexDR]}>
                              <Text
                                style={[
                                  css.imgFull,
                                  css.f12,
                                  css.blackC,
                                  css.fm,
                                  css.alignSelfC,
                                ]}
                              >
                                {item.status}
                                {"  "}
                                <Text style={[css.brandC, css.f10, css.fr]}>
                                  {item.showAction}
                                </Text>
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View
                          style={[
                            styles.bookingFooter,
                            css.padding10,
                            css.liteGreyBG,
                          ]}
                        >
                          <View
                            style={[css.flexDR, { justifyContent: "flex-end" }]}
                          >
                            {item.status == "PAYMENT_PENDING" &&
                              item.payment.payment_type == "null" && (
                                <Pressable
                                  style={[
                                    css.maroonBG,
                                    css.cButtonWH,
                                    css.borderRadius5,
                                    css.marginR10,
                                    { width: wp("20%"), height: wp("10%") },
                                  ]}
                                  onPress={() =>
                                    navigation.navigate("JobdetailPage", {
                                      token: token,
                                      jobId: item._id,
                                      bookingStatus: "ongoing",
                                    })
                                  }
                                >
                                  <Text style={[css.whiteC, css.f12, css.fm]}>
                                    Pay Now
                                  </Text>
                                </Pressable>
                              )}
                            {item.status == "REJECTED" &&
                              item.payment.payment_type == "null" && (
                                <Pressable
                                  style={[
                                    css.maroonBG,
                                    css.cButtonWH,
                                    css.borderRadius5,
                                    css.marginR10,
                                    { width: wp("20%"), height: wp("10%") },
                                  ]}
                                  onPress={() =>
                                    navigation.navigate("JobdetailPage", {
                                      token: token,
                                      jobId: item._id,
                                    })
                                  }
                                >
                                  <Text style={[css.whiteC, css.f12, css.fm]}>
                                    Pay Now
                                  </Text>
                                </Pressable>
                              )}
                            {item.status == "INSPECTION" && item.accept && (
                              <Pressable
                                style={[
                                  css.maroonBG,
                                  css.cButtonWH,
                                  css.borderRadius5,
                                  css.marginR10,
                                  { width: wp("20%"), height: wp("10%") },
                                ]}
                                onPress={() => {
                                  item.charges.advanceCharges > 0
                                    ? (setadvanceJobId(item._id),
                                      setadvanceAmount(
                                        item.charges.advanceCharges
                                      ),
                                      toggleadvancePaynowModal())
                                    : inspectionAcceptReject(
                                      "APPROVE",
                                      item._id
                                    );
                                }}
                              >
                                <Text style={[css.whiteC, css.f12, css.fm]}>
                                  Accept
                                </Text>
                              </Pressable>
                            )}
                            {item.status == "RATING" && (
                              <Pressable
                                style={[
                                  css.maroonBG,
                                  css.cButtonWH,
                                  css.borderRadius5,
                                  css.marginR10,
                                  { width: wp("20%"), height: wp("10%") },
                                ]}
                                onPress={() =>
                                  navigation.navigate("JobdetailPage", {
                                    token: token,
                                    jobId: item._id,
                                  })
                                }
                              >
                                <Text style={[css.whiteC, css.f12, css.fm]}>
                                  Rate
                                </Text>
                              </Pressable>
                            )}
                            <Pressable
                              style={[
                                css.whiteBG,
                                css.cButtonWH,
                                {
                                  borderWidth: 1,
                                  borderColor: "#2eb0e4",
                                  width: wp("22%"),
                                  height: wp("10%"),
                                },
                              ]}
                              onPress={() =>
                                navigation.navigate("JobdetailPage", {
                                  token: token,
                                  jobId: item._id,
                                  bookingStatus: "ongoing",
                                })
                              }
                            >
                              <Text style={[css.brandC, css.f12, css.fm]}>
                                View Details
                              </Text>
                            </Pressable>
                          </View>
                        </View>
                      </View>
                    </View>
                  )}
                />
              </View>
            ) : (
              <>
                <StartBooking />
              </>
            )}
          </View>
        );
      case "2":
        return (
          <View style={[styles.screen, styles.bookingTabs]}>
            {!!pastBookings && pastBookings.length > 0 ? (
              <View style={[css.container]}>
                <MyBookingSearch onChangeText={(text) => filter(text)} />
                <FlatList
                  data={
                    filteredBookings !== null ? filteredBookings : pastBookings
                  }
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <View style={[styles.screen4box, css.boxShadow]}>
                      <View
                        style={[styles.bookingHead, css.line10, css.padding10]}
                      >
                        <View style={[css.flexDR]}>
                          <Image
                            style={[css.img30, css.marginR10]}
                            source={{ uri: item.category.imageURL.thumbnail }}
                          />
                          <Text style={[css.f16, css.blackC, css.fsb]}>
                            {item.category.name}
                          </Text>
                        </View>
                      </View>
                      <View style={[styles.bookingBody, css.padding10]}>
                        <View style={[css.flexDR]}>
                          <Text
                            style={[
                              css.width25,
                              css.f14,
                              css.liteBlackC,
                              css.fr,
                            ]}
                          >
                            Job ID
                          </Text>
                          <Text
                            style={[css.width75, css.f14, css.blackC, css.fbo]}
                          >
                            {item.uniqueCode}
                          </Text>
                        </View>
                        <View style={[css.flexDR]}>
                          <Text
                            style={[
                              css.width25,
                              css.f12,
                              css.liteBlackC,
                              css.fr,
                            ]}
                          >
                            Service
                          </Text>
                          <Text
                            style={[css.width75, css.f12, css.blackC, css.fm]}
                          >
                            {item.subcategory.subCategoryName}
                          </Text>
                        </View>
                        <View style={[css.flexDR]}>
                          <Text
                            style={[
                              css.width25,
                              css.f12,
                              css.liteBlackC,
                              css.fr,
                            ]}
                          >
                            Location
                          </Text>
                          <Text
                            style={[css.width75, css.f12, css.blackC, css.fm]}
                          >
                            {item.nickName}
                          </Text>
                        </View>
                        <View style={[css.flexDR]}>
                          <Text
                            style={[
                              css.width25,
                              css.f12,
                              css.liteBlackC,
                              css.fr,
                            ]}
                          >
                            Status
                          </Text>
                          <Text
                            style={[css.width75, css.f12, css.blackC, css.fm]}
                          >
                            {item.status}{" "}
                            <Text style={[css.brandC, css.f10, css.fr]}>
                              {item.showAction}
                            </Text>
                          </Text>
                        </View>
                      </View>
                      <View
                        style={[
                          styles.bookingFooter,
                          css.padding10,
                          css.liteGreyBG,
                        ]}
                      >
                        <View
                          style={[css.flexDR, { justifyContent: "flex-end" }]}
                        >
                          <Pressable
                            style={[
                              css.whiteBG,
                              css.cButtonWH,
                              {
                                borderWidth: 1,
                                borderColor: "#2eb0e4",
                                width: wp("22%"),
                                height: wp("10%"),
                              },
                            ]}
                            onPress={() =>
                              navigation.navigate("JobdetailPage", {
                                token: token,
                                jobId: item._id,
                                bookingStatus: "past",
                              })
                            }
                          >
                            <Text style={[css.brandC, css.f12, css.fm]}>
                              View Details
                            </Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  )}
                />
              </View>
            ) : (
              <StartBooking />
            )}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.screen]}>
      <HeaderTitle title="Bookings" />
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              renderLabel={({ route, color }) => (
                <Text style={[css.fm, css.f14, css.blackC, color]}>
                  {route.title}
                </Text>
              )}
              activeColor={[styles.tabActiveColor]}
              indicatorStyle={[styles.tabIndicatorStyle]}
              style={styles.tabStyle}
            />
          )}
          onIndexChange={(index) => setIndex(index)}
          style={[styles.container, css.marginT20]}
        />
      </ScrollView>
      <Modal
        isVisible={advancePaynowModal}
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
              <Pressable
                style={[css.flexDR, css.padding0, css.marginB10]}
                onPress={() => toggleadvancePaynowModal()}
              >
                <Image
                  style={[css.alignSelfC, css.marginR10]}
                  source={require(imgPath + "backArrowBlack.png")}
                />
                <Text style={[css.fm, css.f16, css.greyC]}>Back</Text>
              </Pressable>
              <View>
                <Text style={[css.modalNewText, css.f14, css.blackC, css.fm]}>
                  Kindly pay Advance payment of{" "}
                  {advanceAmount ? advanceAmount : ""} AED in advance to
                  continue the job service.
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
                  onPress={() =>
                    navigation.navigate("PaymentPage", {
                      jobId: advanceJobId,
                      amount: advanceAmount,
                    })
                  }
                  style={[
                    css.boxShadow,
                    css.alignItemsC,
                    css.justifyContentC,
                    css.spaceT20,
                    css.borderRadius10,
                    css.yellowBG,
                    { width: "40%", height: 40 },
                  ]}
                >
                  <Text style={[css.whiteC, css.fm, css.f12, css.textCenter]}>
                    Pay Now
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {displayReview && (
        <ReviewGenieModal
          updateRating={updateRating}
          appointmentID={pendingReview?.appointmentID}
          uniqueCode={pendingReview?.uniqueCode}
          driverID={pendingReview?.driverID}
          categoryID={pendingReview?.categoryID}
          subcategoryID={pendingReview?.subcategoryID}
        />
      )}

      {isLoginRequestModal && (
        <LoginModal
          changeData={true}
          falseData={handleLoginBack}
          userData={() => { }}
          noLogin={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FAFBFF" },
  section: { padding: 20 },
  container: { paddingLeft: 10, paddingRight: 10 },
  tabActiveColor: { color: "#2eb0e4", fontFamily: "PoppinsM" },
  tabIndicatorStyle: { backgroundColor: "rgba(46,176,228,.2)", height: 4 },
  tabStyle: {
    backgroundColor: "transparent",
    width: "90%",
    alignSelf: "center",
  },
  screen4box: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "96%",
    marginRight: "2%",
    marginLeft: "2%",
    marginTop: "2%",
    marginBottom: "2%",
  },
  bookingFooter: { borderBottomRightRadius: 10, borderBottomLeftRadius: 10 },
});
