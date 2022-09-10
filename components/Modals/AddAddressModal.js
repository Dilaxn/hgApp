import React, { useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    Pressable,
    TextInput,
    SafeAreaView
} from "react-native";
import Modal from 'react-native-modal';
import { RadioButton } from 'react-native-paper';
import DropDownPicker from 'react-native-dropdown-picker';
import MapView, { Marker } from 'react-native-maps';
import css from '../commonCss';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
let imgPath = '../../assets/icons/';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSelector } from "react-redux";
import { getCities } from "../../reducers/categoryReducer";
import TextComp from "../TextComp";

export default function AddAddressModal({ isVisible, onClose, addNewAddress }) {

    const cities = useSelector(getCities) || [];
    const getCity = (cities) => {
        return cities.map(item => ({ label: item.label.name, value: item.label.name + (new Date()).getTime() }));
    }
    // console.log(cities);
    const [cityOpen, setCityOpen] = useState(false);
    const [cityItems, setCityItems] = useState([
        { label: 'Dubai', value: 'dubai' },
        { label: 'Abu Dhabi', value: 'adbudhabi' }
    ]);

    const [nickName, setNickName] = useState(null);
    const [apartmentNo, setApartmentNo] = useState(null);
    const [streetAddress, setStreetAddress] = useState(null);
    const [communtity, setCommuntity] = useState(null);
    const [emirate, setEmirate] = useState(null);
    const [addressType, setAddressType] = useState('VILLA');
    const [IsdefaultAddress, setIsdefaultAddress] = useState('FALSE');
    const [city, setCity] = useState(null);
    const [locationLat, setLocationLat] = useState(25.2048493);
    const [locationLong, setLocationLong] = useState(55.2707828);

    const submit = () => {
        addNewAddress({
            nickName,
            apartmentNo,
            streetAddress,
            communtity,
            city,
            emirate,
            addressType,
            IsdefaultAddress,
            locationLat,
            locationLong
        });
    }

    return (
        <Modal
            isVisible={isVisible}
            animationIn='fadeInUp'
            animationInTiming={500}
            animationOut='fadeInDown'
            animationOutTiming={500}
            coverScreen={true}
            useNativeDriver={true}
            style={{ margin: 0 }}
            hideModalContentWhileAnimating={true}
            onBackButtonPress={() => onClose()}
            onBackdropPress={() => onClose()}
        >
            <View style={bookModal.modalViewFull}>
                <SafeAreaView>
                    <View style={[bookModal.modalHeader]}>
                        <TouchableOpacity
                            style={[css.flexDR,]}
                            onPress={() => onClose()}
                        >
                            <Image style={[css.marginT5]} source={require(imgPath + 'backArrowBlack.png')} />
                            <Text style={[css.marginL10, css.f18, css.fm, css.greyC,]}>Back</Text>
                        </TouchableOpacity>
                        <View style={[css.marginL20,]}>
                            <Text style={[css.blackC, css.f16, css.fbo, css.marginT10, css.textCenter]}>Complete all details to add / edit an address.</Text>
                        </View>
                    </View>
                    <ScrollView>
                        <View style={[bookModal.modalBody]}>
                            <View>
                                <MapView
                                    style={{ width: '100%', height: 200 }}
                                    initialRegion={{
                                        latitude: 25.06863606639939,
                                        longitude: 55.14505291115706,
                                        latitudeDelta: 25.06863606639939,
                                        longitudeDelta: 55.14505291115706,
                                    }}
                                >
                                    <Marker coordinate={{
                                        latitude: 25.06863606639939,
                                        longitude: 55.14505291115706
                                    }} />
                                </MapView>
                            </View>
                            <View style={[css.padding20, css.marginT20]}>
                                <View style={[css.marginB10]}>
                                    <TextInput
                                        style={[form.input,]}
                                        // onChangeText={onChangeNumber}
                                        // value={number}
                                        placeholder="Search location on map"
                                    //keyboardType="numeric"
                                    />
                                </View>
                                <View style={[css.marginB10]}>
                                    <TextInput
                                        style={[form.input]}
                                        placeholder="Name"
                                        onChangeText={setNickName}
                                    />
                                </View>
                                <View style={[css.flexDR, css.marginB10]}>
                                    <View style={[css.flexDR, css.width50]}>
                                        <RadioButton
                                            value="VILLA"
                                            status={addressType === 'VILLA' ? 'checked' : 'unchecked'}
                                            onPress={() => setAddressType('VILLA')}
                                            color='#2eb0e4'
                                            uncheckedColor='#ccc'
                                        />
                                        <Text style={[css.alignSelfC, css.greyC, css.fm, css.f16, css.fr]}>Villa</Text>
                                    </View>
                                    <View style={[css.flexDR]}>
                                        <RadioButton
                                            value="APARTMENT"
                                            status={addressType !== 'VILLA' ? 'checked' : 'unchecked'}
                                            onPress={() => setAddressType('APARTMENT')}
                                            color='#2eb0e4'
                                            uncheckedColor='#ccc'
                                        />
                                        <Text style={[css.alignSelfC, css.greyC, css.fm, css.f16, css.fr]}>Apartment</Text>
                                    </View>
                                </View>
                                <View style={[css.flexDRSB, css.marginB10]}>
                                    <TextInput
                                        style={[form.input, { width: '48%' }]}
                                        placeholder="Aprt./Villa No."
                                        onChangeText={setApartmentNo}
                                    />
                                    <TextInput
                                        style={[form.input, { width: '48%' }]}
                                        placeholder="Street name"
                                        onChangeText={setStreetAddress}
                                    />
                                </View>
                                <View style={[css.marginB10]}>
                                    <TextInput
                                        style={[form.input,]}
                                        placeholder="Community / Building name"
                                        onChangeText={setCommuntity}
                                    />
                                </View>
                                <View style={[css.flexDR, css.marginB10]}>
                                    {!!cities && cities.length &&
                                        <DropDownPicker
                                            style={[form.input,]}
                                            open={cityOpen}
                                            value={city}
                                            items={cityItems}
                                            setOpen={setCityOpen}
                                            setValue={setCity}
                                            setItems={setCityItems}
                                        />
                                    }
                                </View>
                                <View style={[css.flexDR, css.marginB10]}>
                                    <TextInput
                                        style={[form.input,]}
                                        placeholder="Country"
                                        onChangeText={setEmirate}
                                    />
                                </View>
                                <View style={[css.flexDR_ALC, css.marginB10]}>
                                    <TextComp>Save as default? </TextComp>
                                    <Pressable style={[styles.buttonYes, styles.selectedBtn]}><TextComp styles={[styles.selectedText]}>Yes</TextComp></Pressable>
                                    <Pressable style={[styles.buttonYes]}><TextComp>No</TextComp></Pressable>
                                </View>
                                <Pressable
                                    onPress={submit}
                                    style={[css.boxShadow, css.yellowBtn, { height: 50, width: '100%' }]}
                                >
                                    <Text style={[css.fsb, css.f24, css.whiteC]}>SAVE ADDRESS</Text>
                                </Pressable>
                            </View>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View>
        </Modal>
    );
};

const bookModal = StyleSheet.create({
    modalViewFull: {
        backgroundColor: "white",
        padding: 20,
        height: windowHeight,
    },
    modalHeader: { fontSize: wp('3.4%'), },

})
const form = StyleSheet.create({
    input: { borderRadius: 10, borderWidth: 1, borderColor: '#ccc', height: 50, width: '100%', paddingLeft: 20, paddingRight: 20, fontSize: wp('3.4%'), fontFamily: 'PoppinsR', color: '#525252' },
})
const styles = StyleSheet.create({
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
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
    },
    buttonYes: {
        backgroundColor: '#ccc', borderRadius: 25, paddingHorizontal: 15, paddingVertical: 5, marginHorizontal: 5
    },
    selectedBtn: { backgroundColor: '#2eb0e4' },
    selectedText: { color: '#fff' }
})