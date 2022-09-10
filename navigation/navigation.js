//import * as React from 'react';
import React, { useState, useEffect } from "react";
import { Image, LogBox, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer, useIsFocused } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { navigationRef } from "./RootNavigation";
import * as RootNavigation from "./RootNavigation";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import MessageModal from "../components/Modals/MessageModal";

import homeScreen from "../screens/Dashboard/homeScreen";
import AccountScreen from "../screens/Dashboard/login";
import MyBookingScreen from "../screens/MyBookingScreen";
import GenieLoaded from "../screens/Booking/GenieLoaded";
import OfferScreen from "../screens/OfferScreen";
import SupportScreen from "../screens/SupportScreen";
import WalletScreen from "../screens/WalletScreen";
import SettingScreen from "../screens/SettingScreen";
import NotificationScreen from "../screens/NotificationScreen";
import ReferEarnScreen from "../screens/ReferEarnScreen";
import SettingAddCardScreen from "../screens/UserScreens/SettingAddCardScreen";
import SettingAddAddressScreen from "../screens/UserScreens/SettingAddAddressScreen";
import SettingAddInfoScreen from "../screens/UserScreens/SettingAddInfoScreen";
import JobDetailScreen from "../screens/JobDetailScreen";
import PaymentScreen from "../screens/PaymentScreen";
import PaymentStatus from "../screens/PaymentStatus";
import SearchBar from "../components/Search/SearchBar";
import NewCard from "../screens/NewCard";
import GetgenieCategories from "../screens/Booking/GetgenieCategories";
import Browser from "../screens/Browser";
import BrowserNoBack from "../screens/BrowserNoBack";
import Browser1 from "../screens/Browser1";
import BookingFlow from "../components/Booking";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { Ionicons, Feather, FontAwesome5 } from "@expo/vector-icons";
import { isLoading } from "../reducers/appReducer";
import { getError, showError, hideError } from "../ErrorMessage";

import { useSelector, useDispatch } from "react-redux";

import StatusBarAll from "../components/StatusBar";
import { getAccessToken } from "../reducers/authReducer";
import LoginModal from "../components/LoginModal";
import { useNetInfo } from "@react-native-community/netinfo";

// import { useNavigation } from "@react-navigation/native";

// const navigation = useNavigation();

let imagePath = "../assets/icons/";
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
LogBox.ignoreAllLogs(true);

