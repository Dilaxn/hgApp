import { Image, View, StyleSheet, Text } from 'react-native';
import React from 'react';
import RNPickerSelect from "react-native-picker-select";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import css from "../commonCss";

const imgPath = '../../assets/icons/';

const CitySelect = ({ cities, currentCity, onChange }) => {

  const onCityChange = (city) => {
    onChange(city);
  }
  return (
    <View style={styles.citySelect}>
      {cities !== null && cities.length > 0 &&
        <RNPickerSelect
          placeholder={{}}
          items={cities}
          value={currentCity}
          onValueChange={(city) => onChange(city)}
          useNativeAndroidPickerStyle={false}
          textInputProps={{ style: [css.blackC, css.fm, css.f11, { top: 5 }] }}
          Icon={() => {
            return <Image style={{ width: 15, height: 15 }} source={require(imgPath + "downArrowSearch.png")} />;
          }}
          style={{
            ...pickerSelectStyles,
            iconContainer: {
              top: 12,
              right: 10,
            }
          }}
        />
      }
    </View>
  );
}

const styles = StyleSheet.create({
  citySelect: {
    width: '25%'
  }
})

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: wp('3%'),
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: "#525252",
    width: "100%",
    paddingRight: 0,
    fontFamily: 'PoppinsR',
  },
  inputAndroid: {
    fontSize: wp('3%'),
    paddingHorizontal: 0,
    paddingVertical: 0,
    color: "#525252",
    width: "100%",
    fontFamily: 'PoppinsR',
    paddingRight: 0,
    paddingHorizontal: 5,
    paddingVertical: 6,
  },
});
export default CitySelect;
