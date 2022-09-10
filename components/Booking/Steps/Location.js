import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
  Dimensions,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-native-modal";
import { Feather, AntDesign, Ionicons } from "@expo/vector-icons";
import {
  CustomRadioButtonGroup,
  CustomRadioButton,
} from "../../CustomRadioButton";
import css from "../../commonCss";
import Text from "../../MyText";
import {
  addAddress,
  deleteAddress,
  getAddress,
} from "../../../reducers/userReducer";
import AddressModal from "../../Modals/AddressModal";
import TextComp from "../../TextComp";

export default function StepLocation({
  prev,
  updateAddressData,
  addressID,
  category,
}) {
  const [newAddress, setNewAddress] = useState(false);
  const [removeaddressModal, setRemoveaddressModal] = useState(false);
  const [deleteAddressId, setDeleteAddressId] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const addressList = useSelector(getAddress);
  const dispatch = useDispatch();
  const [currentAddress, setCurrentAddress] = useState(addressID || null);

  const deleteAddressById = async (id) => {
    await dispatch(deleteAddress(id));
  };

  const handleModalClose = () => {
    setIsActive(false);
    setNewAddress(false);
    setCurrentAddress(null);
  };

  const handleEdit = (data) => {
    setCurrentAddress(data);
    setIsActive(true);
  };

  const handleAddressChange = (id) => {
    const addr = addressList.find((item) => item._id === id);
    if (!addr) {
      return;
    }
    const { locationLongLat } = addr;
    updateAddressData(
      {
        addressID: id,
        locationLat: locationLongLat[0],
        locationLong: locationLongLat[1],
      },
      addr.addressType
    );
  };

  useEffect(() => {
    if (addressList && addressList.length && addressID == null) {
      let addr = addressList.find((x) => x.IsdefaultAddress == "TRUE");
      if (!addr) {
        addr = addressList[0];
      }
      const { locationLongLat } = addr;
      updateAddressData(
        {
          addressID: addr._id,
          locationLat: locationLongLat[0],
          locationLong: locationLongLat[1],
        },
        addr.addressType
      );
    }
  }, [addressList]);

  useEffect(() => {
    setCurrentAddress(addressID);
  }, [addressID]);

  return (
    <View style={[css.bookingScreenBox]}>
      <View>
        <Text style={[css.f18, css.fbo, css.brandC]}>
          Where do you want the service ?
        </Text>
      </View>
      <CustomRadioButtonGroup
        onChange={handleAddressChange}
        value={currentAddress}
      >
        {!addressList || addressList.length < 1 ? (
          <View style={[css.padding30]}>
            <TextComp style={[css.textCenter]}>No Address Found</TextComp>
          </View>
        ) : (
          addressList.map((item) => (
            <CustomRadioButton value={item._id}>
              <View
                style={[
                  {
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  },
                  css.line20,
                ]}
              >
                <View style={[css.flexDC, css.width80]}>
                  <Text style={[css.f14, css.fsb, css.blackC]}>
                    {item.nickName}
                    {item.IsdefaultAddress !== "FALSE" && " (Default)"}
                  </Text>
                  <Text style={[css.f14, css.fm, css.greyC, css.flexWrapW]}>
                    {item.addressType} {item.apartmentNo}, {item.streetAddress},{" "}
                    {item.community}, {item.city}, UAE{" "}
                  </Text>
                </View>
                <View
                  style={[
                    css.flexDR,
                    css.width20,
                    { alignSelf: "baseline", justifyContent: "flex-end" },
                  ]}
                >
                  <Pressable
                    onPress={() => handleEdit(item)}
                    style={{ width: 25 }}
                  >
                    <Feather name="edit" size={16} color="#2eb0e4" />
                  </Pressable>
                  <Pressable
                    style={{ width: 25 }}
                    onPress={() => {
                      setRemoveaddressModal(true), setDeleteAddressId(item._id);
                    }}
                  >
                    <Feather name="trash" size={16} color="#2eb0e4" />
                  </Pressable>
                </View>
              </View>
            </CustomRadioButton>
          ))
        )}
      </CustomRadioButtonGroup>
      <Pressable onPress={() => setNewAddress(true)} style={[css.flexDR]}>
        <Ionicons name="location-sharp" size={20} color="#2eb0e4" />
        <Text
          style={[css.brandC, css.f18, css.alignSelfC, css.fsb, css.marginL10]}
        >
          + Add new address
        </Text>
      </Pressable>
      {isActive && (
        <AddressModal onClose={handleModalClose} editAddress={currentAddress} />
      )}
      {newAddress && <AddressModal onClose={handleModalClose} />}
      <Modal
        isVisible={removeaddressModal}
        // animationIn='fadeIn'
        // animationInTiming={700}
        // animationOut='fadeOut'
        // animationOutTiming={700}
        coverScreen={true}
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}
      >
        <View style={css.centeredView}>
          <View style={css.modalNewView}>
            <View style={[css.modalNewHeader]}>
              <View>
                <Text style={[css.modalNewText, css.fm, css.f16, css.blackC]}>
                  Are you sure you want to delete the Address?
                </Text>
              </View>
            </View>
            <View
              style={[css.modalNewBody, css.alignItemsC, css.justifyContentC]}
            >
              <View style={[css.flexDRSE, css.imgFull]}>
                <TouchableOpacity
                  onPress={() => setRemoveaddressModal(false)}
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
                  <Text style={[css.blackC, css.fsb, css.f14]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    deleteAddressById(deleteAddressId),
                      setRemoveaddressModal(false);
                  }}
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
                  <Text style={[css.whiteC, css.fsb, css.f14]}>
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