const StackScreen = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="HomePage"
    >
      <Stack.Screen
        name="HomePage"
        component={HomeTab}
        options={{ gestureEnabled: false }}
        screenOptions={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyBookingPage"
        component={HomeTab}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="GetgenieCategories"
        component={GetgenieCategories}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="BookingFlow"
        component={BookingFlow}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="OfferPage"
        component={HomeTab}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="AccountPage"
        component={HomeTab}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="SettingAddCardPage"
        component={SettingAddCardScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="SettingAddAddressPage"
        component={SettingAddAddressScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="SettingAddInfoPage"
        component={SettingAddInfoScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="Browser"
        component={Browser}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="BrowserNoBack"
        component={BrowserNoBack}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="Browser1"
        component={Browser1}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="GenieLoaded"
        component={GenieLoaded}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="JobdetailPage"
        component={JobDetailScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="PaymentPage"
        component={PaymentScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="PaymentStatus"
        component={PaymentStatus}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="NewCard"
        component={NewCard}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="Search"
        component={SearchBar}
        options={{ gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
};
const HomeStackScreen = ({ navigation }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="HomePage"
        component={homeScreen}
        options={{ gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
};
const MyBookingStackScreen = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="MyBookingPage"
    >
      <Stack.Screen
        name="MyBookingPage"
        component={MyBookingScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="JobdetailPage"
        component={JobDetailScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="PaymentPage"
        component={PaymentScreen}
        options={{ gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
};
const LoginStackScreen = ({ navigation }) => {
  const [isLoginRequestModal, setIsLoginRequestModal] = useState(false);
  console.log("login stack");

  const isFocused = useIsFocused();

  useEffect(() => {
    console.log("login stack useEffect");
  }, [isFocused]);

  return (
    <>
      {isFocused && (
        <LoginModal
          changeData={true}
          falseData={(data) => setIsLoginRequestModal(data)}
          userData={() => {}}
          noLogin={true}
        />
      )}
    </>
  );
};

const GetgenieStackScreen = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="GetgenieCategories"
      options={{ headerShown: false }}
    >
      <Stack.Screen
        name="GetgenieCategories"
        component={GetgenieCategories}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
const OfferStackScreen = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="OfferScreen"
    >
      <Stack.Screen
        name="OfferScreen"
        component={OfferScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="ReferEarnPage"
        component={ReferEarnScreen}
        options={{ gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
};
const AccountStackScreen = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="AccountPage"
    >
      <Stack.Screen
        name="AccountPage"
        component={AccountScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="SupportPage"
        component={SupportScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="WalletPage"
        component={WalletScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="NotificationPage"
        component={NotificationScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="SettingPage"
        component={SettingScreen}
        options={{ gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
};
const HomeTab = ({ navigation }) => {
  const token = useSelector(getAccessToken);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          //height: 75,
          height: wp("18%"),
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          paddingTop: 10,
          paddingBottom: 10,
          shadowColor: "#000",
          shadowOpacity: 0.5,
          shadowRadius: 4,
          shadowOffset: {
            height: -5,
            width: 0,
          },
          elevation: 10,
          zIndex: 10,
          backgroundColor: "#fff",
        },
        tabBarOptions: {
          style: {
            marginTop: 10,
          },
        },
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "Home") {
            return (
              <Ionicons name="home-outline" size={wp("5%")} color="#7e7e7e" />
            );
          } else if (route.name === "Bookings") {
            return <Feather name="calendar" size={wp("5%")} color="#7e7e7e" />;
          } else if (route.name === "GetgenieScreen") {
            return (
              <Image
                //style={{ width: 65, height: 65, marginTop: -20 }}
                style={{ width: wp("16%"), height: wp("16%"), marginTop: -20 }}
                source={require(imagePath + "genieNavbar.png")}
              />
            );
          } else if (route.name === "Offers") {
            return <Feather name="tag" size={wp("5%")} color="#7e7e7e" />;
          } else if (route.name === "Account") {
            return (
              <FontAwesome5
                name="user-circle"
                size={wp("5%")}
                color="#7e7e7e"
              />
            );
          }
        },
        tabBarActiveTintColor: "#2EB0E4",
        tabBarInactiveTintColor: "#525252",
        tabBarLabelStyle: {
          fontSize: wp("3%"),
          color: "#2EB0E4",
          fontFamily: "PoppinsM",
        },
        tabBarItemStyle: {
          borderRightColor: "#ededed",
          borderRightWidth: 1,
          height: wp("12%"),
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen
        name="Bookings"
        component={token ? MyBookingStackScreen : LoginStackScreen}
      />
      <Tab.Screen
        name="GetgenieScreen"
        component={GetgenieStackScreen}
        options={{
          title: "",
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tab.Screen name="Offers" component={OfferStackScreen} />
      <Tab.Screen name="Account" component={AccountStackScreen} />
    </Tab.Navigator>
  );
};

const MainDrawer = ({ navigation }) => {
  const enableSpinner = useSelector(isLoading);
  const error = useSelector(getError);
  const dispatch = useDispatch();

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <StatusBarAll />
      <NavigationContainer ref={navigationRef}>
        <StackScreen />
        {enableSpinner && <LoadingOverlay />}

        {error?.showError && (
          <MessageModal
            isVisible={error?.showError}
            onClose={() => {
              dispatch(hideError());
              if (error?.statusCode == 401) {
                RootNavigation.navigate("Home");
              }
            }}
            message={error?.errorTitle}
            message2={error?.errorMessage}
            button="OKAY, GOT IT"
          />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};
export default MainDrawer;
