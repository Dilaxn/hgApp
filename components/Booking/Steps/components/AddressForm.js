import React from 'react';
import { TextInput, View, StyleSheet, Text, Pressable } from 'react-native';
import { Formik } from 'formik';
import css from '../../../commonCss';
import { CityDropDownSelect } from '../../../CityDropDownSelect';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { CustomRadioButton, CustomRadioButtonGroup } from '../../../CustomRadioButton';
import TextComp from '../../../TextComp';

const ADDRESS_TYPES = [{
    id: 1,
    label: 'Villa',
    value: 'VILLA'
}, {
    id: 2,
    label: 'Apartment',
    value: 'APARTMENT'
}]
const cityValue = 'Dubai';
export const AddressForm = ({ address, onSubmit }) => (

    <Formik
        initialValues={address}
        onSubmit={(e)=>{
            console.log(e)
            if(e.nickName && e.addressType && e.apartmentNo && e.community  && e.locationLat && e.locationLong  && e.streetAddress && e.city)
            {onSubmit(e)}
        }}
        enableReinitialize={true}
    >
        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values }) => (
            <View style={{ zIndex: 10 }}>
                <View style={[css.marginB10]}>
                    <TextInput
                        style={[form.input, styles.input]}
                        placeholder="Name"
                        value={values.nickName}
                        onChangeText={handleChange('nickName')}
                        onBlur={handleBlur('nickName')}
                    />
                    {!values.nickName &&
                    <Text style={{color:"red"}}>
                        Please enter Name
                    </Text>}
                </View>
                <View style={[css.flexDR, css.marginB10]}>
                    <CustomRadioButtonGroup
                        onChange={(v) => { setFieldValue('addressType', v) }}
                        value={values.addressType}
                        style={{ flex: 1, flexDirection: 'row' }}
                    >
                        {ADDRESS_TYPES.map(item => (
                            <CustomRadioButton value={item.value}>
                                <Text style={[css.alignSelfC, css.greyC, css.fm, css.f14]}>{item.label}</Text>
                            </CustomRadioButton>
                        ))}
                    </CustomRadioButtonGroup>
                </View>
                <View style={[css.flexDRSB, css.marginB10]}>
                    <View style={{width:"48%"}}>
                        <TextInput
                            style={[form.input, { width: '100%' }, styles.input]}
                            placeholder="Aprt./Villa No."
                            onChangeText={handleChange('apartmentNo')}
                            onBlur={handleBlur('apartmentNo')}
                            value={values.apartmentNo}
                        />
                        {!values.apartmentNo &&
                        <Text style={{color:"red"}}>
                            Please enter apartmentNo
                        </Text>}
                    </View>
                    <View style={{width:"48%"}}>
                    <TextInput
                        style={[form.input, { width: '100%' }, styles.input]}
                        placeholder="Street name"
                        onChangeText={handleChange('streetAddress')}
                        onBlur={handleBlur('streetAddress')}
                        value={values.streetAddress}
                    />
                        {!values.streetAddress &&
                        <Text style={{color:"red"}}>
                            Please enter streetAddress
                        </Text>}
                    </View>
                </View>
                <View style={[css.marginB10]}>
                    <TextInput
                        style={[form.input, styles.input]}
                        placeholder="Community / Building name"
                        onChangeText={handleChange('community')}
                        onBlur={handleBlur('community')}
                        value={values.community}
                    />
                    {!values.community &&
                    <Text style={{color:"red"}}>
                        Please enter community
                    </Text>}
                </View>
                <View style={[css.flexDR, css.marginB10]}>
                    <View style={{ width: '100%' }}>
                        <CityDropDownSelect
                            onChange={handleChange('city')}
                            value={values.city ? values.city : cityValue}
                        />
                        {!values.city &&
                        <Text style={{color:"red"}}>
                            Please enter city
                        </Text>}
                    </View>

                </View>

                <View style={[css.flexDR, css.marginB10]}>
                    <TextInput
                        style={[form.input, styles.input]}
                        placeholder="Country"
                        onChangeText={handleChange('emirate')}
                        onBlur={handleBlur('emirate')}
                        value={values.emirate || 'UAE'}
                        editable={false}
                    />
                </View>
                <View style={[css.flexDR_ALC, css.marginB10]}>
                    <TextComp>Save as default? </TextComp>
                    <Pressable
                        style={[styles.buttonYes, values.IsdefaultAddress == 'TRUE' ? styles.selectedBtn : '']}
                        onPress={() => setFieldValue('IsdefaultAddress', 'TRUE')}
                    >
                        <TextComp styles={[values.IsdefaultAddress == 'TRUE' ? styles.selectedText : '']}>Yes</TextComp>
                    </Pressable>
                    <Pressable
                        style={[styles.buttonYes, values.IsdefaultAddress != 'TRUE' ? styles.selectedBtn : '']}
                        onPress={() => setFieldValue('IsdefaultAddress', 'FALSE')}
                    >
                        <TextComp styles={[values.IsdefaultAddress != 'TRUE' ? styles.selectedText : '']}>No</TextComp>
                    </Pressable>
                </View>
                <View style={[css.flexDR, css.spaceB20]}>
                    <Pressable onPress={handleSubmit} style={[styles.save]}>
                        <TextComp styles={[css.fsb, css.f16, css.whiteC]}>SAVE ADDRESS</TextComp>
                    </Pressable>
                </View>
            </View>
        )}
    </Formik>
);
const form = StyleSheet.create({
    input: { borderRadius: 10, borderWidth: 1, borderColor: '#ccc', height: 40, width: '100%', paddingLeft: 20, paddingRight: 20, fontSize: wp('3%'), fontFamily: 'PoppinsR', color: '#525252' }
});

const styles = StyleSheet.create({
    save: {
        backgroundColor: '#f6b700',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        borderRadius: 27,
        fontFamily: 'PoppinsM',
        textAlign: 'center',
        textTransform: 'uppercase',
        ...css.boxShadow,
        width: '100%',
    },
    buttonYes: {
        backgroundColor: '#ccc', borderRadius: 25, paddingHorizontal: 15, paddingVertical: 5, marginHorizontal: 5
    },
    selectedBtn: { backgroundColor: '#2eb0e4' },
    selectedText: { color: '#fff' }
});
