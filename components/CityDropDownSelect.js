
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useSelector } from 'react-redux';
import { getCities } from '../reducers/categoryReducer';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import css from './commonCss'

export const CityDropDownSelect = ({ value, onChange }) => {

    const cities = useSelector(getCities) || [];
    const [cityOpen, setCityOpen] = useState(false);
    const [cityItems, setCityItems] = useState(cities);

    return (
        <View>
            {cities.length !== 0 &&
                <DropDownPicker
                    style={[form.input]}
                    open={cityOpen}
                    value={value}
                    items={cityItems}
                    setOpen={setCityOpen}
                    onSelectItem={(item) => onChange(item.value)}
                    setItems={setCityItems}
                    listMode='MODAL'
                    textStyle={[css.fm, css.f14, css.blackC]}
                />
            }
        </View>
    );
}

const form = StyleSheet.create({
    input: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
    },
})