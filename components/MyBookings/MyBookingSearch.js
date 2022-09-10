import { StyleSheet, View, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons';
import css from "../commonCss";

export default function MyBookingSearch({ onChangeText, style }) {
    const navigation = useNavigation();
    return (
        <>
            <View>
                <TextInput
                    style={[css.borderRadius10, css.borderBrand1, css.BGwhite, css.brandC, css.paddingL20, css.paddingR20, css.marginT10, css.marginB5, { height: 35, marginLeft: '2%', marginRight: '2%' }]}
                    onChangeText={onChangeText}
                    placeholder="Search"
                    placeholderTextColor="#2eb0e4"
                    placeholderTextAlign="right"
                />
                <MaterialIcons
                    style={[{ position: 'absolute', right: 15, top: 15 }]}
                    name="search" size={24} color="#2eb0e4" />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    pressed: { opacity: 0.5 },
})