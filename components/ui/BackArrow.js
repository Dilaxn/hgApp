import { StyleSheet, View, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from '@expo/vector-icons';
import css from "../commonCss";
import TextComp from "../TextComp";

export default function BackArrow({ onPress, style, icon = "arrowleft", size = 24, color = "#525252", text = null }) {
    const navigation = useNavigation();
    return (
        <>
            <Pressable
                style={({ pressed }) => [css.flexDR, css.marginT20, css.marginB20, style, pressed && styles.pressed]}
                onPress={onPress}
            >
                <AntDesign name={icon} size={size} color={color} />
                {text && <TextComp styles={[css.marginL5]}>{text}</TextComp>}
            </Pressable>
        </>
    )
}

const styles = StyleSheet.create({
    pressed: { opacity: 0.5 },
})