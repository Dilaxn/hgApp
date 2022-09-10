import { StyleSheet, View, Pressable, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function ButtonComp({ children, onPress, buttonContainer = '', textStyle = '' }) {
    const navigation = useNavigation();
    return (
        <>
            <Pressable
                style={({ pressed }) => [styles.buttonContainer, buttonContainer, textStyle, pressed && styles.pressed]}
                onPress={onPress}
            >
                <Text style={[styles.text]}>{children}</Text>
            </Pressable>
        </>
    )
}

const styles = StyleSheet.create({
    pressed: { opacity: 0.5 },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: "#525252",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 5,
        shadowRadius: 4,
    },
    text: { color: '#fff', fontFamily: 'PoppinsM', fontSize: wp('3.4%') }
})