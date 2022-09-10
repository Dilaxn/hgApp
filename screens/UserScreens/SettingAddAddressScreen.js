import React, { useState, useEffect } from "react";
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
    TextInput,
} from "react-native";
import Modal from "react-native-modal";
import css from "../../components/commonCss";
import { BASE_URL } from "../../base_file";
import { RadioButton } from 'react-native-paper';
import { Feather } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import { useDispatch, useSelector } from "react-redux";
import { getAccessToken } from "../../reducers/authReducer";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { hideLoading, showLoading } from "../../reducers/appReducer";
import AddressModal from "../../components/Modals/AddressModal";
import { deleteAddress } from "../../reducers/userReducer";
let imgPath = "../../assets/icons/";
const windowHeight = Dimensions.get("window").height;

export default function SettingAddAddressScreen({ navigation }) {
    const dispatch = useDispatch();
    const [removeaddressModal, setRemoveaddressModal] = useState(false);
    const token = useSelector(getAccessToken);
    const [allAddressData, setAllAddressData] = useState([]);
    const [newAddress, setNewAddress] = useState(false);
    const [currentAddress, setCurrentAddress] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [deleteAddressId, setDeleteAddressId] = useState(null);
    const [radioValue, setRadioValue] = useState(null);
    console.log('radioValue [select radio button]', radioValue);
    const handleModalClose = () => {
        setNewAddress(false);
        getAllAddress();
        setIsActive(false);
    };

    const getAllAddress = async () => {
        try {
            await dispatch(showLoading);
            const api = `${BASE_URL}customer/getAllAddress`;
            const response = await fetch(api, {
                method: "GET",
                headers: new Headers({
                    Authorization: `Bearer ${token}`,
                }),
            });
            const jsonData = await response.json();
            let array = jsonData.data;
            console.log("Address [setting addaddress screen]", array);
            setAllAddressData(array);
            await dispatch(hideLoading);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteAddressById = async (id) => {
        await dispatch(deleteAddress(id));
        setRemoveaddressModal(false);
        getAllAddress();
    };

    const handleEdit = (data) => {
        setCurrentAddress(data);
        setIsActive(true);
    };
    useEffect(() => {
        getAllAddress();
    }, []);

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
                        <Ionicons name="location-outline" size={wp("6%")} color="white" />
                        <Text style={[css.headerTitle, css.marginL10, css.f20]}>
                            ADDRESS
                        </Text>
                    </View>
                </View>
            </View>
            <ScrollView>
                {!allAddressData ? (
                    <View style={[css.section]}>
                        <View style={[css.container, { height: windowHeight - 100 }]}>
                            <View style={[css.flexDCSB, css.alignItemsC, { flex: 1 }]}>
                                <View
                                    style={[
                                        css.imgBR150,
                                        css.whiteBG,
                                        css.alignCenter,
                                        css.marginT30,
                                    ]}
                                >
                                    <Image
                                        style={[css.img100]}
                                        source={require(imgPath + "iconAddAddress.png")}
                                    />
                                </View>
                                <View>
                                    <Text style={[css.f18, css.textCenter, css.blackC]}>
                                        No Addressess yet. {"\n"} Add an address to enjoy {"\n"} a
                                        home service
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={[
                                        css.blueBtn,
                                        css.boxShadow,
                                        css.imgFull,
                                        { height: 50 },
                                    ]}
                                    onPress={() => setAddaddressModal(true)}
                                >
                                    <Text style={[css.whiteC, css.f18, css.textCenter, css.fsb]}>
                                        + ADD ADDRESS
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ) : (
                    <View style={[css.section]}>
                        <View style={[css.container]}>
                            <View style={[css.boxShadow, css.whiteBG, css.borderRadius10]}>
                                <Text
                                    style={[
                                        css.line10,
                                        css.blackC,
                                        css.f24,
                                        css.textCenter,
                                        css.fm,
                                        css.marginT30,
                                        { marginBottom: 0 },
                                    ]}
                                >
                                    ADD OR REVIEW
                                </Text>
                                <FlatList
                                    data={allAddressData}
                                    keyExtractor={(item, index) => {
                                        return item._id;
                                    }}
                                    renderItem={({ item }) => (
                                        <View>
                                            {/* <View style={[css.flexDRSB, css.padding20, css.line]}>
                                                <View style={styles.rbWrapper}>
                                                    <TouchableOpacity
                                                        style={[
                                                            styles.rbStyle,
                                                            { alignSelf: "center", marginRight: 10 },
                                                        ]}
                                                    >
                                                        <View style={styles.notSelected} />
                                                    </TouchableOpacity>
                                                    <View style={[css.flexDC, { alignSelf: "flex-start" }]}>
                                                        <Text style={[css.f14, css.fsb, css.blackC]}>
                                                            {item.nickName ? item.nickName : ""}
                                                        </Text>
                                                        {item.IsdefaultAddress === "TRUE" ? (
                                                            <Text style={[css.f4, css.fsb, css.blackC]}>
                                                                (Default)
                                                            </Text>
                                                        ) : null}
                                                        <Text style={[css.f14, css.fm, css.greyC]}>
                                                            {item.apartmentNo}, {item.addressType},{" "}
                                                            {item.community}, {item.city}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={[css.flexDC]}>
                                                    <Pressable
                                                        style={[css.padding5]}
                                                        onPress={() => handleEdit(item)}
                                                    >
                                                        <Feather name="edit" size={16} color="#2eb0e4" />
                                                    </Pressable>
                                                    <Pressable
                                                        style={[css.padding5]}
                                                        onPress={() => {
                                                            setRemoveaddressModal(true),
                                                                setDeleteAddressId(item._id);
                                                        }}
                                                    >
                                                        <Feather name="trash" size={16} color="#2eb0e4" />
                                                    </Pressable>
                                                </View>
                                            </View> */}
                                            <View>
                                                <RadioButton.Group onValueChange={newValue => setRadioValue(newValue)} value={radioValue}>
                                                    <View style={[css.flexDRSB, css.padding20, css.line10, css.imgFull]}>
                                                        <View style={{ width: 'auto' }}><RadioButton value={item._id} /></View>
                                                        <View style={[css.width70]}>
                                                            <View style={[css.flexDC, { alignSelf: "flex-start" }]}>
                                                                <Text style={[css.f14, css.fsb, css.blackC]}>
                                                                    {item.nickName ? item.nickName : ""}
                                                                </Text>
                                                                {item.IsdefaultAddress === "TRUE" ? (
                                                                    <Text style={[css.f4, css.fsb, css.blackC]}>
                                                                        (Default)
                                                                    </Text>
                                                                ) : null}
                                                                <Text style={[css.f14, css.fm, css.greyC]}>
                                                                    {item.apartmentNo}, {item.addressType},{" "}
                                                                    {item.community}, {item.city}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                        <View style={[css.flexDC, css.width10]}>
                                                            <Pressable style={[css.padding5]} onPress={() => handleEdit(item)} >
                                                                <Feather name="edit" size={16} color="#2eb0e4" />
                                                            </Pressable>
                                                            <Pressable style={[css.padding5]} onPress={() => { setRemoveaddressModal(true), setDeleteAddressId(item._id); }} >
                                                                <Feather name="trash" size={16} color="#2eb0e4" />
                                                            </Pressable>
                                                        </View>
                                                    </View>
                                                </RadioButton.Group>
                                            </View>
                                        </View>
                                    )}
                                />
                                {isActive && (
                                    <AddressModal
                                        onClose={handleModalClose}
                                        editAddress={currentAddress}
                                    />
                                )}
                                <View style={[css.flexDCSB, css.alignItemsC, css.padding20]}>
                                    <TouchableOpacity
                                        style={[
                                            css.blueBtn,
                                            css.boxShadow,
                                            css.imgFull,
                                            css.marginT5,
                                            { height: 50 },
                                        ]}
                                        onPress={() => setNewAddress(true)}
                                    >
                                        <Text
                                            style={[css.whiteC, css.f18, css.textCenter, css.fsb]}
                                        >
                                            + ADD ADDRESS
                                        </Text>
                                    </TouchableOpacity>
                                    {newAddress && <AddressModal onClose={handleModalClose} />}
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            </ScrollView>
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
const bookModal = StyleSheet.create({
    modalViewFull: {
        backgroundColor: "white",
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
    notSelected: {
        width: 15,
        height: 15,
        borderRadius: 55,
        backgroundColor: "#fff",
    },
});
