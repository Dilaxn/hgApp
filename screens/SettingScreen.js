import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    ScrollView,
    Pressable,
    RefreshControl
} from "react-native";
import axios from "axios";
import { BASE_URL } from "../base_file";
import Text from "../components/MyText";
import ModalComingSoonComponent from "../components/Modals/ModalComingSoon";
import css from '../components/commonCss';
import { useDispatch, useSelector } from "react-redux";
import { getAccessToken, getUser } from '../reducers/authReducer';
import HeaderTitle from "../components/ui/HeaderTitle";
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { hideLoading, showLoading } from "../reducers/appReducer";
import { customerDetails, getAddress, getCustomerDetail, getCustomerDetails, loadAddress } from "../reducers/userReducer";
import { getAllMyCard, getAllMyCardData } from "../reducers/paymentReducer";
import {useIsFocused} from "@react-navigation/native";


export default function SettingScreen({ navigation }) {
    console.log("navigation",navigation)
    const userData = useSelector(getUser);
    console.log("userDetailsData",userData)
    const [displayEmail, setDisplayEmail] = useState(userData ? userData.email : '')
    const isFocused = useIsFocused();
    //const [customerDetailsData, setL] = useState(useSelector(getCustomerDetails))
    // console.log("customerDetailsData",customerDetailsData)
    const [customerAddresses, setCustomerAddresses] = useState(userData ? userData.customerAddresses : '')
  //  const [displayName, setDisplayName] = useState(userData ? userData.displayName : '')
    const [displayPhoneNumber, setDisplayPhoneNumber] = useState(userData ? userData.phoneNumber : '')

    const [displayCountryCode, setDisplayCountryCode] = useState(userData ? userData.countryCode : '')
    const [mail, setMail] = useState(userData ? userData.email : '')
    const [displayDOB, setDisplayDOB] = useState(userData ? userData.dob : '')
    const [displayLanguage, setDisplayLanguage] = useState(userData ? userData.language : '')
    const [displayNationality, setDisplayNationality] = useState(userData ? userData.nationality : '')
    const [useraddressType, setuseraddressType] = useState(userData ? userData.addressType : '')
    const [userapartmentNo, setuserapartmentNo] = useState(userData ? userData.apartmentNo : '')
    const [usercity, setusercity] = useState(userData ? userData.city : '')
    const [usercommunity, setusercommunity] = useState(userData ? userData.community : '')
    const [usernickName, setusernickName] = useState(userData ? userData.nickName : '')
    const [userdefaultCards, setuserdefaultCards] = useState(userData ? userData.defaultCards : '')
    const [isModalComponentVisible, setIsModalComponentVisible] = useState(false);
    const [allAddress, setAllAddress] = useState([]);
    const [y, setY] = useState(false);
    const [customerDetails, setCustomerDetails] = useState(null);
    const dispatch = useDispatch();
    const token = useSelector(getAccessToken);
    const getAllAddress = useSelector(getAddress)
    const customerDetailsData = useSelector(getCustomerDetails);
    const savedCards = useSelector(getAllMyCardData)
    const getAllDatas = async () => {
        let Address = getAllAddress;
        Address = Address.filter((item) => item.IsdefaultAddress == 'TRUE')
        Address = Address[0]
        setAllAddress(Address);
        let cards = savedCards;
        console.log('cards [settings cards]', savedCards);
    }

    const setUserDetails = async () => {
        let CD = await customerDetailsData;
        console.log("customerDetailsData[0]",CD)
        if(CD[0]){
            console.log("name[0]",CD[0].name)
            setDisplayName(CD[0].name)
            setDisplayEmail(CD[0].email)
            setDisplayPhoneNumber(CD[0].deviceToken)
        }
        else{
            setY(!y)
        }
    }
    useEffect(async () => {
        if (token != null) {
            // if(isFocused) {
                await dispatch(showLoading());
                await dispatch(getCustomerDetail(displayEmail));
                await dispatch(loadAddress());
                await dispatch(getAllMyCard());
                await getAllDatas();
                await setUserDetails()
                await dispatch(hideLoading());
            // }
        } else {
            navigation.navigate('AccountPage');
        }
    }, [isFocused,y]);

    const [displayName, setDisplayName] = useState(customerDetailsData[0] ? customerDetailsData[0].displayName : '')


    return (
        <View style={[styles.screen]}>
            <HeaderTitle title='Settings' />
            <ScrollView>
                <View style={[styles.section]}>
                    <View style={[styles.settingShadowBox, css.boxShadow]}>
                        <View style={[css.flexDRSB, css.line10]}>
                            <View style={[css.flexDR_ALC]}>
                                <Ionicons name="information-circle-outline" size={24} color="#525252" />
                                <Text style={[css.marginL10, css.f16, css.fm, css.blackC]}>BASIC INFO</Text>
                            </View>
                            <Pressable
                                style={({ pressed }) => [pressed && styles.pressed]}
                                onPress={() => navigation.navigate('SettingAddInfoPage')}
                            >
                                <Feather name="edit" size={20} color="#525252" />
                            </Pressable>
                        </View>
                        <View style={[css.flexDR, css.spaceB5]}>
                            <Text style={[styles.settingShadowBoxText, css.width30, { color: '#60604E' }]}>Name</Text>
                            <Text style={[styles.settingShadowBoxText, css.fm, css.width70]}>{displayName ? displayName : ''}</Text>
                        </View>
                        <View style={[css.flexDR, css.spaceB5]}>
                            <Text style={[styles.settingShadowBoxText, css.width30, { color: '#60604E' }]}>Mobile</Text>
                            <Text style={[styles.settingShadowBoxText, css.fm, css.f14, css.width70]}>{displayPhoneNumber  ? (displayCountryCode + ' ' + displayPhoneNumber) : ''}</Text>
                        </View>
                        <View style={[css.flexDR]}>
                            <Text style={[styles.settingShadowBoxText, css.width30, { color: '#60604E' }]}>Email ID</Text>
                            <Text style={[styles.settingShadowBoxText, css.fm, css.f14, css.width70]}>{mail ? mail : ''}</Text>
                        </View>
                        {/* <View style={[css.flexDR, css.spaceB5]}>
                            <Text style={[styles.settingShadowBoxText, css.width30, { color: '#60604E' }]}>Name</Text>
                            <Text style={[styles.settingShadowBoxText, css.fm, css.width70]}>{customerDetails.name ? customerDetails.name : ''}</Text>
                        </View>
                        <View style={[css.flexDR, css.spaceB5]}>
                            <Text style={[styles.settingShadowBoxText, css.width30, { color: '#60604E' }]}>Mobile</Text>
                            <Text style={[styles.settingShadowBoxText, css.fm, css.f14, css.width70]}>{customerDetails.countryCode && customerDetails.mobile ? (customerDetails.countryCode + ' ' + customerDetails.mobile) : ''}</Text>
                        </View>
                        <View style={[css.flexDR]}>
                            <Text style={[styles.settingShadowBoxText, css.width30, { color: '#60604E' }]}>Email ID</Text>
                            <Text style={[styles.settingShadowBoxText, css.fm, css.f14, css.width70]}>{customerDetails.email ? customerDetails.email : ''}</Text>
                        </View> */}
                    </View>
                    <View style={[styles.settingShadowBox, css.boxShadow]}>
                        <View style={[css.flexDRSB, css.line10]}>
                            <View style={[css.flexDR_ALC]}>
                                <Ionicons name="location-outline" size={24} color="#525252" />
                                <Text style={[css.marginL10, css.f16, css.fm, css.blackC]}>ADDRESS</Text>
                            </View>
                            <Pressable
                                style={({ pressed }) => [pressed && styles.pressed]}
                                onPress={() => navigation.navigate('SettingAddAddressPage')}
                            >
                                <Feather name="edit" size={20} color="#525252" />
                            </Pressable>
                        </View>
                        {allAddress ?
                            <View>
                                <Text style={[css.lGreyC, css.f14, css.feb]}>{allAddress.nickName}</Text>
                                <Text style={[css.blackC, css.f14, css.fr]}>{allAddress.apartmentNo}, {allAddress.addressType}, {allAddress.community}, {allAddress.city} </Text>
                            </View>
                            :
                            <View>
                                <Text style={[css.blackC, css.f14, css.fr]}>No saved Address</Text>
                            </View>
                        }
                    </View>
                    <View style={[styles.settingShadowBox, css.boxShadow]}>
                        <View style={[css.flexDRSB, css.line10]}>
                            <View style={[css.flexDR_ALC]}>
                                <Feather name="credit-card" size={24} color="#525252" />
                                <Text style={[css.marginL10, css.f16, css.fm, css.blackC]}>CARDS</Text>
                            </View>
                            <View>
                                <Pressable
                                    style={({ pressed }) => [pressed && styles.pressed]}
                                    onPress={() => navigation.navigate('SettingAddCardPage')}
                                >
                                    <Feather name="edit" size={20} color="#525252" />
                                </Pressable>
                            </View>
                        </View>
                        <View><Text style={[css.lGreyC, css.f14, css.fr]}>{userdefaultCards ? userdefaultCards : 'No saved Cards'}</Text></View>
                    </View>
                    <View style={[styles.settingShadowBox, css.boxShadow]}>
                        <View style={[css.flexDRSB, css.line10]}>
                            <View style={[css.flexDR_ALC]}>
                                <MaterialIcons name="favorite-outline" size={24} color="#525252" />
                                <Text style={[css.marginL10, css.f16, css.fm, css.blackC]}>FAVOURITES</Text>
                            </View>
                            <View>
                                <Pressable
                                    style={({ pressed }) => [pressed && styles.pressed]}
                                    onPress={() => setIsModalComponentVisible(true)}
                                >
                                    <Feather name="edit" size={20} color="#525252" />
                                </Pressable>
                            </View>
                        </View>
                        <View>
                            <Text style={[css.lGreyC, css.f14, css.fr, { color: '#60604E' }]}>0 Favourite Genie</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <ModalComingSoonComponent isVisible={isModalComponentVisible} onClose={() => setIsModalComponentVisible(false)} />
        </View>
    );
};

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#fff' },
    section: { padding: 20 },
    pressed: { opacity: 0.5 },
    settingShadowBox: {
        backgroundColor: "white",
        borderRadius: 5,
        height: 'auto',
        padding: 20,
        marginBottom: 20
    },
    settingShadowBoxText: { ...css.f14, fontFamily: 'PoppinsR', color: '#525252' },
    titleIcon: { width: 20, height: 20 },
    editIcon: { width: 20, height: 20 },
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
});