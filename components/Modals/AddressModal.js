import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Text,
} from "react-native";
import Modal from "react-native-modal";
import {
  getCurrentPositionAsync,
  useForegroundPermissions,
} from "expo-location";
import css from "../commonCss";

const windowHeight = Dimensions.get("window").height;
import AddressOption from "../Address/AddressOption";
import Map from "../Address/Map";
import { Client } from "@googlemaps/google-maps-services-js";
import { formatAddress } from "../../helpers/common";
import PlacesSearch from "../Address/PlacesSearch";
import { AddressForm } from "../Booking/Steps/components/AddressForm";
import { useDispatch } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  addAddress,
  editAddress as updateUserAddress,
} from "../../reducers/userReducer";
import BackArrow from "../ui/BackArrow";
import {loadHolidays} from "../../reducers/categoryReducer";

const imgPath = "../../assets/icons/";
const VIEW_OPTION = "option";
const VIEW_FORM = "form";

const DEFAULT_LOCATION = { lat: 25.204849, lng: 55.270783 };
const client = new Client({});
const DEFAULT_ADDRESS = () => ({
  nickName: null,
  apartmentNo: null,
  streetAddress: null,
  community: null,
  emirate: "UAE",
  addressType: "APARTMENT",
  IsdefaultAddress: "FALSE",
  locationLat: DEFAULT_LOCATION.lat,
  locationLong: DEFAULT_LOCATION.lng,
});

export default function AddressModal({ editAddress = null, onClose }) {
  const [currentView, setCurrentView] = useState(
    editAddress === null ? VIEW_OPTION : VIEW_FORM
  );
  const [address, setAddress] = useState(
    editAddress === null ? DEFAULT_ADDRESS() : editAddress
  );
  const [location, setLocation] = useState(
    editAddress === null
      ? DEFAULT_LOCATION
      : {
          lat: editAddress.locationLongLat[0],
          lng: editAddress.locationLongLat[1],
        }
  );
  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();
  const dispatch = useDispatch();

  const handleOptionChange = async (useCurrentLocation = false) => {
    console.log("works");
    if (!useCurrentLocation) {
      setCurrentView(VIEW_FORM);
    } else {
      const permissionResponse = await requestPermission();
      const location = await getCurrentPositionAsync();
      const lat = location.coords.latitude;
      const lng = location.coords.longitude;
      handleLocationChange({ lat, lng });
      setCurrentView(VIEW_FORM);
    }
  };

  const handleLocationChange = ({ lat, lng }) => {
    setLocation({ lat, lng });
    updateAddress({ lat, lng });
  };

  const updateAddress = async ({ lat, lng }) => {
    const params = {
      latlng: { lat, lng },
      language: "en",
      key: "AIzaSyC9BcyoxhP659a99NdfW2xuVkSIy2KsZcs",
    };
    const response = await client.reverseGeocode({ params: params });
    const addressObject = formatAddress(response.data.results[0]);
    setAddress({
      ...address,
      apartmentNo: addressObject.streetNumber,
      streetAddress: addressObject.streetName,
      community: addressObject.extra.neighborhood,
      city: addressObject.administrativeLevels.level1long,
      locationLat: lat,
      locationLong: lng,
    });
    //console.log('Updating Address.....', address);
  };

  const handleFormSubmit = async (data) => {
    let updated = false;
    let params = { ...data };
    if (editAddress !== null) {
      params.locationLat = params.locationLongLat[0];
      params.locationLong = params.locationLongLat[1];
      params.communtity = params.community;
      params.addressesID = params._id;
      delete params._id;
      delete params.community;
      delete params.locationLongLat;
      delete params.ownership;
      delete params.customer;
      delete params.garden;
      delete params.isDeleted;
      delete params.timestamp;
      updated = await dispatch(updateUserAddress(params));
    } else {
      params.communtity = params.community;
      delete params.community;
      updated = await dispatch(addAddress(params));
      console.log("updated",updated)
    }

    if (updated) {
      console.log(params);
      onClose();

    } else {
      console.log('address not saved');
    }
  };

  return (
    <Modal
      isVisible={true}
      animationIn="fadeInUp"
      animationInTiming={500}
      animationOut="fadeInDown"
      animationOutTiming={500}
      coverScreen={true}
      useNativeDriver={true}
      style={{ margin: 0 }}
      hideModalContentWhileAnimating={true}
      onBackButtonPress={() => onClose()}
      onBackdropPress={() => onClose()}
    >
      <View style={[css.modalNewView, styles.addressModal]}>
        <SafeAreaView>
          <ScrollView>
            <View style={[styles.wrapper]}>
              <BackArrow onPress={() => onClose()} />
              <View style={[styles.body]}>
                {currentView == VIEW_OPTION ? (
                  <AddressOption onChange={handleOptionChange} />
                ) : (
                  <View style={[styles.form]}>
                    <Map location={location} onChange={handleLocationChange} />
                    <View style={[css.padding20, { paddingHorizontal: 0 }]}>
                      <PlacesSearch onChange={handleLocationChange} />
                    </View>
                    <AddressForm
                      address={address}
                      onSubmit={handleFormSubmit}
                    />
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  addressModal: {
    backgroundColor: "#fff",
    padding: 20,
    height: windowHeight,
  },
  wrapper: {
    flexDirection: "column",
    height: "100%",
  },
  header: {
    fontSize: wp("3.4%"),
    flexGrow: 0,
  },
  body: {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 100,
  },
  form: {
    // flexDirection: 'column',
    // flexGrow: 1
  },
  boxShadow: {
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
  },
});
