import { StyleSheet, View, Pressable, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from '@expo/vector-icons'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function HeaderTitle({ title, style }) {
    const navigation = useNavigation();
    return (
        <>
            <View style={[styles.header, style]}>
                <Pressable
                    style={({ pressed }) => [styles.buttonContainer, pressed && styles.pressed]}
                    onPress={() => navigation.goBack()}
                >
                    <AntDesign style={[styles.backButton]} name="arrowleft" size={wp('4.85%')} color="white" />
                    <Text style={[styles.headerTitle]}>{title}</Text>
                </Pressable>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    pressed: { opacity: 0.5 },
    header: {
        width: "100%",
        height: 70,
        padding: 20,
        backgroundColor: "#2eb0e4",
        justifyContent: "center",
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 10,
        shadowColor: "#000",
    },
    buttonContainer: { flexDirection: 'row', alignItems: 'center' },
    headerTitle: {
        color: "#fff",
        fontSize: wp('4.85%'),
        fontFamily: 'PoppinsSB',
        textTransform: "uppercase",
    },
    backButton: {
        marginRight: 10,
    },
})