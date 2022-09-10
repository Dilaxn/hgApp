import { StyleSheet, View, Platform } from "react-native";
export default function ShadowCard({ children, style }) {
    return (
        <>
            <View style={[styles.container, style]}>{children}</View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        elevation: Platform.OS === 'android' ? 4 : 0,
        shadowColor: "#525252",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        backgroundColor: '#fff',
        borderRadius: 5,
    },
})